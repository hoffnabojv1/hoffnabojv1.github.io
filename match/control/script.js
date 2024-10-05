let gameID
function malgosia(code, N){
    if("0123456789".indexOf(code[0])<0){
        return {"ok":false}
    }
    if("0123456789".indexOf(code[1])<0){
        return {"ok":false}
    }
    if("0123456789".indexOf(code[2])<0){
        return {"ok":false}
    }
    if("0123456789".indexOf(code[3])<0){
        return {"ok":false}
    }
    s = code[0] * 1 + code[1] * 3 + code[2]* 7 + code[3] * 9
    if(s % 10 != 0){
        return {"ok":false}
    }
    t1 = code[0] + code[1] + code[2]
    aktnum = (t1 * 29 + 926) % 1000
    return {"ok":true, "team":aktnum % N, "task": Math.floor(aktnum / N) - 1}
}

function brunon(code){ //Brunon the Burner
    juncount = storage.malgosia[gameID].junteams.length
    sencount = storage.malgosia[gameID].senteams.length
    gosia = malgosia(code, juncount + sencount)
    if(gosia.team < sencount){
        storage.malgosia[gameID].sensc[gosia.team][gosia.task] = -1
        if(storage.malgosia[gameID].sennext[gosia.team] < storage.malgosia[gameID].sensc[gosia.team].length){
            storage.malgosia[gameID].sensc[gosia.team][storage.malgosia[gameID].sennext[gosia.team]] = 1
            storage.malgosia[gameID].sennext[gosia.team]++
        }
    }else{
        gosia.team = gosia.team - sencount
        storage.malgosia[gameID].junsc[gosia.team][gosia.task] = -1
        if(storage.malgosia[gameID].junnext[gosia.team] < storage.malgosia[gameID].junsc[gosia.team].length){
            storage.malgosia[gameID].junsc[gosia.team][storage.malgosia[gameID].junnext[gosia.team]] = 1
            storage.malgosia[gameID].junnext[gosia.team]++
        }
    }
}


function done(code){ 
    juncount = storage.malgosia[gameID].junteams.length
    sencount = storage.malgosia[gameID].senteams.length
    gosia = malgosia(code, juncount + sencount)
    if(gosia.team < sencount){
        storage.malgosia[gameID].sensc[gosia.team][gosia.task] = 2
        if(storage.malgosia[gameID].sennext[gosia.team] < storage.malgosia[gameID].sensc[gosia.team].length){
            storage.malgosia[gameID].sensc[gosia.team][storage.malgosia[gameID].sennext[gosia.team]] = 1
            storage.malgosia[gameID].sennext[gosia.team]++
        }
    }else{
        gosia.team = gosia.team - sencount
        storage.malgosia[gameID].junsc[gosia.team][gosia.task] = 2
        if(storage.malgosia[gameID].junnext[gosia.team] < storage.malgosia[gameID].junsc[gosia.team].length){
            storage.malgosia[gameID].junsc[gosia.team][storage.malgosia[gameID].junnext[gosia.team]] = 1
            storage.malgosia[gameID].junnext[gosia.team]++
        }
    }
}

function undone(code){ 
    juncount = storage.malgosia[gameID].junteams.length
    sencount = storage.malgosia[gameID].senteams.length
    gosia = malgosia(code, juncount + sencount)
    if(gosia.team < sencount){
        storage.malgosia[gameID].sensc[gosia.team][gosia.task] = 1
        if(storage.malgosia[gameID].sennext[gosia.team]-1 < storage.malgosia[gameID].sensc[gosia.team].length){
            storage.malgosia[gameID].sennext[gosia.team]--
            storage.malgosia[gameID].sensc[gosia.team][storage.malgosia[gameID].sennext[gosia.team]] = 0
        }
    }else{
        gosia.team = gosia.team - sencount
        storage.malgosia[gameID].junsc[gosia.team][gosia.task] = 1
        if(storage.malgosia[gameID].junnext[gosia.team]-1 < storage.malgosia[gameID].junsc[gosia.team].length){
            storage.malgosia[gameID].junnext[gosia.team]--
            storage.malgosia[gameID].junsc[gosia.team][storage.malgosia[gameID].junnext[gosia.team]] = 0
        }
    }
}

function start(){
    gameID = location.hash.substring(1)
    storage_init();
    codeinp.focus()
    setInterval(ckp,10)
    codeinp.addEventListener('keydown', function(e) {
        if (e.key == "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
        }
    });
    document.body.onkeydown = function(e){
        if(e.key == "ArrowUp"){
            if(cvch.hidden==""){
                done(codeinp.value)
                codeinp.value = ""
                cvch.hidden="hidden"
                codeinp.focus()
            }
        }
        if(e.key == "ArrowLeft"){
            if(cvch.hidden==""){
                codeinp.value = ""
                cvch.hidden="hidden"
                codeinp.focus()
            }
        }        
        if(e.key == "ArrowDown"){
            if(cvch.hidden==""){
                undone(codeinp.value)
                codeinp.value = ""
                cvch.hidden="hidden"
                codeinp.focus()
            }
        }
        if(e.key == "ArrowRight"){
            if(cvch.hidden==""){
                brunon(codeinp.value)
                codeinp.value = ""
                cvch.hidden="hidden"
                codeinp.focus()
            }
        }
        if(e.key == "f"){
            storage.malgosia[gameID].frozen = !storage.malgosia[gameID].frozen
            if(storage.malgosia[gameID].frozen){
                alert("Zamrożono wyniki")
            }else{
                alert("Rozmrożono wyniki")
            } 
        }
    };
}

function ckp(){
    inp = codeinp.value
    if(inp.length < 4){
        codeinp.classList = "code"
    }
    if(inp.length > 4){
        codeinp.classList = "code err"
    }
    if(inp.length == 4){
        if(malgosia(inp,10).ok){
            codeinp.classList = "code"
            cvch.hidden=""
            codeinp.blur()
        }else{
            codeinp.classList = "code err"
        }
    }
}