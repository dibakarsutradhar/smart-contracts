from brownie import SimpleStorage, accounts, config


def read_contract():
    # get the latest deployed contract version
    simple_storage = SimpleStorage[-1]

    # ABI and address
    print(simple_storage.retrieve())


def main():
    read_contract()
