const { updateContractAddresses } = require('../utils/updateContractAddresses');

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log('Updating Front End...!');
    await updateContractAddresses();
  }
};

module.exports.tags = ['all', 'frontend'];
