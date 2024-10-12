function start(){
    storage_init()   
}

function genarr(el, N){
    let res = []
    for(let i = 0; i < N;i++){
        res.push(el)
    }
    return res
}

function gentab(prog, R, C, skip = 0){
    let res = []
    for(let i = 0; i < R;i++){
        res.push(genarr(0, skip).concat(genarr(1,prog)).concat(genarr(0, C - prog - skip)))
    }
    return res
}

function clarr(inp){
    if(inp.length != 1){
        return inp
    }
    if(inp[0].length != 0){
        return inp
    }
    return []
}

function game(){
    gameID = Math.random() * Math.pow(10,17) + ""
    storage.malgosia[gameID] = {}
    storage.malgosia[gameID].junteams = clarr(junlist.value.split("\n"))
    storage.malgosia[gameID].senteams = clarr(senlist.value.split("\n"))
    storage.malgosia[gameID].Ntasks = ntasks.value * 1
    storage.malgosia[gameID].senskip = senskip.value * 1 - 1
    storage.malgosia[gameID].sensc = gentab(6,storage.malgosia[gameID].senteams.length,storage.malgosia[gameID].Ntasks, storage.malgosia[gameID].senskip)
    storage.malgosia[gameID].junsc = gentab(6,storage.malgosia[gameID].junteams.length,storage.malgosia[gameID].Ntasks)
    storage.malgosia[gameID].sennext = genarr(5 + senskip.value * 1, storage.malgosia[gameID].senteams.length)
    storage.malgosia[gameID].junnext = genarr(6, storage.malgosia[gameID].junteams.length)
    storage.malgosia[gameID].frozen = false
    window.open("control#" + gameID,"","width=500,height = 500")
    location.href = "display#" + gameID
}