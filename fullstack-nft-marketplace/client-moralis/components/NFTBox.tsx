import { ethers } from 'ethers';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { Card, useNotification } from 'web3uikit';
import nftAbi from '../constants/BasicNft.json';
import nftMarketplaceAbi from '../constants/NftMarketplace.json';
import truncateStr from '../utils/truncateStr';
import UpdateListingModal from './UpdateListingModal';

interface NFTBoxProps {
  price?: string;
  tokenId: string;
  nftAddress: string;
  marketplaceAddress: string;
  seller?: string;
}

const NFTBox: NextPage<NFTBoxProps> = ({
  price,
  tokenId,
  nftAddress,
  marketplaceAddress,
  seller,
}: NFTBoxProps) => {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState<string | undefined>();
  const [tokenName, setTokenName] = useState<string | undefined>();
  const [tokenDesc, setTokenDesc] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => setShowModal(false);
  const dispatch = useNotification();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: 'tokenURI',
    params: {
      tokenId: tokenId,
    },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: 'buyItem',
    msgValue: price,
    params: {
      nftAddress: nftAddress,
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
      const requestURL = (tokenURI as string).replace(
        'ipfs://',
        'https://ipfs.io/ipfs/'
      );
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageUriUrl = (imageURI as string).replace(
        'ipfs://',
        'https://ipfs.io/ipfs/'
      );
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

  const isOwnedByUser: boolean = seller == account || seller === undefined;
  const formattedSellerAddress: string = isOwnedByUser
    ? 'you'
    : truncateStr(seller || '', 15);

  const handleCardClick = () => {
    isOwnedByUser
      ? setShowModal(true)
      : buyItem({
          onError: (error) => console.log(error),
          onSuccess: () => handleBuyItemSuccess(),
        });
  };

  const handleBuyItemSuccess = () => {
    dispatch({
      type: 'success',
      message: 'Item Bought',
      title: 'Item Bought',
      position: 'topR',
    });
  };

  return (
    <div className="p-2">
      {imageURI ? (
        <div>
          <UpdateListingModal
            isVisible={showModal}
            tokenId={tokenId}
            marketplaceAddress={marketplaceAddress}
            nftAddress={nftAddress}
            onClose={hideModal}
          />
          <Card
            title={tokenName}
            description={tokenDesc}
            onClick={handleCardClick}
          >
            <div className="p-2">
              <div className="flex flex-col items-end gap-2">
                <div>#{tokenId}</div>
                <div className="italic text-sm">
                  Owned by {formattedSellerAddress}
                </div>
                <Image
                  loader={() => imageURI}
                  src={imageURI}
                  height="200"
                  width="200"
                />
                {price && (
                  <div className="font-bold">
                    {ethers.utils.formatUnits(price, 'ether')} ETH
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default NFTBox;
