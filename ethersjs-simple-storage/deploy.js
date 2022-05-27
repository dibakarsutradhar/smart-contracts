const ethers = require('ethers');
const fs = require('fs');

async function main() {
	// http://127.0.0.1:8545 - ganache rpc
	const provider = new ethers.providers.JsonRpcProvider(
		'http://127.0.0.1:8545'
	);

	const wallet = new ethers.Wallet(
		'1e3813549adccde48e80ef9bdb7f569a4161eb6e240a5eacfee378e7c33bd8dd', // ganache private key -- will be removed to env
		provider
	);

	const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8');
	const binary = fs.readFileSync(
		'./SimpleStorage_sol_SimpleStorage.bin',
		'utf8'
	);

	const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

	console.log('Deploying, please wait...');
	const contract = await contractFactory.deploy();
	console.log(contract);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
