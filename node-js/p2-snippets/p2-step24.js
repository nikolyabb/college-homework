// Task 2.24: Create a file upload form
const fs = require('fs');
const path = require('path');
const projectDir = path.join(__dirname, 'upload-project');
const uploadsDir = path.join(projectDir, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Upload File</title>
</head>
<body>
  <h1>Upload a file</h1>
  <form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="myFile" />
    <button type="submit">Upload</button>
  </form>
</body>
</html>`;

fs.writeFileSync(path.join(projectDir, 'index.html'), html);
console.log(`Upload form created at ${path.join(projectDir, 'index.html')}`);
