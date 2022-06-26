import { storeImages, storeTokenUriMetadata } from './uploadToPinata';
import { imagesLocation } from '../helper-hardhat-config';
import { metadataTemplate } from './metadataTemplate';

export const handleTokenUris = async () => {
  let tokenUris: string[] = [];

  // store the Image in IPFS
  // Store the metadata in IPFS
  const { responses: imageUploadResponses, files } = await storeImages(
    imagesLocation
  );

  for (const imageUploadResponsesIndex in imageUploadResponses) {
    // create the metadata
    let tokenUriMetadata = { ...metadataTemplate };
    tokenUriMetadata.name = files[imageUploadResponsesIndex].replace(
      '.png',
      ''
    );
    // upload the metadata
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponsesIndex].IpfsHash}`;
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup`;
    console.log(`UPLOADING ${tokenUriMetadata.name}....`);
    // store the file
    const metadataUploadResponse = await storeTokenUriMetadata(
      tokenUriMetadata
    );
    tokenUris.push(`ipfs://${metadataUploadResponse!.IpfsHash}`);
  }
  console.log('Token URIs Uploaded...! They are: ');
  console.log(tokenUris);
  console.log('-----------------------------------------');

  return tokenUris;
};
