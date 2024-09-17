async function get_tasks(){
    const r = await fetch("/contents/tasks.json")
    const a = await r.json()
    return a
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
        res = "<table><tr><td><h2>"+tmn+"</h2><h1>"+kod+"</h1></td><td>" + res + "</td><td>" + im2.reduce((x,y) => x + y) + "</td></tr></table>"
    }else{
        res = "<table><tr><td><h2>"+tmn+"</h2><h1>"+kod+"</h1></td><td style='width: calc(100% - 1cm)'>" + res + "</td></tr></table>"
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

async function start(){
    storage_init()
    TL = await get_tasks()
    t = location.hash.split("#")
    TN = storage.tempactteams.length
    for(let j = 0; j < TN;j++){
        for(let i = 1; i < t.length;i++){
            aktnum = TN * i + j
            kodg = zer(3,(37 + (aktnum + 1) * 69) % 1000)
            kontr = (kodg[0] * 1 + kodg[1] * 3 + kodg[2] * 7) % 10
            kodg = kodg + (""+ kontr)
            ndiv = document.createElement("div")
            ndiv.classList = "taskcontainer"
            ndiv.innerHTML = TeXtoMathJax("\\(\\textbf{Zadanie " + i + ".}\\) " + TL[t[i] * 1].content, TL[t[i] * 1].images, storage.tempactteams[j], kodg)
            document.body.appendChild(ndiv)
        }
        ndiv2 = document.createElement("div")
        ndiv2.classList = "pb"
        document.body.appendChild(ndiv2)
    }
    MathJax.typeset()
}