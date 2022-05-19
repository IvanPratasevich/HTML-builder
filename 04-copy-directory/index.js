const fsPromises = require('fs/promises');
const path = require('path');
const originFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');
async function copyDirectory() {
  await fsPromises.mkdir(copyFolder, { recursive: true });
  const copyFiles = await fsPromises.readdir(copyFolder, { withFileTypes: true });
  const originFiles = await fsPromises.readdir(originFolder, { withFileTypes: true });
  for (const file of copyFiles) {
    fsPromises.unlink(path.join(copyFolder, file.name));
  }
  for (const file of originFiles) {
    fsPromises.copyFile(path.join(originFolder, file.name), path.join(copyFolder, file.name));
  }
}
copyDirectory();

