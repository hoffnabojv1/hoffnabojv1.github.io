let storage = {}
let last_local = JSON.stringify(window.localStorage)
let last;
function storage_init(){
    let kl = Object.keys(window.localStorage)
    for(let i = 0; i < kl.length; i++){
        storage[kl[i]] = JSON.parse(window.localStorage[kl[i]])
    }
    last = JSON.stringify(storage)
    setInterval(sync,10)
}
function sync(){
    if(JSON.stringify(storage) != last){
        let k1 = Object.keys(storage)
        for(let i = 0; i < k1.length;i++){
            window.localStorage[k1[i]] = JSON.stringify(storage[k1[i]])
        }
        last = JSON.stringify(storage)
        last_local = JSON.stringify(window.localStorage)
        return
    }
    if(JSON.stringify(window.localStorage) != last_local){
        let k2 = Object.keys(window.localStorage)
        for(let i = 0; i < k2.length;i++){
            storage[k2[i]] = JSON.parse(window.localStorage[k2[i]])
        }
        last = JSON.stringify(storage)
        last_local = JSON.stringify(window.localStorage)
    }
}