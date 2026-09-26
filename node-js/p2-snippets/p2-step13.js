// Task 2.13: Copy data using pipe
const fs = require('fs');
const path = require('path');
const input = path.join(__dirname, 'data.txt');
const output = path.join(__dirname, 'pipe-copy.txt');

const readable = fs.createReadStream(input);
const writable = fs.createWriteStream(output);

readable.pipe(writable);

writable.on('finish', () => {
  console.log(`Copied ${input} -> ${output}`);
});
