class SessionModel {

    constructor(authentication) {
        this.solveTimes = [];
        this.scrambles = [];
        this.puzzle = "3x3";
        this.numSolves = 0;
        this.scramble = '';
        this.currentSpecifier = 'All'
        this.authentication = authentication;
    }
    getScramble() {
        let size = this.puzzle.substring(0,1);
        size = size + size + size;
        this.scramble = scramblers[size].getRandomScramble().scramble_string
        return this.scramble
    }

    addSolve(time) {
        console.log(time);
        this.pastSolveID = Date.now();
        this.solveTimes.push(time);
        console.log(this.scramble);
        this.scrambles.push(this.scramble);
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
            //post to global times
            //post scramble
            //post date

        }

    }
    getPercentile(time){
        let percentile = db.collection("users").doc(this.authentication.currentUser.uid).collection("percentiles").doc(this.puzzle)
        .get().then(doc =>{
            let docData = doc.data();
            if(docData){
            let solveList = doc.data().recents;
            let index = this.binarySearchGreater(solveList,time); 
            return 100 * (index + 1)/solveList.length;
            }
            return -1;
        })
        return percentile;
    }

    removeSessionSolve(index) {
        this.solveTimes.splice(index,1);
        this.scrambles.splice(index,1);
    }
    deleteSolve(solveID) { //solve id is Date.now() as a string

        if (auth.currentUser) {
            db.collection("users").doc(auth.currentUser.uid).collection("solves").doc(solveID).delete();
        }
    }
    getAverage() {
        if (this.solveTimes.length < 1) {
            return 0;
        }
        let sum = 0; 
        for (let i = 0; i<this.solveTimes.length; i++) {
            sum+=this.solveTimes[i];
            
        }
        return Math.floor(sum/this.solveTimes.length);
    }

    

    getaoN(n) {
        
        if (this.solveTimes.length >=n) {
            let sum = 0;
            let min = this.solveTimes[0];
            let max = this.solveTimes[0];
            for(let i = this.solveTimes.length - n; i<this.solveTimes.length; i++){

                let time = this.solveTimes[i];
                console.log(time);

                sum += time;
                if (time < min) {
                    min = time;
                } 

                if (time > max) {
                    max = time;
                }
            }

            return Math.floor((sum-min-max)/n-2);
        }
        return "N/A";
    }



    clearSession() {
        this.numSolves = 0;
        //clear solveTimes list
        this.solveTimes = [];
        this.scrambles = [];

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