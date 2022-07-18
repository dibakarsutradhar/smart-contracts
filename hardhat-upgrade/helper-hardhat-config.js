const networkConfig = {
  default: {
    name: 'hardhat',
    keepersUpdateInterval: '30',
  },
  4: {
    name: 'rinkeby',
    subscriptionId: '6258',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
    keepersUpdateInterval: '30',
    raffleEntranceFee: '100000000000000000', //'100000000000000000', // 0.1 ETH
    callbackGasLimit: '500000', // 500,000 gas
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
  },
  31337: {
    name: 'hardhat',
    subscriptionId: '6258',
    raffleEntranceFee: '100000000',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
    callbackGasLimit: '50000', // 500,000 gas
    keepersUpdateInterval: '30',
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
  },
};

const developmentChains = ['hardhat', 'localhost'];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const FRONT_END_ADDRESSES_FILE = '../client/constants/contractAddresses.json';
const FRONT_END_ABI_FILE = '../client/constants/abi.json';

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
};
