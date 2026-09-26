// Task 2.25: Use multer to receive uploaded file
// This snippet creates the upload-project server that uses multer.
// Run with: cd p2-snippets/upload-project && node server.js
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'upload-project');
const serverPath = path.join(projectDir, 'server.js');
const uploadsDir = path.join(projectDir, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const serverCode = `const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('myFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  console.log('Received file:', req.file);
  res.send(\`File uploaded: \${req.file.originalname} -> \${req.file.filename}\`);
});

app.listen(3000, () => {
  console.log('Upload server at http://localhost:3000/');
});
`;

fs.writeFileSync(serverPath, serverCode);
console.log(`Upload server created at ${serverPath}`);
