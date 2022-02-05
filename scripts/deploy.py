import yaml
import json
import os
import shutil
from brownie import accounts, IrshadToken, DappPoetsSociety
from scripts.helpful_scripts import get_account, get_contract
from web3 import Web3

KEPT_BALANCE = Web3.toWei(100, "ether")

def deploy_society_and_irshad(front_end_update = False):
    account = get_account()
    
    # Depploying Irshad Token
    irshad_token = IrshadToken.deploy({"from":account})
    
    # Deploying Dapp Poet's Society Contract
    dapp_poets_society = DappPoetsSociety.deploy(irshad_token.address, {"from":account})
    
    # making a transfer of irshad funds
    print("transferring Irshad")
    tx_initial_irshad_transfer = irshad_token.transfer(
        dapp_poets_society.address,irshad_token.totalSupply()-KEPT_BALANCE, {"from":account}
    )
    
    print("Irshad Transferred")
    tx_initial_irshad_transfer.wait(1)
    
    # set up irshad token price feed
    print("setting up PriceFeed for Irshad")
    irshad_token_price_feed = get_contract("dai_usd_price_feed")
    tx_set_irshad_price_feed = dapp_poets_society.setPriceFeedContract(irshad_token_price_feed,{"from":account})
    tx_set_irshad_price_feed.wait(1)
    print("Price feed set up")
    print("Irshad and society Deployed and ready to go")
    if front_end_update:
        update_front_end()
    return dapp_poets_society, irshad_token

def update_front_end():
    # Sending the build folder
    copy_folder_to_front_end("./build","./front_end_society/src/chain-info")
    # Sending build config file to front end in Json format
    with open("brownie-config.yaml","r") as brownie_config:
        config_dict = yaml.load(brownie_config,Loader=yaml.FullLoader)
        with open("./front_end_society/src/brownie-config.json","w") as brownie_config_json:
            json.dump(config_dict,brownie_config_json)

def copy_folder_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src,dest)

def main():
    deploy_society_and_irshad(True)