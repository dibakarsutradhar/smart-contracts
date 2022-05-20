# current ETH value $1,936.21 (10:40PM GMT8+ 20 MAY 2022)
# 50 / 1,936.21 = 0.025 ETH
# expecting wei = 25,000,000,000,000,000

from brownie import Lottery, accounts, config, network
from web3 import Web3


def test_get_entrance_Fee():
    account = accounts[0]
    lottery = Lottery.deploy(
        config["networks"][network.show_active()]["eth_usd_price_feed"],
        {"from": account},
    )
    assert lottery.getEntranceFee() > Web3.toWei(0.025, "ether")
    assert lottery.getEntranceFee() < Web3.toWei(0.030, "ether")
