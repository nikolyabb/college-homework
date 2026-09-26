// Task 2.7: Append information to a text file
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'output-sync.txt');

fs.appendFileSync(filePath, 'Appended line (synchronous).\n');
console.log(`Appended to ${filePath}`);
