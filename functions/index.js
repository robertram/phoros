/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions")
const firestore = require("@google-cloud/firestore")
const firebase = require("firebase/app")

exports.addToTwitterListEvery15Minutes = functions.pubsub.schedule('*/1 * * * *').onRun(async (context) => {

  const db = new firestore()
  //await db.collection('lists').doc('bd22e3c9-726a-486d-b846-fac5540ee003')

  let newWaitlist = []

  const docRef = db.collection('lists').doc('bd22e3c9-726a-486d-b846-fac5540ee003');

  docRef.get()
    .then((doc) => {
      if (doc.exists) {
        // Document data is available in doc.data()
        const data = doc.data();
        console.log('Document Data: ', data);
        newWaitlist = data.waitlist
      } else {
        // Document doesn't exist
        console.log('Document does not exist');
      }
    })
    .catch((error) => {
      console.error('Error getting document: ', error);
    });

  console.log('newWaitlist', newWaitlist);

  //


  // const docRef = db.collection('lists').doc('bd22e3c9-726a-486d-b846-fac5540ee003').get()

  // const docRef = db.collection('lists').doc('bd22e3c9-726a-486d-b846-fac5540ee003').update({
  //   //waitlist:[]
  // })

  const stringToRemove = '123';

  console.log('stringToRemove', stringToRemove);
  

  //pdate the document to remove the string from the array
  docRef.update({
    members: firebase.firestore.FieldValue.arrayRemove(stringToRemove)
  })
    .then(() => {
      console.log('String removed from the array successfully');
    })
    .catch((error) => {
      console.error('Error removing string from the array: ', error);
    });



  // .set({
  //   waitlist: ['hi']
  // })

  console.log('Add to twitter!');
  return null
})