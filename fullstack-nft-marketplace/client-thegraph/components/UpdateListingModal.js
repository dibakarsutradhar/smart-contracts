import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useWeb3Contract } from 'react-moralis';
import { Input, Modal, useNotification } from 'web3uikit';

import nftMarketplaceAbi from '../constants/NftMarketplace.json';

const UpdateListingModal = ({
  tokenId,
  nftAddress,
  marketplaceAddress,
  isVisible,
  onClose,
}) => {
  const dispatch = useNotification();
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);

  const handleUpdateListingSuccess = async (tx) => {
    await tx.wait(1);
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
