const { imagesLocation } = require('../helper-hardhat-config');
const { storeImages, storeTokenUriMetadata } = require('./uploadToPinata');

const { metadataTemplate } = require('./metadataTemplate');

const handleTokenUris = async (tokenUris) => {
  tokenUris = [];

  // store the Image in IPFS
  // Store the metadata in IPFS
  const { responses: imageUploadResponses, files } = await storeImages(
    imagesLocation
  );

  for (imageUploadResponsesIndex in imageUploadResponses) {
    // create the metadata
    let tokenUriMetadata = { ...metadataTemplate };
    tokenUriMetadata.name = files[imageUploadResponsesIndex].replace(
      '.png',
      ''
    );
    // upload the metadata
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponsesIndex].IpfsHash}`;
    console.log(`UPLOADING ${tokenUriMetadata.name}....`);
    // store the file
    const metadataUploadResponse = await storeTokenUriMetadata(
      tokenUriMetadata
    );
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }
  console.log('Token URIs Uploaded...! They are: ');
  console.log(tokenUris);
  console.log('-----------------------------------------');

  return tokenUris;
};

module.exports = { handleTokenUris };
