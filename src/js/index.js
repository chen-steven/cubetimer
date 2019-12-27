
let stopwatch;
let model;
$(function() {
    model = new SessionModel();
    stopwatch = new Stopwatch();

    
    $(document).on('keypress',function(e) {
        e.preventDefault();
        if(e.which == 32) {
            console.log("HI");
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
    

});
function showStatistics(event) {
    model.getAverage();
}

function newScramble() {
    let scramble = model.getScramble();
    console.log(scramble);

    $('#scramble').text(scramble);
    
}

function addTime(time) {
    
    $('#current-solves').append(renderSolve(time));
    model.addSolve(time);

}
function renderSolve(time) {
    return `<li> 
        <p>${$('#timer').text()} <span class="text-secondary">${$('#scramble').text()}</span></p>
        
    
    </li>`;
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