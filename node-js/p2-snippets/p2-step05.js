// Task 2.5: Asynchronous file read
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'data.txt');
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('Asynchronous read:');
  console.log(data);
});
