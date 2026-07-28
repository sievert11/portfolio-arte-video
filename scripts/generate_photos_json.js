const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'fotos');
const OUTPUT_FILE = path.join(ROOT_DIR, 'data', 'photos.json');
const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
const SECTION_ORDER = [
  { key: 'campanhas', title: 'Campanhas' },
  { key: 'still-produtos', title: 'Still Produtos' },
];

function toTitle(text) {
  return text
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function buildAltText(folderName, index) {
  return `${folderName} ${index}`;
}

function isImageFile(fileName) {
  return VALID_EXTENSIONS.includes(path.extname(fileName).toLowerCase());
}

function readImagesFromFolder(sectionName, folderName) {
  const folderPath = path.join(IMAGES_DIR, sectionName, folderName);
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  return fs.readdirSync(folderPath)
    .filter((fileName) => isImageFile(fileName))
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }))
    .map((fileName, index) => ({
      src: path.posix.join('fotos', sectionName, folderName, fileName),
      alt: buildAltText(folderName.replace(/[-_]/g, ' '), index + 1),
    }));
}

function readPhotoCarousels(sectionName) {
  const sectionDir = path.join(IMAGES_DIR, sectionName);
  if (!fs.existsSync(sectionDir)) {
    return [];
  }

  return fs.readdirSync(sectionDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }))
    .map((folderName) => {
      const images = readImagesFromFolder(sectionName, folderName);
      return images.length ? {
        key: folderName,
        title: toTitle(folderName),
        images,
      } : null;
    })
    .filter(Boolean);
}

function buildPhotoCarouselCatalog(rootDir = ROOT_DIR) {
  const imagesDir = path.join(rootDir, 'fotos');

  return SECTION_ORDER.map(({ key, title }) => ({
    section: key,
    title,
    carousels: readPhotoCarousels(key, imagesDir),
  }));
}

function generatePhotosJson(rootDir = ROOT_DIR) {
  const catalog = buildPhotoCarouselCatalog(rootDir);
  const output = { photoCarousels: catalog };
  fs.writeFileSync(path.join(rootDir, 'data', 'photos.json'), JSON.stringify(output, null, 2), 'utf8');
  console.log(`Gerado ${path.join(rootDir, 'data', 'photos.json')} com ${catalog.reduce((total, section) => total + section.carousels.length, 0)} carrossel(is).`);
}

module.exports = {
  buildPhotoCarouselCatalog,
  generatePhotosJson,
  toTitle,
};

if (require.main === module) {
  try {
    generatePhotosJson();
  } catch (error) {
    console.error('Falha ao gerar photos.json:', error.message);
    process.exit(1);
  }
}
