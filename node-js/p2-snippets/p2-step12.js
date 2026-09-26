// Task 2.12: Read and write text file using streams
const fs = require('fs');
const path = require('path');
const input = path.join(__dirname, 'data.txt');
const output = path.join(__dirname, 'stream-output.txt');

const readable = fs.createReadStream(input, 'utf8');
const writable = fs.createWriteStream(output);

readable.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
  writable.write(chunk);
});

readable.on('end', () => {
  writable.end();
  console.log(`Stream write completed: ${output}`);
});
