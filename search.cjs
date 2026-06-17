const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  }
  return results;
}

const files = walk('src');
const queries = ["initializeFirestore(", "getFirestore(", "firebaseConfig", "db ="];

for (const query of queries) {
  console.log(`\n--- Searching for: ${query} ---`);
  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(query)) {
        console.log(`${file}:${i + 1}: ${lines[i].trim()}`);
      }
    }
  }
}
