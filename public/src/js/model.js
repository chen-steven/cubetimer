class SessionModel {

    constructor(authentication) {
        this.solveTimes = [];
        this.scrambles = [];
        this.puzzle = "3x3";
        this.numSolves = 0;
        this.scramble = '';
        this.authentication = authentication;
    }
    getScramble() {
        this.scramble = "R U R' U' L";
        return this.scramble;
    }

    addSolve(time) {
        this.pastSolveID = Date.now();
        this.solveTimes.push(time);
        this.solveTimes.push(this.scramble);
        this.numSolves++;
        console.log(this.authentication.currentUser);
        if (this.authentication.currentUser) {
            console.log("logged in...posting solve")
            let timeStamp = this.pastSolveID;
            db.collection("users").doc(this.authentication.currentUser.uid).collection("solves")
                .doc(timeStamp.toString(10)).set({
                    cube : this.puzzle,
                    time : time,
                    timeStamp: timeStamp,
                    scramble: this.scramble
                });
        } else {
            console.log("logged out..get a fucking account man");
            //post to global times
            //post scramble
            //post date

        }

    }
    deleteSolve(solveID) { //solve id is Date.now()
        if (auth.currentUser) {
            db.collection("users").doc(auth.currentUser.uid).collection("solves").doc(solveID).delete();
        }
    }
    getAverage() {
        let sum = 0; 
        for (let i = 0; i<this.solveTimes.length; i++) {
            sum+=this.solveTimes[i];
        }
        console.log(sum/this.numSolves);
    }

    clearSession() {
        this.numSolves = 0;
        //clear solveTimes list
    }

}