// Task 2.19: Send a file two ways
const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;
const filePath = path.join(__dirname, 'data.txt');

const server = http.createServer((req, res) => {
  if (req.url === '/stream') {
    // Way 1: using a readable stream
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } else if (req.url === '/buffer') {
    // Way 2: reading the whole file and sending the buffer
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error reading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found. Try /stream or /buffer');
  }
});

server.listen(port, () => {
  console.log(`File server at http://localhost:${port}/stream and /buffer`);
});
