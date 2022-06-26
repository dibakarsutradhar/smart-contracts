import '@typechain/hardhat';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/types';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || 'https://eth-rinkeby';
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || '0xkey';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'key';
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || 'key';
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || 'key';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
      chainId: 4,
      // blockConfirmations: 6,
    },
  },
  solidity: {
    compilers: [
      { version: '0.8.7' },
      { version: '0.8.8' },
      { version: '0.8.0' },
      { version: '0.6.6' },
      { version: '0.6.0' },
    ],
  },
  gasReporter: {
    enabled: true,
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'USD',
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: 'ETH',
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
  mocha: {
    timeout: 400000, // 400 seconds
  },
};

export default config;
