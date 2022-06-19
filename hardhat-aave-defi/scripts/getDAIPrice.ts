import { ethers, network } from 'hardhat';
import { networkConfig } from '../helper-hardhat-config';

const getDAIPrice = async () => {
  console.log('------------------------------------------------');
  console.log('GETTING UPDATED DAI/ETH PRICE');
  const daiEthPriceFeed = await ethers.getContractAt(
    'AggregatorV3Interface',
    networkConfig[network.config!.chainId!].daiEthPriceFeed!
  );

  const price = (await daiEthPriceFeed.latestRoundData())[1];
  console.log(`The DAI/ETH price is ${price.toString()}`);
  console.log('------------------------------------------------');

  return price;
};

export default getDAIPrice;
