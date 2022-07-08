import React, { useEffect, useState } from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import nftMarketplaceAbi from '../constants/NftMarketplace.json';
import nftAbi from '../constants/BasicNft.json';
import Image from 'next/image';
import { Card } from 'web3uikit';
import { ethers } from 'ethers';

const NFTBox = ({
  price,
  nft,
  tokenId,
  nftAddress,
  marketplaceAddress,
  seller,
}) => {
  const { isWeb3Enabled } = useMoralis();
  const [imageURI, setImageURI] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenDesc, setTokenDesc] = useState('');

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: 'tokenURI',
    params: {
      tokenId: tokenId,
    },
  });

  const updateUI = async () => {
    // get the token URI
    const tokenURI = await getTokenURI();
    console.log(`The TokenURI is: ${tokenURI}`);
    // using the image tag from the tokeURI, get the image
    if (tokenURI) {
      // IPFS Gateway: A server that will return IPFS files from a "normal" URL
      const requestURL = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageUriUrl = imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      setImageURI(imageUriUrl);
      setTokenName(tokenURIResponse.name);
      setTokenDesc(tokenURIResponse.description);

      // Better ways
      // We could render the image on our server, and just call our server
      // For testnets & mainnet --> use moralis server hooks
      // Have the world adopt IPFS
    }
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      {imageURI ? (
        <Card title={tokenName} description={tokenDesc}>
          <div className="p-2">
            <div className="flex flex-col items-end gap-2">
              <div>#{tokenId}</div>
              <div className="italic text-sm">Owned by {seller}</div>
              <Image
                loader={() => imageURI}
                src={imageURI}
                height="200"
                width="200"
              />
              <div className="font-bold">
                {ethers.utils.formatUnits(price, 'ether')} ETH
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default NFTBox;
