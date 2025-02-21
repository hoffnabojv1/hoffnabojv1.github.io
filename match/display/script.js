function gencol(Hrow, N, num, tit, startclass){
    if(N == 1){
        N = 3;
        num = 1;
    }
    col = document.createElement("div")
    col.style.height = 75 + 90*Hrow + 37.5 + "px"
    col.classList = "col"
    titdiv = document.createElement("div")
    titdiv.classList = "tasknum"
    titdiv.innerText = tit
    col.appendChild(titdiv)
    for(let i = 0; i < Hrow;i++){
        newcirc = document.createElement("div")
        newcirc.classList = "circ " + startclass[i]
        col.appendChild(newcirc)
    }
    pc = 90 * num / (N-1)
    px = 650 - 762.5 * num / (N-1)
    col.style.left = "calc( " + pc +"vw + " + px + "px)"
    return col
}


function teamscore(inp){
    return inp.filter(x => x == 2).length
}

function val(inp){
    if(inp){
        return 1;
    }else{
        return 0;
    }
}

function comp(w1,w2){
    sc1 = w1[1]
    n1 = w1[0]
    sc2 = w2[1]
    n2 = w2[0]
    if(teamscore(sc1)>teamscore(sc2)){
        return -1;
    }
    if(teamscore(sc1)<teamscore(sc2)){
        return 1;
    }
    cp = []
    for(let i = 0; i < sc1.length;i++){
        cp.push(val(sc1[i] == 2) - val(sc2[i]==2))
    }
    if(cp.lastIndexOf(1) > cp.lastIndexOf(-1)){
        return -1
    }
    if(cp.lastIndexOf(1) < cp.lastIndexOf(-1)){
        return 1
    }
    if(n1 < n2){
        return -1
    }
    if(n2 < n1){
        return 1
    }
    return 0;
}

function genrow(num, tit, sc){
    toadd=""
    if(num == 1){
        toadd=" first"
    }
    if(num == 2){
        toadd=" second"
    }
    if(num == 3){
        toadd=" third"
    }
    row = document.createElement("div")
    row.classList = "row"
    numdiv = document.createElement("div")
    numdiv.innerText = num;
    numdiv.classList = "pos" + toadd
    row.innerText = tit;
    row.appendChild(numdiv)
    scorediv = document.createElement("div")
    scorediv.classList = "score"
    scorediv.innerText = sc
    row.appendChild(scorediv)
    return row
}

function numtoclass(inp){
    return ["burnt", "undone", "progress", "done"][inp + 1]
}

function gentab(teamlist, scores, ft, lt, tit){
    scl = []
    for(let i = 0; i < teamlist.length;i++){
        scl.push([teamlist[i],scores[i]])
    }
    scl.sort(comp)
    el = document.createElement("div")
    el.classList = "kasia"
    titdiv = document.createElement("h1")
    titdiv.innerText = tit
    titdiv.classList = "SJT"
    el.appendChild(titdiv)
    colval = []
    for(let k = ft; k < lt+1;k++){
        colval.push([])
    }
    for(let i = 0; i < scl.length;i++){
        el.appendChild(genrow(i+1,scl[i][0], teamscore(scl[i][1])))
        for(let k = ft; k < lt+1;k++){
            colval[k-ft].push(numtoclass(scl[i][1][k]))
        }
    }
    for(let k = ft; k < lt + 1;k++){
        el.appendChild(gencol(scl.length,lt + 1 - ft, k - ft, k + 1,colval[k-ft]))
    }
    if(teamlist.length == 1 && teamlist[0] == "HIDE THIS TEAM"){
        el.hidden = "hidden"
    }
    return el
}

let tablist = []
let gameID
const Cwidth = 13
const Stime = 10000
const Synctime = 10

function slideswap(){
    for(let i = 0; i < tablist.length;i++){
        document.body.children[i].style.display = "none"
    }
    document.body.children[storage.malgosia[gameID].slidenum].style.display = "block";
    if(storage.malgosia[gameID].slidenum + Math.ceil(storage.malgosia[gameID].junsc[0].length/Cwidth) < tablist.length){
        document.body.children[storage.malgosia[gameID].slidenum + Math.ceil(storage.malgosia[gameID].junsc[0].length/Cwidth)].style.display = "block";
    }
    storage.malgosia[gameID].slidenum++;
    storage.malgosia[gameID].slidenum = storage.malgosia[gameID].slidenum % Math.ceil(storage.malgosia[gameID].junsc[0].length/Cwidth);
}

function akt(){
    storage.malgosia[gameID].slidenum = storage.malgosia[gameID].slidenum % Math.ceil(storage.malgosia[gameID].junsc[0].length/Cwidth);;
    if(storage.malgosia[gameID].frozen){
        return
    }
    oldtablist = tablist
    tablist = []
    Ntasks = storage.malgosia[gameID].sensc[0].length    
    for(let i = 0; i < storage.malgosia[gameID].junsc[0].length;i = i + Cwidth){
        tablist.push(gentab(storage.malgosia[gameID].junteams, storage.malgosia[gameID].junsc,i,Math.min(i + Cwidth - 1, Ntasks - 1),"Juniorzy"))
    }
    for(let i = storage.malgosia[gameID].senskip; i < storage.malgosia[gameID].sensc[0].length;i = i + Cwidth){
        tablist.push(gentab(storage.malgosia[gameID].senteams, storage.malgosia[gameID].sensc,i, Math.min(i + Cwidth - 1, Ntasks - 1),"Seniorzy"))
    }
    for(let i = 0; i < tablist.length;i++){
        document.body.replaceChild(tablist[i], oldtablist[i])
    }
    for(let i = 0; i < tablist.length;i++){
        document.body.children[i].style.display = "none"
    }
    document.body.children[storage.malgosia[gameID].slidenum].style.display = "block";
    if(storage.malgosia[gameID].slidenum + Math.ceil(storage.malgosia[gameID].junsc[0].length/Cwidth) < tablist.length){
        document.body.children[storage.malgosia[gameID].slidenum + Math.ceil(storage.malgosia[gameID].junsc[0].length/Cwidth)].style.display = "block";
    }
}

function start(){
    storage_init()
    gameID = location.hash.substring(1)
    Ntasks = storage.malgosia[gameID].sensc[0].length
    for(let i = 0; i < storage.malgosia[gameID].junsc[0].length;i = i + Cwidth){
        tablist.push(gentab(storage.malgosia[gameID].junteams, storage.malgosia[gameID].junsc,i,Math.min(i + Cwidth - 1, Ntasks - 1),"Juniorzy"))
    }
    for(let i = storage.malgosia[gameID].senskip; i < storage.malgosia[gameID].sensc[0].length;i = i + Cwidth){
        tablist.push(gentab(storage.malgosia[gameID].senteams, storage.malgosia[gameID].sensc,i, Math.min(i + Cwidth - 1, Ntasks - 1),"Seniorzy"))
    }
    for(let i = 0; i < tablist.length;i++){
        document.body.appendChild(tablist[i])
    }
    storage.malgosia[gameID].slidenum = 0
    setInterval(slideswap,Stime)
    setInterval(akt, Synctime)
}

