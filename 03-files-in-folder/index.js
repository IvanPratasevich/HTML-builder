const path = require('path');
const fs = require('fs');
const folder = path.join(__dirname, 'secret-folder');
fs.readdir(folder, { withFileTypes: true }, (err, data) => {
  if (err) throw err;
  data.forEach((file) => {
    let extName = path.extname(file.name);
    fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
      if (err) throw err;
      if (file.isFile()) {
        console.log(
          file.name.replace(extName, ' ') +
            '-' +
            path.extname(file.name).replace('.', ' ') +
            ' ' +
            '-' +
            ' ' +
            stats.size / 1024 +
            'kb'
        );
      }
    });
  });
});