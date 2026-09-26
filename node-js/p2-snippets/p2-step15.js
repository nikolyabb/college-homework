// Task 2.15: Create a server using request and response
const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  const userId = Math.floor(Math.random() * 10000);
  console.log(`Request: ${req.method} ${req.url} | UserId: ${userId}`);
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(`Hello! Your UserId is: ${userId}`);
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
