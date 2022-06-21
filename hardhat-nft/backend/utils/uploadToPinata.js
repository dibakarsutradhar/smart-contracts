const path = require('path');
const fs = require('fs');

const storeImages = async (imagesFilePath) => {
  const fullImagesPath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagesPath);
  console.log(files);
};

module.exports = { storeImages };
