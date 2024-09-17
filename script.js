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
}