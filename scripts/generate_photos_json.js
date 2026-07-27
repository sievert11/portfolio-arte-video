const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.resolve(__dirname, '../photos');
const OUTPUT_FILE = path.resolve(__dirname, '../data/photos.json');
const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

function toTitle(text) {
  return text
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function buildAltText(folderName, index) {
  return `${folderName} ${index}`;
}

function isImageFile(fileName) {
  return VALID_EXTENSIONS.includes(path.extname(fileName).toLowerCase());
}

function readPhotoFolders() {
  if (!fs.existsSync(IMAGES_DIR)) {
    throw new Error(`Diretório de fotos não encontrado: ${IMAGES_DIR}`);
  }

  return fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
}

function readImagesFromFolder(folderName) {
  const folderPath = path.join(IMAGES_DIR, folderName);
  return fs.readdirSync(folderPath)
    .filter((fileName) => isImageFile(fileName))
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }))
    .map((fileName, index) => ({
      src: path.posix.join('photos', folderName, fileName),
      alt: buildAltText(folderName.replace(/[-_]/g, ' '), index + 1),
    }));
}

function generatePhotosJson() {
  const folders = readPhotoFolders();

  const photoCarousels = folders.map((folderName) => {
    const images = readImagesFromFolder(folderName);
    return {
      key: folderName,
      title: toTitle(folderName),
      images,
    };
  });

  const output = { photoCarousels };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Gerado ${OUTPUT_FILE} com ${photoCarousels.length} carrossel(is).`);
}

try {
  generatePhotosJson();
} catch (error) {
  console.error('Falha ao gerar photos.json:', error.message);
  process.exit(1);
}
