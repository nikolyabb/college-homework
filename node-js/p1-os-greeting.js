const os = require('os');

const userName = os.userInfo().username;
const currentHour = new Date().getHours();

let greeting = "";

if (currentHour >= 5 && currentHour < 12) {
    greeting = "Доброе утро";
} else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Добрый день";
} else {
    greeting = "Добрый вечер"; 
}

console.log(`${greeting}, ${userName}!`);
