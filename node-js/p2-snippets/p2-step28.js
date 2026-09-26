// Task 2.28: Show uploads subdirectory and uploaded file
// This snippet prints the current contents of the uploads directory.
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'upload-project', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  console.log('Uploads directory does not exist yet. Upload a file first.');
} else {
  const files = fs.readdirSync(uploadsDir);
  console.log('Files in uploads directory:');
  files.forEach((file) => {
    const stats = fs.statSync(path.join(uploadsDir, file));
    console.log(`  ${file} - ${stats.size} bytes`);
  });
}
