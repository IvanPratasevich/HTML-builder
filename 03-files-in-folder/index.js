const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const filesInFolder = async () => {
  try {
    const folder = await fsPromises.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
    for (const file of folder) {
      let extName = path.extname(file.name);
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
        if (file.isFile()) {
          console.log(file.name.replace(extName, ' ') + '-' + path.extname(file.name).replace('.', ' ') + ' ' + '-' + ' ' + stats.size / 1024 + 'kb');
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};
filesInFolder();

