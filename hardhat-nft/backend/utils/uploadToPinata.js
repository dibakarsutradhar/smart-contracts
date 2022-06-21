const pinataSDK = require('@pinata/sdk');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const pinataAPIKey = process.env.PINATA_API_KEY;
const pinataAPISecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataAPIKey, pinataAPISecret);

const storeImages = async (imagesFilePath) => {
  const fullImagesPath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagesPath);
  let responses = [];
  console.log('-----------------------------------------');
  console.log('UPLOADING TO PINATA IPFS....!');
  for (fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );

    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);
    } catch (error) {
      console.log(error);
    }
  }

  console.log('UPLOADED SUCCESSFULLY....!');
  console.log('-----------------------------------------');

  return { responses, files };
};

const storeTokenUriMetadata = async (metadata) => {};

module.exports = { storeImages };
