// Task 2.4: Synchronous file read
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'data.txt');
const data = fs.readFileSync(filePath, 'utf8');
console.log('Synchronous read:');
console.log(data);
