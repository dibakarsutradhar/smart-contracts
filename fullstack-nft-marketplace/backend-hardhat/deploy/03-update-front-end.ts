import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import updateAbi from '../utils/updateAbi';
import updateContractAddresses from '../utils/updateContractAddresses';

const updateFrontEnd: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  if (process.env.UPDATE_FRONT_END) {
    console.log('Updating Front End...!');
    await updateContractAddresses();
    await updateAbi();
    console.log('Front End Written');
  }
};

export default updateFrontEnd;
updateFrontEnd.tags = ['all', 'frontend'];
