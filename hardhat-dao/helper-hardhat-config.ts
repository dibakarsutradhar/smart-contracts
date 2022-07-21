interface networkConfigItem {
  name?: string;
  ethUsdPriceFeed?: string;
  gasLane?: string;
  mintFee?: string;
  callbackGasLimit?: string;
  vrfCoordinatorV2?: string;
  subscriptionId?: string;
}

interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  31337: {
    name: 'localhost',
    ethUsdPriceFeed: '0x9326BFA02ADD2366b30bacB125260Af641031331',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
    mintFee: '10000000000000000', // 0.01 ETH
    callbackGasLimit: '50000000', // 500,000 gas
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
    subscriptionId: '1002', // add your ID here!
  },
};

export const DECIMALS = '18';
export const INITIAL_PRICE = '200000000000000000000';
export const developmentChains = ['hardhat', 'localhost'];

export const BLOCKS = 2;
export const SLEEP_AMOUNT = 1000;
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

export const MIN_DELAY = 3600;
export const VOTING_PERIOD = 5;
export const VOTING_DELAY = 1;
export const QUORUM_PERCENTAGE = 4;
