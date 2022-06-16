import React, { useEffect, useState } from 'react';
import { useWeb3Contract } from 'react-moralis';
import { abi, contractAddress } from '../constants';
import { useMoralis } from 'react-moralis';

const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState('0');

  // const { runContractFunction: enterRaffle } = useWeb3Contract({
  // 	abi: abi,
  // 	contractAddress: raffleAddress,
  // 	functionName: "enterRaffle",
  // 	params: {},
  // 	msgValue:
  // })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getEntranceFee',
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      const updateUI = async () => {
        const entranceFeeFromCall = await getEntranceFee();
        setEntranceFee(entranceFeeFromCall);
        console.log(entranceFee);
      };
      updateUI();
    }
  }, [isWeb3Enabled]);

  return <div>Hello LE</div>;
};

export default LotteryEntrance;
