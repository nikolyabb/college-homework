// Task 2.16: Routing (home, about, contact, 404)
const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  switch (req.url) {
    case '/':
    case '/home':
      res.end('<h1>Home</h1><p>Welcome to the home page.</p>');
      break;
    case '/about':
      res.end('<h1>About</h1><p>This is the about page.</p>');
      break;
    case '/contact':
      res.end('<h1>Contact</h1><p>Contact us here.</p>');
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(port, () => {
  console.log(`Router running at http://localhost:${port}/`);
});
