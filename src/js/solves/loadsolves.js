function populateSolveList() {

    db.collection('users').doc(auth.currentUser.uid).get().then( (doc) => {
        let times = doc.data()['solveTimes'];
        for (let i = 0; i<times.length; i++) {
            $('#solve-history').append(renderSolveEntry(times[i], i));
        }
        console.log(times);
    });
    db.collection('users').doc(auth.currentUser.uid).collection("solves")
}

function renderSolveEntry(solve, index) {
    return `
    <tr>
    <th scope="row">${index+1}</th>
    <td>${msToTime(solve.time)}</td>
    <td>${solve.cube}</td>
    <td class="scramble">R U R' U' L R R R R R R R R R R R R</td>
  </tr>
    
    `;
}