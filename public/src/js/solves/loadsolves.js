function populateSolveList(specifier) {
    $("#solve-history").empty();
    console.log("populating: " + specifier)
    let times;
    let solveCollection = db.collection('users').doc(auth.currentUser.uid).collection('solves')
    if(specifier === 'All' || specifier === ""){
        times = solveCollection.get();
    } else{
        console.log(specifier);
        times = solveCollection.where("cube","==",specifier).get();
    }
    times.then(r => {
        console.log("forEach");
        let i = 0;
        r.forEach(doc => {
            let entry = doc.data();
            $('#solve-history').append(renderSolveEntry(entry, i));
            i++;
        });
    }); 
}

function renderSolveEntry(solve, index) {
    return `
    <tr>
    <th scope="row">${index+1}</th>
    <td>${msToTime(solve.time)}</td>
    <td>${solve.cube}</td>
    <td class="scramble">${solve.scramble}</td>
  </tr>
    
    `;
}