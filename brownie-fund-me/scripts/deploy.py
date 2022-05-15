from brownie import FundMe, network, config, MockV3Aggregator
from scripts.utils import get_account


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
        print(f"The active network is {network.show_active()}")
        print(f"Deploying Mocks...")
        mock_aggregator = MockV3Aggregator.deploy(
            18, 2000000000000000000, {"from": account}
        )
        price_feed_address = mock_aggregator.address
        print("Mocks Deployed")

    fund_me = FundMe.deploy(
        price_feed_address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify"),
    )
    print(f"Contract Deployed to {fund_me.address}")


def main():
    deploy_fund_me()
