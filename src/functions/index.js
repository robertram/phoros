const firebase=require("firebase-functions")

exports.addToTwitterListEvery15Minutes=functions.pubsub.schedule('*/1 * * * *').onRun((context)=>{
  console.log('Add to twitter!');
  return null
})