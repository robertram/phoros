import * as logger from "firebase-functions/logger";
import TwitterApi from 'twitter-api-v2';

const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const functions = require("firebase-functions")

initializeApp();

/*

TODO:
Create a firebase cloud function for every list in firebase
Run the firebase cloud function every 15 minutes to add every user to the twitter list

The cloud function needs to
Get the list information
Get the lists owner information 
Run the twitter api
Remove from a field in firebase
Add to a field in firebase

*/

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
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

exports.addToTwitterListEvery15Minutes = functions.pubsub.schedule('*/1 * * * *').onRun(async (context: any) => {
  //exports.moveWaitlistToMember = onRequest(async (req: any, res: any) => {
  try {
    const firestore = await getFirestore()

    //GET list information
    const docId = '4311054b-68d0-43e3-a87e-e5a82c9a42f4';
    const documentRef = firestore.collection("lists").doc(docId);
    const docSnapshot = await documentRef.get();

    if (!docSnapshot.exists) {
      console.log('No such document!');
      //res.status(404).send('Document not found');
      return;
    }

    // Get the document data
    const docData = docSnapshot.data();
    if (!docData || !Array.isArray(docData.waitlist) || docData.waitlist.length === 0) {
      //res.status(200).send('Waitlist is empty or not found.');
      return;
    }

    //GET owner information
    const ownerId = docData?.owner
    const ownerRef = firestore.collection("users").doc(ownerId);
    const ownerSnapshot = await ownerRef.get();

    if (!ownerSnapshot.exists) {
      console.log('Owner not found');
      //res.status(404).send('Owner not found');
      return;
    }

    // Get the document data
    const ownerData = ownerSnapshot.data();
    if (!ownerData || !ownerData.accessToken) {
      console.log('Owner doesnt have accessToken.');
      
      //res.status(200).send('Owner doesnt have accessToken.');
      return;
    }

    // Retrieve the first item from the waitlist
    const [firstWaitlistItem, ...remainingWaitlist] = docData.waitlist;

    const queryParams = new URLSearchParams({
      listId: docData?.listId,
      userId: firstWaitlistItem,
      accessToken: ownerData.accessToken,
      expireTime: ownerData.expireTime
    });

    console.log('queryParams', queryParams);

    // Define the URL of the cloud function you want to call
    const functionUrl = `https://addusertolist-ef52xoumsq-uc.a.run.app?${queryParams}`;

    ///////

    const response = await fetch(functionUrl, {
      method: 'POST', // or 'GET' if that's what the other function expects
      headers: {
        'Content-Type': 'application/json'
      }
      // If you need to include a body, uncomment the following line
      // body: JSON.stringify({ /* your body data here */ })
    });

    // Check if the call was successful
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the response as JSON
    const responseData = await response.json();


    console.log('responseData', responseData);


    ////



    // Retrieve or initialize the 'members' array
    const members = Array.isArray(docData.members) ? docData.members : [];

    // Add the first waitlist item to the members array
    const newMembers = [...members, firstWaitlistItem];

    // Update the document with the new members array and the remaining waitlist
    await documentRef.update({
      members: newMembers,
      waitlist: remainingWaitlist,
    });

    //res.json({ result: `list info` });
  } catch (error) {
    console.error('Error making Twitter API request:', error);
    //res.status(500).json({ error: 'Internal Server Error' });
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

      console.log('userClient', userClient);

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
