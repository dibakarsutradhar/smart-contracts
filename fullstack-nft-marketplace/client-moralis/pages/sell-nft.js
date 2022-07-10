import { Button, Form, useNotification } from 'web3uikit';
import { ethers } from 'ethers';
import { useMoralis, useWeb3Contract } from 'react-moralis';

import networkMapping from '../constants/networkMapping.json';
import nftMarketplaceAbi from '../constants/NftMarketplace.json';
import nftAbi from '../constants/BasicNft.json';
import { useEffect, useState } from 'react';

export default function SellNft() {
  const { chainId, account, isWeb3Enabled } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : '31337';
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0];
  const dispatch = useNotification();
  const [proceeds, setProceeds] = useState('0');

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

  const handleListSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: 'success',
      message: 'NFT Listing',
      title: 'NFT Listed',
      position: 'topR',
    });
  };

  const handleWithdrawSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: 'success',
      message: 'Withdrawing proceeds',
      position: 'topR',
    });
  };

  const setupUI = async () => {
    const returnedProceeds = await runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: 'getProceeds',
        params: {
          seller: account,
        },
      },
      onError: (error) => console.log(error),
    });

    if (returnedProceeds) {
      setProceeds(returnedProceeds.toString());
    }
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      setupUI();
    }
  }, [proceeds, account, isWeb3Enabled, chainId]);

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
      <div>Withdraw {proceeds} proceeds</div>
      {proceeds != '0' ? (
        <Button
          onClick={() => {
            runContractFunction({
              params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: 'withdrawProceeds',
                params: {},
              },
              onError: (error) => console.log(error),
              onSuccess: handleWithdrawSuccess,
            });
          }}
          text="Withdraw"
          type="button"
        />
      ) : (
        <div>No proceeds detected</div>
      )}
    </div>
  );
}
