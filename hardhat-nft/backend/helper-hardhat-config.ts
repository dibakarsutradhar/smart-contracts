export interface networkConfigItem {
  name?: string;
  subscriptionId?: string;
  callbackGasLimit?: string;
  ethUsdPriceFeed?: string;
  gasLane?: string;
  mintFee?: string;
  vrfCoordinatorV2?: string;
}

export interface networkConfigInfo {
  [key: number]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  31337: {
    name: 'localhost',
    ethUsdPriceFeed: '0x9326BFA02ADD2366b30bacB125260Af641031331',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
    mintFee: '10000000000000000', // 0.01 ETH
    callbackGasLimit: '500000', // 500,000 gas
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Kovan
  4: {
    name: 'rinkeby',
    ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
    callbackGasLimit: '500000', // 500,000 gas
    mintFee: '10000000000000000', // 0.01 ETH
    subscriptionId: '6258', // add your ID here!
  },
};

export const DECIMALS: string = '18';
export const INITIAL_PRICE: string = '200000000000000000000';
export const developmentChains: string[] = ['hardhat', 'localhost'];
export const imagesLocation = './images/randomNft';
export const FUND_AMOUNT: string = '1000000000000000000000';
export const VERIFICATION_BLOCK_CONFIRMATIONS: number = 6;
