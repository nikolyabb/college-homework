// Task 2.21: Use templates
const http = require('http');
const port = 3000;

function renderTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
}

const pageTemplate = `<h1>Hello, {{name}}!</h1><p>Today is {{date}}.</p>`;

const server = http.createServer((req, res) => {
  const data = {
    name: 'Student',
    date: new Date().toLocaleDateString('ru-RU')
  };
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(renderTemplate(pageTemplate, data));
});

server.listen(port, () => {
  console.log(`Template server at http://localhost:${port}/`);
});
