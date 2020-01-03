function populateSolveList(specifier) {
    $("#solve-history").empty();
    let times;
    let solveCollection = db.collection('users').doc(auth.currentUser.uid).collection('solves')
    if(specifier === 'All' || specifier === ""){
        times = solveCollection.orderBy('timeStamp', 'desc').get();
    } else{
        times = solveCollection.orderBy('timeStamp', 'desc').where("cube","==",specifier).get();
    }
    times.then(r => {
        
        let i = 0;
        r.forEach(doc => {
            let entry = doc.data();
            $('#solve-history').append(renderSolveEntry(entry, i));
            i++;
        });
    }); 
}

function appendLastSolve() {
    let solveCollection = db.collection('users').doc(auth.currentUser.uid).collection('solves');
    let times = solveCollection.orderBy('timeStamp', 'desc').limit(1).get();
    times.then(res => {
            console.log(res);
            res.forEach(doc => {
                let solve = doc.data();
                $('#solve-history').prepend(renderSolveEntry(solve));
            })
        });
    
    
}

function renderSolveEntry(solve, index) {
    // <th scope="row">${index+1}</th>
    return `
    <tr id="${"tr-"+solve.timeStamp}">
   
    <th scope="row">${timeSince(solve.timeStamp)}</th>
    <td>${msToTime(solve.time)}</td>
    <td>${solve.cube}</td>
    <td class="scramble">${solve.scramble}</td>
  </tr>
    
    `;
}

function timeSince(timeStamp) {
    let date = new Date(timeStamp);
    let seconds = Math.floor((new Date() - date) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
  
    if (interval > 0) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 0) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 0) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 0) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 0) {
      return interval + " minutes ago";
    }

   
    return Math.floor(seconds) + " seconds ago";
  }