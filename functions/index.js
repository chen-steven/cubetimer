const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.myFunction = functions.firestore
    .document('users/{userID}/solves/{newSolve}')
    .onCreate((snap,context) =>{
        console.log(snap);
        console.log(context);
    });