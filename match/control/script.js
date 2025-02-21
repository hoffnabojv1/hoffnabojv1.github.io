let gameID
let accept;
function malgosia(code, N){
    N = storage.malgosia[gameID].Ntasks + 1
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
    aktnum = ((t1 - 37 + 1000) * 29) % 1000
    return {"ok":true, "team": Math.floor(aktnum / N), "task": (aktnum % N) - 1}
}

function brunon(code){ //Brunon the Burner
    juncount = storage.malgosia[gameID].junteams.length
    sencount = storage.malgosia[gameID].senteams.length
    gosia = malgosia(code, juncount + sencount)
    if(gosia.team >= juncount){
        gosia.team = gosia.team - juncount
        storage.malgosia[gameID].sensc[gosia.team][gosia.task] = -1
        if(storage.malgosia[gameID].sennext[gosia.team] < storage.malgosia[gameID].sensc[gosia.team].length){
            storage.malgosia[gameID].sensc[gosia.team][storage.malgosia[gameID].sennext[gosia.team]] = 1
            storage.malgosia[gameID].sennext[gosia.team]++
        }
    }else{
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
    if(gosia.team >= juncount){
        gosia.team = gosia.team - juncount
        if(
            storage.malgosia[gameID].sensc[gosia.team][gosia.task] == 2){
                return;
            }
        storage.malgosia[gameID].sensc[gosia.team][gosia.task] = 2
        if(storage.malgosia[gameID].sennext[gosia.team] < storage.malgosia[gameID].sensc[gosia.team].length){
            storage.malgosia[gameID].sensc[gosia.team][storage.malgosia[gameID].sennext[gosia.team]] = 1
            storage.malgosia[gameID].sennext[gosia.team]++
        }
    }else{
        if(storage.malgosia[gameID].junsc[gosia.team][gosia.task] == 2){
            return;
        }
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
    if(gosia.team >= juncount){
        gosia.team = gosia.team - juncount
        storage.malgosia[gameID].sensc[gosia.team][gosia.task] = 1
        if(storage.malgosia[gameID].sennext[gosia.team]-1 < storage.malgosia[gameID].sensc[gosia.team].length){
            storage.malgosia[gameID].sennext[gosia.team]--
            storage.malgosia[gameID].sensc[gosia.team][storage.malgosia[gameID].sennext[gosia.team]] = 0
        }
    }else{
        storage.malgosia[gameID].junsc[gosia.team][gosia.task] = 1
        if(storage.malgosia[gameID].junnext[gosia.team]-1 < storage.malgosia[gameID].junsc[gosia.team].length){
            storage.malgosia[gameID].junnext[gosia.team]--
            storage.malgosia[gameID].junsc[gosia.team][storage.malgosia[gameID].junnext[gosia.team]] = 0
        }
    }
}

function start(){
    accept = false;
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
        if(e.key == "s"){
            storage.malgosia[gameID].slidenum++;
        }
        if(e.key == "a"){
            accept = !accept;
            if(accept){
                alert("Automatyczna akceptacja włączona")
            }else{
                alert("Automatyczna akceptacja wyłączona")
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
        decoded = malgosia(inp, -1);
        if(decoded.ok){
            debugger
            juncount = storage.malgosia[gameID].junteams.length
            if(decoded.team < juncount){
                if(storage.malgosia[gameID].junsc[decoded.team][decoded.task] == 0){
                    showalert("Zadanie " + (decoded.task + 1) + " drużyny " + storage.malgosia[gameID].junteams[decoded.team] + " nie powinno być jescze wydane")
                    codeinp.value = ""
                    return;
                }
            }
            if(decoded.team >= juncount){
                if(storage.malgosia[gameID].sensc[decoded.team - storage.malgosia[gameID].juncount][decoded.task] == 0){
                    showalert("Zadanie " + (decoded.task + 1) + " drużyny " + storage.malgosia[gameID].senteams[decoded.team - storage.malgosia[gameID].juncount] + " nie powinno być jescze wydane")
                    codeinp.value = ""
                    return;
                }
            }
            codeinp.classList = "code"
            if(accept){
                done(inp)
                codeinp.value = ""
                cvch.hidden="hidden"
                codeinp.focus()
            }else{
            cvch.hidden=""
            codeinp.blur()
            }
        }else{
            codeinp.classList = "code err"
        }
    }
}

function showalert(text){
    document.getElementById("alert_text").innerText = text;
    document.getElementById("alert").hidden = "";
}

function hidealert(){
    document.getElementById("alert").hidden = "hidden";
}
