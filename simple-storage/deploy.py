from solcx import compile_standard, install_solc
import json
from web3 import Web3
import os
from dotenv import load_dotenv

load_dotenv()

with open("./SimpleStorage.sol", "r") as file:
    simple_storage_file = file.read()

# Compile Solidity

install_solc("0.6.0")
compliled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"SimpleStorage.sol": {"content": simple_storage_file}},
        "settings": {
            "outputSelection": {
                "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
            }
        },
    },
    solc_version="0.6.0",
)

with open("compiled_code.json", "w") as file:
    json.dump(compliled_sol, file)

# get bytecode
bytecode = compliled_sol["contracts"]["SimpleStorage.sol"]["SimpleStorage"]["evm"][
    "bytecode"
]["object"]

# get abi
abi = compliled_sol["contracts"]["SimpleStorage.sol"]["SimpleStorage"]["abi"]

# connection to ganache (local net)
# w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
# chain_id = 1337
# my_address = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"
# private_key = os.getenv("PRIVATE_KEY")

# connection to rinkeby mainnet
w3 = Web3(
    Web3.HTTPProvider("https://rinkeby.infura.io/v3/29ee0a1e79504d95adb395397857993e")
)
chain_id = 4
my_address = "0xb15310296b81fF9336E46a21451CB721B61515Ec"
private_key = os.getenv("RINKEBY_PRIVATE_KEY")

# Create the contract in python
SimpleStorage = w3.eth.contract(abi=abi, bytecode=bytecode)

# Get lates transaction
nonce = w3.eth.getTransactionCount(my_address)

# 1. Build a Transaction
transaction = SimpleStorage.constructor().buildTransaction(
    {
        "gasPrice": w3.eth.gas_price,
        "chainId": chain_id,
        "from": my_address,
        "nonce": nonce,
    }
)

# 2. Sign a Transaction
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)

# 3. Send signed Transaction
print("Deploying Contract...")
tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
print("Deployed!")

# Block transaction confirmation
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

# Working with the Contract
# Contract Address
# Contract ABI
simple_storage = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

# Initial value of favourite number
print(simple_storage.functions.retrieve().call())
print("Updating Contract...")

# Transact function call
store_transaction = simple_storage.functions.store(15).buildTransaction(
    {
        "gasPrice": w3.eth.gas_price,
        "chainId": chain_id,
        "from": my_address,
        "nonce": nonce + 1,
    }
)

signed_store_tx = w3.eth.account.sign_transaction(
    store_transaction, private_key=private_key
)

send_store_tx = w3.eth.send_raw_transaction(signed_store_tx.rawTransaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(send_store_tx)

print("Updated!")
print(simple_storage.functions.retrieve().call())
