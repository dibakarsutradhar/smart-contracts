const { updateAbi } = require('../utils/updateAbi');
const { updateContractAddresses } = require('../utils/updateContractAddresses');

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log('Updating Front End...!');
    await updateContractAddresses();
    await updateAbi();
  }
};

module.exports.tags = ['all', 'frontend'];
