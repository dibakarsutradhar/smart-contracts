from brownie import FundMe, network, config, MockV3Aggregator
from scripts.utils import get_account, deploy_mocks


def deploy_fund_me():
    account = get_account()

    # pass the pricefeed address to our fundme contract
    # if we are on a persistent network like rinkeby, use the associate address
    # otherwise, deploy mocks
    if network.show_active() != "development":
        price_feed_address = config["networks"][network.show_active()][
            "eth_usd_price_feed"
        ]
    else:
        deploy_mocks()
        price_feed_address = MockV3Aggregator[-1].address

    fund_me = FundMe.deploy(
        price_feed_address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify"),
    )
    print(f"Contract Deployed to {fund_me.address}")


def main():
    deploy_fund_me()
