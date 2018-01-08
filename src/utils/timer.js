// class Timer {
//     timer;
//     constructor(time = 60, type = 's', cbk) {
//         this.time = time;
//         this.type = type;
//         this.callback = params => {
//             cbk && cbk(params)
//         }
//     }
//     start() {
//         this.timer = setInterval(() => {
//             if (this.time < 2) {
//                 clearInterval(this.timer);
//                 this.callback(this.time)
//                 return
//             }
//             this.time--;
//             this.callback(this.time)
//         }, 1000)
//     }
// }