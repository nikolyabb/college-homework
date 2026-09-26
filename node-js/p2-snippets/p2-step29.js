// Task 2.29: Control file naming during upload
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'upload-project');
const serverPath = path.join(projectDir, 'server.js');

const serverCode = `const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('myFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  console.log('Stored with custom name:', req.file.filename);
  res.send(\`Saved as: \${req.file.filename}\`);
});

app.listen(3000, () => {
  console.log('Upload server at http://localhost:3000/');
});
`;

fs.writeFileSync(serverPath, serverCode);
console.log(`Updated server with controlled file naming: ${serverPath}`);
