const process = require('process');
const path = require('path');
const fs = require('fs');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

process.stdout.write('Hi! Please enter some text.... \n');
process.stdin.on('data', (chunk) => {
  let dataToString = chunk.toString().trim();
  if (dataToString == 'exit') {
    processExit();
  } else {
    output.write(chunk);
  }
});
function processExit() {
  process.stdout.write('Goodbye!');
  process.exit();
}
process.on('SIGINT', processExit);
