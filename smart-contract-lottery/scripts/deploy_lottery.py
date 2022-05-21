from scripts.utils import get_account
from brownie import Lottery


def deploy_lottery():
    account = get_account()
    lottery = Lottery.deploy()


def main():
    deploy_lottery()
