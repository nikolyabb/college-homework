// Task 2.23: Load express and multer packages
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const projectDir = path.join(__dirname, 'upload-project');

if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify({ name: 'upload-project', version: '1.0.0', main: 'server.js', scripts: { start: 'node server.js' }, dependencies: {} }, null, 2)
  );
}

console.log('Installing express and multer...');
execSync('npm install express multer', { cwd: projectDir, stdio: 'inherit' });
console.log('express and multer installed.');
