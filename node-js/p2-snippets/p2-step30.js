// Task 2.30: Filter files by type
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
    cb(null, Date.now() + '-' + file.originalname);
  }
});

function fileFilter(req, file, cb) {
  const allowedTypes = ['text/plain', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed: ' + file.mimetype), false);
  }
}

const upload = multer({ storage, fileFilter });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('myFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded or file type rejected');
  }
  console.log('Accepted file:', req.file.filename, 'type:', req.file.mimetype);
  res.send(\`Accepted: \${req.file.originalname} (\${req.file.mimetype})\`);
});

app.listen(3000, () => {
  console.log('Filtered upload server at http://localhost:3000/');
});
`;

fs.writeFileSync(serverPath, serverCode);
console.log(`Updated server with file type filter: ${serverPath}`);
