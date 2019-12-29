class Stopwatch {
    constructor() {
        this.waiting = false;
        this.readyToRun = false;
        this.running = false;
        this.time = 0;
        this.solveTime = 0;
    }

    start() {
        clearInterval(this.timer);
        this.waiting = false;
        console.log(this.readyToRun);
        if(this.readyToRun){
            this.running = true;
            this.readyToRun = false;
            this.time = Date.now();
            this.timer = setInterval(this.updateDisplay, 10, this.time);
        }
        //update diplay to empty
        //$("#timer").text(msToTime(this.solveTime));
        $("#timer").removeClass('timer-waiting');
        $("#timer").removeClass('timer-ready');

    }

    stop() {
        clearInterval(this.timer);
        this.solveTime = Date.now() - this.time;
        $('#timer').text(msToTime(this.solveTime));
        
        this.running = false;
    }
    async checkWait(time){
        let msTime = Date.now() - time;
        console.log(msTime);
        if(msTime >= 500){
        
            //update diplay to GO
           // $("#timer").text("GO!");
           $("#timer").addClass("timer-ready")
            clearInterval(this.timer);
            return true;
        }
        return false;
    }
    wait(){
        if(!this.waiting && !this.running){
            this.waiting = true;
            console.log("not ready to run");
            //update display to wait
            $("#timer").addClass("timer-waiting");
            this.time = Date.now();
            this.timer = setInterval( () => {
                this.checkWait(this.time).then(validated =>{
                    if(validated){
                        this.readyToRun = true;
                    }
                })},10);
        }
    }
    

    updateDisplay(time) {
        let msTime = Date.now() - time;
        $('#timer').text(msToTime(msTime));
    }

}


// let time = Date.now();
// let timer;
// function startStopwatch() {
//     time = Date.now();
//     timer = setInterval(updateDisplay, 10); // every millisecond call updateDisplay
// }
// function stopStopwatch() {
//     clearInterval(timer);
// }

// function resetStopwatch() {
//     time = 0;
//     //change h1
// }

// function updateDisplay() {
//     msTime = Date.now() - time;
    
   
//     $('#timer').text(msToTime(msTime));
// }

function msToTime(s) {
    
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    // var hrs = (s - mins) / 60;
  
    return mins.toString().padStart(2,'0') 
    + ':' + secs.toString().padStart(2,'0') + '.' + ms.toString().padStart(3,'0');
  }


  function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
  }

// $(function() {
    
//     let running = false;
//     $(document).on('keypress',function(e) {
//         if(e.which == 32) {
//             if (running) {
//                 stopStopwatch();
//                 running = false;
//             } else {
//                 startStopwatch();
//                 running = true;
//             }
           
//         }
//     });
// });
