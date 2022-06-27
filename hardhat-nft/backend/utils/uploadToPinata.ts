import pinataSDK, { PinataClient, PinataPinResponse } from '@pinata/sdk';
import * as fs from 'fs-extra';
import { PathLike, ReadStream } from 'fs-extra';
import path from 'path';

const pinataAPIKey: string = process.env.PINATA_API_KEY || '';
const pinataAPISecret: string = process.env.PINATA_API_SECRET || '';
const pinata: PinataClient = pinataSDK(pinataAPIKey, pinataAPISecret);

export const storeImages = async (
  imagesFilePath: string
): Promise<{
  responses: PinataPinResponse[];
  files: string[];
}> => {
  const fullImagesPath: PathLike = path.resolve(imagesFilePath);
  const files: string[] = fs.readdirSync(fullImagesPath);
  let responses: PinataPinResponse[] = [];
  console.log('-----------------------------------------');
  console.log('UPLOADING TO PINATA IPFS....!');
  for (const fileIndex in files) {
    const readableStreamForFile: ReadStream = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );

    try {
      const response: PinataPinResponse = await pinata.pinFileToIPFS(
        readableStreamForFile
      );
      responses.push(response);
    } catch (error: any) {
      console.log(error);
    }
  }

  console.log('UPLOADED SUCCESSFULLY....!');
  console.log('-----------------------------------------');

  return { responses, files };
};

export const storeTokenUriMetadata = async (
  metadata: Object
): Promise<PinataPinResponse> => {
  try {
    const response: PinataPinResponse = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (error: any) {
    console.log(error);
  }
  return null;
};
