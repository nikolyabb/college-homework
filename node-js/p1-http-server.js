const http = require('http');
const port = 3000;

const server = http.createServer((_, res) => res.end('Hello!'));
console.log(`Http server is listening on http://localhost:${port}`)
server.listen(port);
