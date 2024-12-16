async function get_tasks(){
    const r = await fetch("contents/tasks.json")
    const a = await r.json()
    return a
}
async function init(){
    storage_init()
    if(storage.used == undefined){
        storage.used = true
        storage.contests = []
        storage.tasks_used = {}
    }
    tasks = await get_tasks()
    for(let i = 0; i < tasks.length;i++){
        if(storage.tasks_used[tasks[i].ID] == undefined){
            storage.tasks_used[tasks[i].ID] = false;
        }
    }
    if(storage.malgosia == undefined){
        storage.malgosia = {}
    }
}

function JSONtoFile(json, filename){
    let blob = new Blob([JSON.stringify(json)], {type: 'application/json'});
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

function saveusedtasks(){
    JSONtoFile(storage.tasks_used, "tasks_used.json")
}

function filetoJSON(file){
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(){
            resolve(JSON.parse(reader.result))
        }
        reader.readAsText(file)
    })
}

function orjson(a, b){
    let c = {}
    for(let i in a){
        c[i] = a[i] || b[i]
    }
    return c
}

function loadusedtasks(){
    let input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async function(){
        let file = input.files[0]
        let json = await filetoJSON(file)
        storage.tasks_used = orjson(storage.tasks_used, json)
        alert("Wczytano plik")
    }
    input.click()
}