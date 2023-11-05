import * as logger from "firebase-functions/logger";
import TwitterApi from 'twitter-api-v2';

const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const functions = require("firebase-functions")

initializeApp();

exports.addmessage = onRequest(async (req: any, res: any) => {
  console.log('addMessage function!!!');
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
    .collection("messages")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID??: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event: any) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({ uppercase }, { merge: true });
});

exports.addToTwitterListEvery15Minutes = functions.pubsub.schedule('*/3 * * * *').onRun(async (context: any) => {
  //exports.moveWaitlistToMember = onRequest(async (req: any, res: any) => {
  try {
    const firestore = await getFirestore()

    //GET list information
    const docId = '4311054b-68d0-43e3-a87e-e5a82c9a42f4';
    const documentRef = firestore.collection("lists").doc(docId);
    const docSnapshot = await documentRef.get();

    if (!docSnapshot.exists) {
      console.log('No such document!');
      return;
    }
    const docData = docSnapshot.data();
    if (!docData || !Array.isArray(docData.waitlist) || docData.waitlist.length === 0) {
      return;
    }

    //GET owner information
    const ownerId = docData?.owner
    const ownerRef = firestore.collection("users").doc(ownerId);
    const ownerSnapshot = await ownerRef.get();
    if (!ownerSnapshot.exists) {
      console.log('Owner not found');
      return;
    }
    const ownerData = ownerSnapshot.data();
    if (!ownerData || !ownerData.accessToken) {
      console.log('Owner doesnt have accessToken.');
      return;
    }

    let accessToken = ownerData.accessToken
    let expireTime = ownerData.expireTime

    if (!ownerData?.expireTime || Date.now() > ownerData?.expireTime) {
      console.log('refreshToken!')
      const refreshQueryParams = new URLSearchParams({
        id: ownerId,
        refreshToken: ownerData.refreshToken
      });

      console.log('refreshQueryParams', refreshQueryParams);

      const refreshFunctionUrl = `https://refreshtoken-ef52xoumsq-uc.a.run.app?${refreshQueryParams}`;
      const refreshResponse = await fetch(refreshFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!refreshResponse.ok) {
        console.log('Error refresh token', refreshResponse);

        throw new Error(`Error: ${refreshResponse.status}`);
      }
      const refreshResponseData = await refreshResponse.json();

      console.log('refreshResponseData', refreshResponseData);
      accessToken = refreshResponseData.accessToken
      expireTime = refreshResponseData.expireTime
    }

    const [firstWaitlistItem, ...remainingWaitlist] = docData.waitlist;

    const waitlistUserId = firstWaitlistItem.split('/');

    const isAlreadyOnWaitlist = docData?.waitlist?.some((item: any) => {
      const parts = item.split('/');
      return parts[1] === waitlistUserId;
    });

    if (isAlreadyOnWaitlist) {
      return;
    }

    const isAlreadyOnMembersList = docData?.members?.some((item: any) => {
      const parts = item.split('/');
      return parts[1] === waitlistUserId;
    });

    if (isAlreadyOnMembersList) {
      return;
    }

    //RUN add user to twitter list
    const queryParams = new URLSearchParams({
      listId: docData?.listId,
      userId: waitlistUserId[1],
      accessToken: accessToken,
      expireTime: expireTime,
    });
    console.log('queryParams', queryParams);
    const functionUrl = `https://addusertolist-ef52xoumsq-uc.a.run.app?${queryParams}`;
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log('Error addind user to list', response);
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    console.log('responseData', responseData);
    const members = Array.isArray(docData.members) ? docData.members : [];
    const newMembers = [...members, firstWaitlistItem];
    await documentRef.update({
      members: newMembers,
      waitlist: remainingWaitlist,
    });
  } catch (error) {
    console.error('Error making Twitter API request:', error);
  }
});

exports.addUserToList = onRequest(async (req: any, res: any) => {
  try {
    //New Member info
    const listId = req.query?.listId
    const userId = req.query?.userId
    //Twitter Access
    const accessToken = req.query?.accessToken
    const expireTime = req.query?.expireTime
    console.log('req.query', req.query);

    if (!expireTime || Date.now() > expireTime) {
      return res.status(401).json({ error: 'Access token expired' });
    }

    if (listId && userId && accessToken) {
      const twitterClient = new TwitterApi(accessToken);
      const userClient = twitterClient.readWrite;

      const addListMember = await userClient.v2.addListMember(listId, userId);
      console.log('addListMember', addListMember);

      res.status(200).json(addListMember);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

exports.refreshToken = onRequest(async (req: any, res: any) => {
  try {

    const id = req.query?.id
    const refreshToken = req.query?.refreshToken

    const firestore = await getFirestore()
    const ownerRef = firestore.collection("users").doc(id);
    const ownerSnapshot = await ownerRef.get();
    if (!ownerSnapshot.exists) {
      console.log('Owner not found');
      return;
    }
    const ownerData = ownerSnapshot.data();
    if (!ownerData || !ownerData.accessToken) {
      console.log('Owner doesnt have accessToken.');
      return;
    }

    console.log(id, 'refreshToken', refreshToken);

    if (refreshToken) {
      const client = new TwitterApi({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET ?? ''
      });

      console.log('client', client);

      const { client: refreshedClient, accessToken, refreshToken: newRefreshToken, expiresIn } =
        await client.refreshOAuth2Token(refreshToken);

      const expireTime = Date.now() + (expiresIn * 1000);

      console.log('refreshedClient', refreshedClient);

      console.log('refreshTokenData', {
        accessToken,
        newRefreshToken,
        expireTime
      });

      await ownerRef.update({
        accessToken: accessToken,
        expireTime: expireTime,
        refreshToken: newRefreshToken
      });

      res.status(200).json({ accessToken, id, newRefreshToken, expireTime });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  } catch (error) {
    console.error('Refresh Token Error making Twitter API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});