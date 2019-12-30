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
        let size = this.puzzle.substring(0,1);
        size = size + size + size;
        this.scramble = scramblers[size].getRandomScramble().scramble_string
        return this.scramble
    }

    addSolve(time) {
        this.pastSolveID = Date.now();
        this.solveTimes.push(time);
        this.solveTimes.push(this.scramble);
        this.numSolves++;
        //console.log(this.scramble);
        if (this.authentication.currentUser) {
            //console.log("logged in...posting solve")
            let timeStamp = this.pastSolveID;
            //get percentile
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
    getPercentile(time){
        let percentile = db.collection("users").doc(this.authentication.currentUser.uid).collection("percentiles").doc(this.puzzle)
        .get().then(doc =>{
            let solveList = doc.data().recents;
            let index = this.binarySearchGreater(solveList,time); 
            return 100 * (index + 1)/solveList.length;
        })
        return percentile;
    }
    deleteSolve(solveID) { //solve id is Date.now() as a string
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
    changeCubeType(cubeType){
        model.puzzle = cubeType;
    }
    //returns the index of the last element that is greater than or equal to the target
    //if all elements are smaller than the target, return -1;
    binarySearchGreater(arr,target){  
        let start = 0, end = arr.length-1;  
        let index = -1;  
        while (start <= end) {  
            let mid = Math.floor((start + end) / 2);
            //console.log(arr[mid]);
            if (arr[mid] >= target) {
                index = mid  
                start = mid + 1;  
            }
            else {   
                end = mid - 1;  
            }
        }
        return index; 
    }
}