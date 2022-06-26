import pinataSDK, { PinataPinResponse } from '@pinata/sdk';
import * as fs from 'fs-extra';
import path from 'path';

const pinataAPIKey = process.env.PINATA_API_KEY || '';
const pinataAPISecret = process.env.PINATA_API_SECRET || '';
const pinata = pinataSDK(pinataAPIKey, pinataAPISecret);

export const storeImages = async (imagesFilePath: string) => {
  const fullImagesPath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagesPath);
  let responses: any[] = [];
  console.log('-----------------------------------------');
  console.log('UPLOADING TO PINATA IPFS....!');
  for (const fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );

    try {
      const response: PinataPinResponse = await pinata.pinFileToIPFS(
        readableStreamForFile
      );
      responses.push(response);
    } catch (error) {
      console.log(error);
    }
  }

  console.log('UPLOADED SUCCESSFULLY....!');
  console.log('-----------------------------------------');

  return { responses, files };
};

export const storeTokenUriMetadata = async (metadata: Object) => {
  try {
    const response: PinataPinResponse = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
};
