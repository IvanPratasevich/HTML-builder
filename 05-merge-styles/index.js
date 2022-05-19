const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const stylesFolder = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    fsPromises.writeFile(bundlePath, ' ');
    const stylesFolderFiles = await fsPromises.readdir(stylesFolder, { withFileTypes: true });
    for (const file of stylesFolderFiles) {
      const extName = path.extname(file.name).replace('.', ' ').trim();
      fs.stat(path.join(__dirname, 'styles', file.name), (err) => {
        if (err) throw err;
        if (file.isFile() && extName == 'css') {
          const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
          readStream.on('data', (chunk) => {
            fsPromises.appendFile(bundlePath, chunk.toString());
          });
        }
      });
    }
    console.log('All styles added to bundle');
  } catch (err) {
    console.log(err);
  }
}
mergeStyles();

