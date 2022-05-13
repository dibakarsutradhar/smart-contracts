from brownie import accounts, config, SimpleStorage


def deploy_simple_storage():
    # Local ganache brownie account
    account = accounts[0]

    # Testnet/Mainnet account with CLI
    # account = accounts.load("rinkeby-testnet-account2")

    # Account from ENV
    # account = accounts.add(config["wallets"]["from_key"])
    # print(account)

    # Deploy Contract to Chain
    simple_storage = SimpleStorage.deploy({"from": account})
    print(simple_storage)

    stored_value = simple_storage.retrieve()
    print(stored_value)

    transaction = simple_storage.store(15, {"from": account})
    transaction.wait(1)

    updated_stored_value = simple_storage.retrieve()
    print(updated_stored_value)


def main():
    deploy_simple_storage()
