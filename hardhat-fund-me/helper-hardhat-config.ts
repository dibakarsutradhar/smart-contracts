export interface networkConfigTypes {
  ethUsdPriceFeed?: string;
  blockConfirmations?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigTypes;
}

export const networkConfig: networkConfigInfo = {
  localhost: {},
  hardhat: {},
  rinkeby: {
    ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
    blockConfirmations: 6,
  },
};

export const developmentChains = ['hardhat', 'localhost'];
export const DECIMALS = '8';
export const INITIAL_ANSWER = '2000000000000000000000';
