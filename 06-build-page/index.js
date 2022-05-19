const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');
const projectAssestsFolder = path.join(__dirname, 'project-dist', 'assets');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
const copyFolder = path.join(__dirname, 'assets');
let dataHtml;
const readFile = async (filePath) => {
  try {
    const dataHtml = await fsPromises.readFile(filePath);
    return dataHtml;
  } catch (err) {
    console.log(err);
  }
};

async function createDirectory() {
  try {
    await fsPromises.mkdir(projectDist, { recursive: true });
  } catch (err) {
    console.log(err);
  }
}
async function copyLayout() {
  try {
    await fsPromises.copyFile(`${path.join(__dirname, 'template.html')}`, `${path.join(__dirname, 'project-dist', 'index.html')}`);
  } catch (err) {
    console.log(err);
  }
}

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
    console.log('\x1b[33m', 'All styles added to bundle', '\x1b[0m');
  } catch (err) {
    console.log(err);
  }
}

async function copyDirectory(src, destination) {
  try {
    const items = await fsPromises.readdir(src, { withFileTypes: true });
    await fsPromises.mkdir(destination);
    for (let i = 0; i < items.length; i++) {
      const srcPath = path.join(src, items[i].name);
      const destinationPath = path.join(destination, items[i].name);
      if (items[i].isDirectory()) {
        await copyDirectory(srcPath, destinationPath);
      } else {
        await fsPromises.copyFile(srcPath, destinationPath);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
async function deleteAndCopyAssestsFolder() {
  try {
    await fsPromises.rm(projectAssestsFolder, { recursive: true, force: true });
    copyDirectory(copyFolder, projectAssestsFolder);
  } catch (err) {
    console.log(err);
  }
}

async function checkEmptyFolder() {
  try {
    await fsPromises.readdir(projectAssestsFolder);
    deleteAndCopyAssestsFolder();
  } catch (err) {
    console.log('\x1b[36m', 'The project-dist folder did not exist. Created a project-dist folder.', '\x1b[0m');
    copyDirectory(copyFolder, projectAssestsFolder);
  }
}

async function getTemplates() {
  const componentsFolder = await fsPromises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
  for (const file of componentsFolder) {
    let extName = path.extname(file.name).replace('.', ' ').trim();
    fs.stat(path.join(__dirname, 'components', file.name), (err) => {
      if (err) throw err;
      if (file.isFile() && extName == 'html') {
        changeTemplate(file.name.split('.')[0]);
      }
    });
  }
  console.log('\x1b[32m', 'Bundle was built successfully!', '\x1b[0m');
}

async function changeTemplate(item) {
  let templateHTML = '';
  const readableStream = fs.createReadStream(path.join(__dirname, 'components', `${item}.html`));
  dataHtml = await readFile(path.join(__dirname, 'template.html'));
  readableStream.on('data', function (chunk) {
    templateHTML += chunk.toString();
  });
  readableStream.on('end', function () {
    dataHtml = dataHtml.toString().replace(`{{${item}}}`, templateHTML);
    fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), dataHtml);
  });
}

async function makeBundle() {
  await createDirectory();
  await copyLayout();
  await mergeStyles();
  await checkEmptyFolder();
  await getTemplates();
}

makeBundle();

