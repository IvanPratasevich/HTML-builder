const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const stylesFolder = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    let data = '';
    fsPromises.writeFile(bundlePath, ' ');
    const stylesFolderFiles = await fsPromises.readdir(stylesFolder, { withFileTypes: true });
    for (const file of stylesFolderFiles) {
      const extName = path.extname(file.name).replace('.', ' ').trim();
      fs.stat(path.join(__dirname, 'styles', file.name), (err) => {
        if (err) throw err;
        if (file.isFile() && extName == 'css') {
          const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
          readStream.on('data', function (chunk) {
            data += chunk.toString();
          });
          readStream.on('end', function () {
            fsPromises.appendFile(bundlePath, data.toString());
          });
        }
      });
    }
    console.log('\x1b[33m', 'All styles added to bundle', '\x1b[0m');
  } catch (err) {
    console.log(err);
  }
}
mergeStyles();

