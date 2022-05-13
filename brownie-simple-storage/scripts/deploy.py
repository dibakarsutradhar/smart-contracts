from brownie import accounts, config


def deploy_simple_storage():
    # Local ganache brownie account
    account = accounts[0]

    # Testnet/Mainnet account
    # account = accounts.load("rinkeby-testnet-account2")

    # Account from ENV
    # account = accounts.add(config["wallets"]["from_key"])
    # print(account)


def main():
    deploy_simple_storage()
