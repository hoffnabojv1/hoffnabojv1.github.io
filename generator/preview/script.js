async function get_tasks(){
    const r = await fetch("/contents/tasks.json")
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

function TeXtoMathJax(inp, im, tmn,kod){
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
    if (im.length != 0){
        im2 = im.map(x => "<img src = '" + x + "'>\n")
        res = "<table><tr><td><h2>"+tmn+"</h2><img src= 'https://www.barcode-generator.org/zint/api.php?bc_number=20&bc_data="+kod+"'></td><td>" + res + "</td><td>" + im2.reduce((x,y) => x + y) + "</td></tr></table>"
    }else{
        res = "<table><tr><td><h2>"+tmn+"</h2><img src= 'https://www.barcode-generator.org/zint/api.php?bc_number=20&bc_data="+kod+"'></td><td style='width: calc(100% - 1cm)'>" + res + "</td></tr></table>"
    }
    return res
}

function zer(l, inp){
    inp = inp + ""
    while(inp.length < l){
        inp = "0" + inp
    }
    return inp
}

function add_task_to_body(task_number, team_number){
    if(task_number < 0){
        addFreeSpace()
        return
    }
    if(task_number >= t.length){
        debugger
    }
    aktnum = task_number + team_number * (t.length)
    kodg = zer(3,(37 + (aktnum) * 69) % 1000)
    kontr = (kodg[0] * 1 + kodg[1] * 3 + kodg[2] * 7) % 10
    kodg = kodg + (""+ kontr)
    ndiv = document.createElement("div")
    ndiv.classList = "taskcontainer"
    ndiv.innerHTML = TeXtoMathJax("\\(\\textbf{Zadanie " + task_number + ".}\\) " + TL[t[task_number] * 1].content, TL[t[task_number] * 1].images, storage.tempactteams[team_number], kodg)
    document.body.appendChild(ndiv)
}

function addFreeSpace(){
    ndiv = document.createElement("div")
    ndiv.classList = "taskcontainer"
    ndiv.innerHTML = ""
    document.body.appendChild(ndiv)
}

function normalise(matrix){
    if(matrix.length % 4 == 0){
        return matrix
    }
    if(matrix.length % 4 == 3){
        temp = []
        for(let i = 0; i < matrix[0].length;i++){
            temp.push([-1,-1])
        }
        matrix.push(temp)
        return matrix
    }
    residue = matrix.length % 4
    parts = 4/residue
    part_length = Math.ceil(matrix[0].length / parts)
    result = []
    for(let i = 0; i < matrix.length - residue;i++){
        result.push(matrix[i])
    }
    for(let i = 0; i < residue;i++){
        for(let j = 0; j < parts;j++){
            temp = []
            for(let k = 0; k < part_length;k++){
                if(j * part_length + k < matrix[i].length){
                    temp.push(matrix[matrix.length - residue + i][j * part_length + k])
                }else{
                    temp.push([-1,-1])
                }
            }
            result.push(temp)
        }
    }
    return result
}

function read_columns(matrix){
    result = []
    for(let i = 0; i < matrix[0].length;i++){
        for(let j = 0; j < matrix.length;j++){
            result.push(matrix[j][i])
        }
    }
    return result
}

async function start(){
    storage_init()
    TL = await get_tasks()
    t = location.hash.split("#")
    TN = storage.tempactteams.length
    senior_teams = storage.tempsencount
    junior_teams = TN - senior_teams
    //Junior loop
    junior_matrix = []
    for(let teamnum = 0; teamnum < junior_teams; teamnum++){
        junior_matrix.push([])
        for(let tasknum = 1; tasknum < t.length; tasknum++){
            junior_matrix[teamnum].push([teamnum,tasknum])
        }
    }
    junior_matrix = normalise(junior_matrix)
    junior_list = read_columns(junior_matrix)
    for(let i = 0; i < junior_list.length;i++){
        add_task_to_body(junior_list[i][1],junior_list[i][0])
    }
    //Senior loop
    senior_matrix = []
    for(let teamnum = 0; teamnum < senior_teams; teamnum++){
        senior_matrix.push([])
        for(let tasknum = storage.tempsenskip + 1; tasknum < t.length; tasknum++){
            senior_matrix[teamnum].push([teamnum + junior_teams,tasknum])
        }
    }
    senior_matrix = normalise(senior_matrix)
    senior_list = read_columns(senior_matrix)
    for(let i = 0; i < senior_list.length;i++){
        add_task_to_body(senior_list[i][1],senior_list[i][0])
    }
    ansc = document.createElement("div")
    ans = document.createElement("table")
    for(let i = 1;i < t.length;i++){
        ansi = document.createElement("tr")
        num = document.createElement("td")
        anst = document.createElement("td")
        num.innerHTML = i
        anst.innerHTML = TeXtoMathJaxpure(TL[t[i] * 1].answer)
        ansi.appendChild(num)
        ansi.appendChild(anst)
        ans.appendChild(ansi)
    }
    ans.classList = "anstable"
    ansc.classList = "anscontainer"
    ansc.appendChild(ans)
    document.body.appendChild(ansc)
    MathJax.typeset()
}
