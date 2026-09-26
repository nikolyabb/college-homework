// Task 2.26: Test program by uploading a file
// This creates a small sample file in the project directory to upload via the browser form.
const fs = require('fs');
const path = require('path');
const projectDir = path.join(__dirname, 'upload-project');
const sampleFile = path.join(projectDir, 'sample-upload.txt');

fs.writeFileSync(sampleFile, 'This is a sample file for uploading.');
console.log(`Sample upload file created at ${sampleFile}`);
console.log('Start the server with: cd p2-snippets/upload-project && node server.js');
console.log('Then open http://localhost:3000/ and upload sample-upload.txt');
