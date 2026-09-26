// Task 2.22: Create a new project
const fs = require('fs');
const path = require('path');
const projectDir = path.join(__dirname, 'upload-project');

if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
}

const packageJson = {
  name: 'upload-project',
  version: '1.0.0',
  description: 'Part 2 upload project',
  main: 'server.js',
  scripts: {
    start: 'node server.js'
  },
  dependencies: {}
};

fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));
console.log(`Created project at ${projectDir}`);
