// Task 2.14: Create archive using pipe and zlib
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const input = path.join(__dirname, 'data.txt');
const output = path.join(__dirname, 'data.txt.gz');

const readable = fs.createReadStream(input);
const gzip = zlib.createGzip();
const writable = fs.createWriteStream(output);

readable.pipe(gzip).pipe(writable);

writable.on('finish', () => {
  const originalSize = fs.statSync(input).size;
  const archiveSize = fs.statSync(output).size;
  console.log(`Archive created: ${output}`);
  console.log(`Original size: ${originalSize} bytes`);
  console.log(`Archive size: ${archiveSize} bytes`);
});
