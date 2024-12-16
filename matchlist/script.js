function genrow(gameID) {
  let row = document.createElement('tr');
  let cells = [];
  let html_in = [
    gameID,
    storage.malgosia[gameID].senteams.length,
    storage.malgosia[gameID].junteams.length,
    storage.malgosia[gameID].Ntasks,
    "<a href = '/match/display#" + gameID + "'>Wyświetl</a>"
    ];
    for (let i = 0; i < 5; i++) {
        cells.push(document.createElement('td'));
        cells[i].innerHTML = html_in[i];
        row.appendChild(cells[i]);
        }
    return row;
}

function genrows() {
    let table = document.getElementById('matches');
    for (let gameID in storage.malgosia) {
        table.appendChild(genrow(gameID));
    }
    }

function start() {
    storage_init();
    genrows();
}
