class Stopwatch {
    constructor() {
        this.running = false;
        this.time = 0;
        this.solveTime = 0;
    }

    start() {
        this.running = true;
        this.time = Date.now();
        
        this.timer = setInterval(this.updateDisplay, 10, this.time);
    }

    stop() {
        clearInterval(this.timer);
        this.solveTime = Date.now() - this.time;
        $('#timer').text(msToTime(this.solveTime));
        this.running = false;
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
