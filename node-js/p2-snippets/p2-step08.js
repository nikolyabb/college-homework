// Task 2.8: Synchronous and asynchronous file deletion
const fs = require('fs');
const path = require('path');
const syncFile = path.join(__dirname, 'delete-sync.txt');
const asyncFile = path.join(__dirname, 'delete-async.txt');

// Create files first so deletion has something to remove
fs.writeFileSync(syncFile, 'temporary sync file');
fs.writeFileSync(asyncFile, 'temporary async file');

fs.unlinkSync(syncFile);
console.log(`Synchronous delete: ${syncFile}`);

fs.unlink(asyncFile, (err) => {
  if (err) {
    console.error('Async delete error:', err.message);
    return;
  }
  console.log(`Asynchronous delete: ${asyncFile}`);
});
