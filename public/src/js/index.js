let stopwatch;
let model;
let db;
let auth;
$(function() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAwk26USARdlmjEhoYnPoORPqiPyz-vAgA",
        authDomain: "cubetimer-35c5f.firebaseapp.com",
        databaseURL: "https://cubetimer-35c5f.firebaseio.com",
        projectId: "cubetimer-35c5f",
        storageBucket: "cubetimer-35c5f.appspot.com",
        messagingSenderId: "291777235583",
        appId: "1:291777235583:web:ae1eaa052a9c9802650d4a",
        measurementId: "G-Y7YXVP4J09"
        };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    auth = firebase.auth();
    db = firebase.firestore();
    //update firestore settings
    auth.onAuthStateChanged(user =>{
        //console.log(user);
        userUpdate(user);
    });
    //userUpdate(auth.currentUser);
    model = new SessionModel(auth);
    stopwatch = new Stopwatch();

    

    $(".pick-table").on('click',event =>{
        console.log("clicked" + event.target.textContent);
        let filter = event.target.textContent;
        $(".pick-table").removeClass('active');
        $(event.target).closest('.pick-table').addClass('active');
        populateSolveList(filter);
    });
    $(".cube-types").on('click',event =>{
        cubeType = event.target.textContent.trim();
        model.changeCubeType(cubeType);
        $('.card').removeClass('cube-button-active');
        
        $(event.target).find('.card').addClass('cube-button-active');
        newScramble();
    });
    $("#signup-button").on('click',event => {
        console.log("clicked");
        $("#modal-signup").modal('show');
    });
    $('#logout-button').on('click',event => {
        event.preventDefault();
        auth.signOut().then(e => {
            console.log("signed out");
        });
    });
    $("#login-button").on('click',event => {
        $("#modal-login").modal('show');
    });

    $("#current-solves").on('click', '.delete-solve-button', null, function(e) {
        let $li = $(e.target).closest('li');
        let solveID = $(e.target).closest('li').attr('id').substring(3);
        model.deleteSolve(solveID);
        $li.hide("slow", function(){ $li.remove(); });
    });

    $('#solve-history-table').on('click', 'tr', function(event) {
        let id = $(event.target).closest('tr').attr('id').substring(3);

        db.collection('users').doc(auth.currentUser.uid).collection('solves').doc(id).get().then(res => {
            let solve = res.data();
            console.log(solve);
            let urlParams = encodeURI("I just solved a " + solve.cube + " cube in " + msToTime(solve.time) + " using pascal timer. Check out Pascal Timer at www.pascaltimer.com! #cubing #felix #backupMainInnovations");
            $('#twitter-link').attr("href","https://twitter.com/intent/tweet?text=" + urlParams);
            $('#solve-info-modal .modal-title').text(solve.cube+" solve");
            $('#solve-info-modal').modal('show');
            $('#modal-solve-time').text(msToTime(solve.time));
            $('#modal-scramble').text(solve.scramble)
            $('#modal-date').text(formatDate(new Date(solve.timeStamp)));
        });
        
    });



    $("#signup-submit").on('click', e => {
        //e.preventDefault();
        console.log("submitted");
        let email = $('#signup-email').val();
        let password = $('#signup-password').val();
        let name = $("#signup-name").val();
        console.log(email,password);
        auth.createUserWithEmailAndPassword(email,password).then(cred =>{
            console.log(cred.user);
            addNewUserToDatabase(cred.user.uid,name,email);
        }).then(()=>{
        $("#modal-signup").modal("hide");
        $('#signup-form')[0].reset();
        })
    });
    $("#login-submit").on('click',e =>{
        e.preventDefault();
        let email = $('#login-email').val();
        let password = $('#login-password').val();
        auth.signInWithEmailAndPassword(email,password).then(cred =>{
            console.log(cred.user);
        });
        $('#modal-login').modal("hide");
        $('#login-form')[0].reset();
    });

    $('#login-with-google').on('click', e=> {
        e.preventDefault();
        var provider = new firebase.auth.GoogleAuthProvider();
        $('#modal-login').modal("hide");
        auth.signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            addNewUserToDatabase(result.user.uid,result.user.displayName.split(" ")[0],result.user.email);
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    });

   $(document).on('keypress', function(e) {
       if (e.which==32) {
           e.preventDefault();
           stopwatch.wait();
       }
   });
    
    $(document).on('keyup',function(e) {
        if(e.which == 32) {
            e.preventDefault();
            if (stopwatch.running) {
                stopwatch.stop();
                addTime(stopwatch.solveTime);
                newScramble();
            } else {
                stopwatch.start();
                
            }
        }
    });
    $('#view-stats').on('click', showStatistics)
    
    newScramble();
});
function userUpdate(user) {
    if (user) {
        $(".logged-out").addClass('d-none');
        $(".logged-in").removeClass('d-none');
        db.collection("users").doc(auth.currentUser.uid)
        .get()
        .then(doc =>{
                let currentName = doc.data()['name'];
                $("#nav-name").text("Welcome, " + currentName);
            });
        
        populateSolveList("All");

        
    } else{
        $(".logged-in").addClass('d-none');
        $(".logged-out").removeClass('d-none');
    }


}

function showStatistics(event) {
    model.getAverage();
}

function newScramble() {
    let scramble = model.getScramble();
    $('#scramble').text(scramble);
    
}

function addTime(time) {
    model.getPercentile(time).then(percentile => {
        if(percentile >= 0){
        $("#percentile-display").text("Your solve was faster than " + percentile.toFixed(2) + "% of your previous solves on the " + model.puzzle);
        }
    });
    
    model.addSolve(time);
    let solveID = model.pastSolveID;
    $('#current-solves').append(renderSolve(time, solveID));
    appendLastSolve();
}
function renderSolve(time, solveID) {
    return `
    <div class="li-time">
    <li id="${"li-"+solveID}"> 
        <div>
        <p>${$('#timer').text()}
            
                 <i class="far fa-trash-alt delete-solve-button"></i>
        </p>
        <p class="text-secondary">${$('#scramble').text()}</p>
            
       
        </div>
        
        
    
    </li>
    </div>`;
}
function renderSolve1() {
    let html = `<div class="card">
    <div class="card-body">
      <p>${$('#timer').text()}</p>
      <p>${$('#scramble').text()}</p>
    </div>
  </div>`;
  return html;
}
function addNewUserToDatabase(uid, name, email){
    return db.collection('users').doc(uid).set({
        uid: uid,
        name: name,
        email: email,
        solveTimes: []
    })
}