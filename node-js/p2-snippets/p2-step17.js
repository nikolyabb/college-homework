// Task 2.17: Browser screenshots for four routes
// This file is the same server as step 16; run it and capture each route in a browser.
// Served routes: /home, /about, /contact, /anything-else (404)
const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  const routes = {
    '/home': '<h1>Home</h1>',
    '/about': '<h1>About</h1>',
    '/contact': '<h1>Contact</h1>'
  };

  if (routes[req.url]) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(routes[req.url]);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(port, () => {
  console.log('Open these links for screenshots:');
  console.log(`  http://localhost:${port}/home`);
  console.log(`  http://localhost:${port}/about`);
  console.log(`  http://localhost:${port}/contact`);
  console.log(`  http://localhost:${port}/unknown (404)`);
});
