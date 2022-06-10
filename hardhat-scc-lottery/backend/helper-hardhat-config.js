const { ethers } = require('hardhat');

const networkConfig = {
  4: {
    name: 'rinkeby',
    subscriptionId: '6258',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
    keepersUpdateInterval: '30',
    raffleEntranceFee: ethers.utils.parseEther('0.01'), //'100000000000000000', // 0.1 ETH
    callbackGasLimit: '500000', // 500,000 gas
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
  },
  31337: {
    name: 'hardhat',
    raffleEntranceFee: ethers.utils.parseEther('0.01'),
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
    callbackGasLimit: '500000', // 500,000 gas
    keepersUpdateInterval: '30',
  },
};

const developmentChains = ['hardhat', 'localhost'];

module.exports = {
  networkConfig,
  developmentChains,
};
