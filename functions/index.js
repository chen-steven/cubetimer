const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
db.settings({timestampsInSnapShots:true});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.myFunction = functions.firestore
    .document('users/{userID}/solves/{newSolve}')
    .onCreate((snap,context) =>{
        let newValue = snap.data();
        let cubeType = newValue.cube;
        let userID = context.params.userID;
        let solveID = context.params.newSolve;
        var solvesList = [];
        var percentileList = [];
        db.collection("users")
            .doc(userID)
            .collection("solves")
            .where("cube","==",cubeType)
            .orderBy("time", "desc")
            .limit(100)
            .get()
            .then(results => {
                results.forEach(doc => {
                    
                    let docContents = doc.data();
                    solvesList.push(docContents.time);
                });
                console.log(solvesList);
                db.collection('users').doc(userID).collection('percentiles').doc(cubeType).set({recents: solvesList}).then(r=>{});
        });
    });