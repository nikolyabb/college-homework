// Task 2.27: Demonstrate console reaction on upload
// This updates the server to log detailed upload events.
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'upload-project');
const serverPath = path.join(projectDir, 'server.js');

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
    console.log('No file received');
    return res.status(400).send('No file uploaded');
  }
  console.log('--- Upload received ---');
  console.log('Original name:', req.file.originalname);
  console.log('Stored name:', req.file.filename);
  console.log('Size:', req.file.size, 'bytes');
  console.log('Path:', req.file.path);
  res.send(\`File uploaded: \${req.file.originalname}\`);
});

app.listen(3000, () => {
  console.log('Upload server at http://localhost:3000/');
});
`;

fs.writeFileSync(serverPath, serverCode);
console.log(`Updated server to log uploads: ${serverPath}`);
