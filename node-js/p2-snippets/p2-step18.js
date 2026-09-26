// Task 2.18: Implement redirection
const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/old-home') {
    res.writeHead(301, { Location: '/home' });
    res.end('Redirecting to /home ...');
  } else if (req.url === '/home') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Home</h1><p>You were redirected here.</p>');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(port, () => {
  console.log(`Redirect server at http://localhost:${port}/old-home`);
});
