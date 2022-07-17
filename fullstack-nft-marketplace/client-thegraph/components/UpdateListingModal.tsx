import { ethers } from 'ethers';
import { useState } from 'react';
import { useWeb3Contract } from 'react-moralis';
import { Input, Modal, useNotification } from 'web3uikit';

import nftMarketplaceAbi from '../constants/NftMarketplace.json';

interface UpdateListingModalProps {
  tokenId: string;
  nftAddress: string;
  marketplaceAddress: string;
  isVisible: boolean;
  onClose: () => void;
}

const UpdateListingModal = ({
  tokenId,
  nftAddress,
  marketplaceAddress,
  isVisible,
  onClose,
}: UpdateListingModalProps) => {
  const dispatch = useNotification();
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState<
    string | undefined
  >();

  const handleUpdateListingSuccess = async () => {
    dispatch({
      type: 'success',
      message: 'Listing updated',
      title: 'Listing updated - please refresh (and move blocks)',
      position: 'topR',
    });
    onClose && onClose();
    setPriceToUpdateListingWith('0');
  };

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: 'updateListing',
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdateListingWith || '0'),
    },
  });

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        updateListing({
          onError: (error) => console.log(error),
          onSuccess: handleUpdateListingSuccess,
        });
      }}
    >
      <Input
        label="Update listing price in L1 Currency (ETH)"
        name="New Listing Price"
        type="number"
        onChange={(event) => {
          setPriceToUpdateListingWith(event.target.value);
        }}
      />
    </Modal>
  );
};

export default UpdateListingModal;
