// Task 2.6: Synchronous and asynchronous file write
const fs = require('fs');
const path = require('path');
const syncFile = path.join(__dirname, 'output-sync.txt');
const asyncFile = path.join(__dirname, 'output-async.txt');

fs.writeFileSync(syncFile, 'Hello from synchronous write!\n');
console.log(`Synchronous file written: ${syncFile}`);

fs.writeFile(asyncFile, 'Hello from asynchronous write!\n', (err) => {
  if (err) {
    console.error('Async write error:', err.message);
    return;
  }
  console.log(`Asynchronous file written: ${asyncFile}`);
});
