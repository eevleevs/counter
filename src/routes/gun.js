import Gun from "gun"
const gun = Gun('https://gun.ivlivs.it')

let counters = {}
gun.get('counters').once().map().once((v,k) => counters[k] = v)