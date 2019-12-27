class SessionModel {
    constructor() {
        this.solveTimes = [];
        this.scrambles = [];
        this.puzzle = "3x3";
        this.numSolves = 0;
        this.scramble = '';
        this.signedIn = false;

    }
    getScramble() {
        
        this.scramble = "R U R' U' L";
        return this.scramble;
    }

    addSolve(time) {
        this.solveTimes.push(time);
        this.solveTimes.push(this.scramble);
        this.numSolves++;

        if (this.signedIn) {
            //post to user times
            //post scramble
            //post date
        } else {
            //post to global times
            //post scramble
            //post date

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