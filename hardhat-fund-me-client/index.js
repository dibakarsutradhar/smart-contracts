import { ethers } from './ethers-5.6.esm.min.js';
import { abi, contractAddress } from './constants.js';

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton');
const balanceButton = document.getElementById('balanceButton');
const withdrawButton = document.getElementById('withdrawButton');

console.log(ethers);

const connect = async () => {
	if (typeof window.ethereum !== 'undefined') {
		try {
			await ethereum.request({ method: 'eth_requestAccounts' });
		} catch (error) {
			console.log(error);
		}
		connectButton.innerHTML = 'Wallet Connected';
		const accounts = await ethereum.request({ method: 'eth_accounts' });
		console.log(accounts);
	} else {
		connectButton.innerHTML = 'Please install Metamask wallet to continue';
	}
};

connectButton.onclick = connect;

const getBalance = async () => {
	if (typeof window.ethereum !== 'undefined') {
		const provdier = new ethers.providers.Web3Provider(window.ethereum);
		const balance = await provdier.getBalance(contractAddress);
		console.log(ethers.utils.formatEther(balance));
	}
};

balanceButton.onclick = getBalance;

// fund function
const fund = async () => {
	const ethAmount = document.getElementById('ethAmount').value;
	console.log(`Funding with ${ethAmount}...`);
	if (typeof window.ethereum !== 'undefined') {
		// provdier / connection to the blockchain
		const provdier = new ethers.providers.Web3Provider(window.ethereum);
		// signer / wallet / someone with some gas
		const signer = provdier.getSigner();
		// contract that we are interacting with
		// ^ ABI & address
		const contract = new ethers.Contract(contractAddress, abi, signer);
		try {
			const transactionResponse = await contract.fund({
				value: ethers.utils.parseEther(ethAmount),
			});
			await listenForTransactionMine(transactionResponse, provdier);
			console.log('done');
		} catch (error) {
			console.log(error);
		}
	}
};

const listenForTransactionMine = (transactionResponse, provider) => {
	console.log(`Mining ${transactionResponse.hash}...`);
	return new Promise((resolve, reject) => {
		provider.once(transactionResponse.hash, (transactionReceipt) => {
			console.log(
				`Completed with ${transactionReceipt.confirmations} confirmations`
			);
			resolve();
		});
	});
};

fundButton.onclick = fund;

const withdraw = async () => {
	if (typeof window.ethereum !== 'undefined') {
		console.log('Withdrawing...');
		const provdier = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provdier.getSigner();
		const contract = new ethers.Contract(contractAddress, abi, signer);

		try {
			const transactionResponse = await contract.withdraw();
			await listenForTransactionMine(transactionResponse, provdier);
			console.log('fund withdraw complete');
		} catch (error) {
			console.log(error);
		}
	}
};

withdrawButton.onclick = withdraw;
