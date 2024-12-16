async function get_tasks(){
    const r = await fetch("../contents/tasks.json")
    const a = await r.json()
    return a
}

function TeXtoMathJaxpure(inp){
    inp = inp.replaceAll("\\begin{itemize}","<ul>")
    inp = inp.replaceAll("\\end{itemize}","</ul>")
    inp = inp.replaceAll("\\item","<li>")
    inp = inp.replaceAll("\\begin{center}", "")
    inp = inp.replaceAll("\\end{center}", "")
    inp = inp.replaceAll("\\note", "Uwaga: ")
    a = inp.split("$")
    res = ""
    for(let i = 0; i < a.length;i++){
        if(i > 0 && i % 2 == 0){
            res = res + "\\)"
            a[i] = a[i].replaceAll("~","&nbsp;")
        }
        if(i % 2 == 1){
            res = res + "\\("
        }
        res = res + a[i]
    }
    return res
}

let task_info;

function genrow(taskID) {
    let row = document.createElement('tr');
    let cells = [];
    let html_in = [
        taskID,
        task_info[taskID].ID,
        storage.tasks_used[taskID] ? "Tak" : "Nie",
        task_info[taskID].level + 1,
        task_info[taskID].type,
        task_info[taskID].content,
        task_info[taskID].answer
    ];
    for (let i = 0; i < 7; i++) {
        cells.push(document.createElement('td'));
        cells[i].innerHTML = TeXtoMathJaxpure(html_in[i] + "");
        row.appendChild(cells[i]);
    }
    return row;
}

function genrows() {
    let table = document.getElementById('task_table');
    for (let taskID in task_info) {
        table.appendChild(genrow(taskID));
    }
}

function start() {
    storage_init();
    get_tasks().then((tasks) => {
        task_info = tasks;
        genrows();
        MathJax.typeset();
    });
}