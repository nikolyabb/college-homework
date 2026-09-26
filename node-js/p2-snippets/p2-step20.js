// Task 2.20: Receive client data two ways
const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <form method="POST" action="/">
        <input name="message" value="Hello from form" />
        <button type="submit">Send</button>
      </form>
    `);
    return;
  }

  // Way 1: listening to 'data' event
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    console.log('Data event chunk:', chunk.toString());
  });

  req.on('end', () => {
    // Way 2: iterating over request object keys
    console.log('Request keys:', Object.keys(req));
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Received body: ${body}\nRequest keys: ${Object.keys(req).join(', ')}`);
  });
});

server.listen(port, () => {
  console.log(`Data server at http://localhost:${port}/`);
});
