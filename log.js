// function log_to_html(...args){
//     if(localStorage["user_name"] == "-SouCraK12345-" || localStorage["user_name"] == "なんざん"){
//         document.querySelector(".log").innerHTML += "<br>" + args;
//         document.querySelector(".log").style.display = "block";
//         setTimeout(function(){
//             document.querySelector(".log").scrollBy(0,1000000);
//         }, 20);
//     }
// }
// const originalConsoleLog = console.log;
// const originalConsoleError= console.error;
// console.log = function(...args) {
//     originalConsoleLog.apply(console, args); // 元のconsole.logも呼び出す
//     log_to_html(args);
// };
// console.error = function(...args) {
//     originalConsoleError.apply(console, args); // 元のconsole.logも呼び出す
//     log_to_html(args);
// };