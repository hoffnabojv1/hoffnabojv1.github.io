function randint(h){
    return Math.floor(h * Math.random())
}
function sum(arr){
    return arr.reduce((p,a) => p + a, 0)
}
async function get_tasks(){
    const r = await fetch("../contents/tasks.json")
    const a = await r.json()
    return a
}
async function init(){
    storage_init()
    prepare_tasks()
}

function normalize(arr){
    noarrsum = sum(arr)
    if(noarrsum == 0){
        return arr
    }
    return arr.map(x => x / noarrsum)
}

function randcomb(n,k){
    if (k > n){
        return []
    }
    used = {}
    res = []
    for(let i = 0; i < k;i++){
        s = randint(n)
        if(used[s]){
            i--
            continue
        }
        used[s]= true
        res.push(s)
    }
    return res
}

function randchoice(arr){
    arr = normalize(arr)
    r = Math.random()
    sc = 0
    for(let i = 0; i < arr.length;i++){
        sc = sc + arr[i]
        if(r < sc){
            return i
        }
    }
    return arr.length - 1
}

function range(start,stop){
    res = []
    while(start < stop){
        res.push(start)
        start++;
    }
    return res
}

function tasknums(levels, types){
    result = []
    types = normalize(types)
    for(let lvl_num = 0; lvl_num < levels.length;lvl_num++){
        tt = types.map(x => x * levels[lvl_num])
        rs = tt.map(x => x - Math.floor(x))
        tt = tt.map(Math.floor)
        s = sum(tt)
        for(let i = 0; i < levels[lvl_num] - s;i++){
            tt[randchoice(rs)]++;
        }
        homar = range(0,types.length).map(x2 => randcomb(TL[lvl_num][x2].length,tt[x2]).map(y => TL[lvl_num][x2][y])).reduce((x3,y2) => x3.concat(y2))
        homar = randcomb(levels[lvl_num],levels[lvl_num]).map(x => homar[x])
        result = result.concat(homar)
    }     
    return result
}
let task_info = []
let TL = [[[],[],[],[]],[[],[],[],[]],[[],[],[],[]],[[],[],[],[]],[[],[],[],[]],[[],[],[],[]]]
async function prepare_tasks(){
    let taskslist = await get_tasks()
    task_info = taskslist
    let N = 0
    let A,B,C,D;
    A = 0;
    B = 0;
    C = 0;
    D = 0;
    let types = ["A","C","G","NT"]
    for(let i = 0; i < taskslist.length; i++){
        if(storage.tasks_used[taskslist[i].ID]){
            continue
        }
        if(taskslist[i].content.indexOf("[") > -1){
            A++
            continue
        }
        if(taskslist[i].content.indexOf("%") > -1){
            B++
            continue
        }
        if(taskslist[i].images.length > 1){
            C++
            continue
        }        
        if(taskslist[i].images.length == 1 && taskslist[i].ID.indexOf("E731F5A787") == 0){
            continue
        }
        N++;
        TL[taskslist[i].level][types.indexOf(taskslist[i].type)].push(i)
    }
    console.log("ilosc zadan: " + N);
}
function intnorm(inp){
    pref = [0]
    for(let i = 0; i < inp.length;i++){
        pref.push(pref[pref.length-1] + inp[i])
    }
    pref = pref.map(x => Math.floor(x+0.001))
    return range(0,inp.length).map(x => pref[x + 1] - pref[x])
}
let akttaskset

function clarr(inp){
    if(inp.length != 1){
        return inp
    }
    if(inp[0].length != 0){
        return inp
    }
    return []
}

function generate_tasks(){
    levels = []
    for(let i = 0; i < 6;i++){
        levels.push(document.getElementById("l" + i + "inp").value * 1)
    }
    levels = intnorm(normalize(levels).map(x => x * (1 * num.value)))
    types = []
    for(let i = 0; i < 4;i++){
        types.push(document.getElementById("t" + i + "inp").value * 1)
    }
    types = normalize(types)
    taskset = tasknums(levels,types)
    akttaskset = taskset
    storage.tempactteams = clarr(teamstempinpsen.value.split("\n")).concat(clarr(teamstempinpjun.value.split("\n")))
    storage.tempsencount = clarr(teamstempinpsen.value.split("\n")).length
    storage.tempsenskip = senskipinp.value * 1 - 1
    preif.src = "/generator/preview#" + taskset.reduce( (x,y) => x + "#" + y)
    preview.style.display = "unset"
}
function useset(){
    for(let iter = 0; iter< akttaskset.length;iter++){
        storage.tasks_used[task_info[akttaskset[iter]].ID] = true
    }
}