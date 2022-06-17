export interface networkConfigItem {
  blockConfirmations?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  rinkeby: {
    blockConfirmations: 6,
  },
  localhost: {},
  hardhat: {},
};

export const INITIAL_SUPPLY = '1000000000000000000000';
export const developmentChains = ['hardhat', 'localhost'];
