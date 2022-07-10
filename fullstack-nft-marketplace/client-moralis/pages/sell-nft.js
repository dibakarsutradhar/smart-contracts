import { Form, useNotification } from 'web3uikit';
import { ethers } from 'ethers';
import { useMoralis, useWeb3Contract } from 'react-moralis';

import networkMapping from '../constants/networkMapping.json';
import nftMarketplaceAbi from '../constants/NftMarketplace.json';
import nftAbi from '../constants/BasicNft.json';

export default function SellNft() {
  const { chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : '31337';
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0];
  const dispatch = useNotification();

  const { runContractFunction } = useWeb3Contract();

  const approveAndList = async (data) => {
    console.log('Approving...');
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseEther(data.data[2].inputResult, 'ether')
      .toString();

    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: 'approve',
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
      onError: (error) => console.log(error),
    });
  };

  const handleApproveSuccess = async (nftAddress, tokenId, price) => {
    console.log('Listing...!');
    const listOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: 'listItem',
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };

    await runContractFunction({
      params: listOptions,
      onSuccess: () => handleListSuccess(),
      onError: (error) => console.log(error),
    });
  };

  const handleListSuccess = async () => {
    dispatch({
      type: 'success',
      message: 'NFT Listing',
      title: 'NFT Listed',
      position: 'topR',
    });
  };

  return (
    <div>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: 'NFT Address',
            type: 'text',
            inputWidth: '50%',
            value: '',
            key: 'nftAddress',
          },
          {
            name: 'Token ID',
            type: 'number',
            value: '',
            key: 'tokenId',
          },
          {
            name: 'Price (in ETH)',
            type: 'number',
            value: '',
            key: 'price',
          },
        ]}
        title="Sell Your NFT!"
        id="Main Form"
      />
    </div>
  );
}
