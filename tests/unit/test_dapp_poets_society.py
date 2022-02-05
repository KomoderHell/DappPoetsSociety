from brownie import network
from scripts.helpful_scripts import get_contract, get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS, INITIAL_PRICE_FEED_VALUE
import pytest
from scripts.deploy import deploy_society_and_irshad
from web3 import Web3

# to test
# 1. setPriceFeedContract
# 2. Login
#      a. Check if user already exists
#      b. Register
# 3. CreatePost
# 4. tipPoem
# 5. tipPoet
# 6. getPoetInfo

def test_set_price_feed_contract():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    dapp_poets_society, irshad_token = deploy_society_and_irshad()
    # Act
    price_feed_address = get_contract("dai_usd_price_feed")
    dapp_poets_society.setPriceFeedContract(price_feed_address, {"from":account})
    # Assert
    assert dapp_poets_society.irshadTokenPriceFeed() == price_feed_address

def test_register():
    # Arrange
    name = "Sujay"
    account = get_account()
    dapp_poets_society, irshad_token = deploy_society_and_irshad()
    # Act
    poet = dapp_poets_society.register(account, name, {"from":account})
    # Assert
    assert dapp_poets_society.poets(account)[0] == name

def test_create_post():
    # Arrange
    name = "Sujay"
    poem_string = "this is the first poem"
    timestamp = 20
    account = get_account()
    dapp_poets_society, irshad_token = deploy_society_and_irshad()
    poet = dapp_poets_society.register(account, name, {"from":account})
    # Act
    dapp_poets_society.createPost(poem_string, timestamp, {"from":account})
    poem = dapp_poets_society.poems(0)
    # Assert
    assert poem[0] == poem_string
    
def test_tip_poem():
    # Arrange
    name = "Sujay"
    poem_string = "this is the first poem"
    timestamp = 20
    account = get_account()
    non_author_name = "Suyash"
    non_author_account = get_account(1)
    dapp_poets_society, irshad_token = deploy_society_and_irshad()
    dapp_poets_society.register(account, name, {"from":account})
    dapp_poets_society.register(non_author_account, non_author_name, {"from":non_author_account})
    dapp_poets_society.createPost(poem_string, timestamp, {"from":account})
    tip_amount = Web3.toWei(1,"ether")
    # Act
    irshad_token.approve(dapp_poets_society.address, tip_amount, {"from":non_author_account})
    dapp_poets_society.tipPoem(0,tip_amount,{"from":non_author_account})
    poem = dapp_poets_society.poems(0)
    # Assert
    assert poem[3] == tip_amount

def test_tip_poet():
    # Arrange
    name = "Sujay"
    account = get_account()
    non_author_name = "Suyash"
    non_author_account = get_account(1)
    dapp_poets_society, irshad_token = deploy_society_and_irshad()
    dapp_poets_society.register(account, name, {"from":account})
    dapp_poets_society.register(non_author_account, non_author_name, {"from":non_author_account})
    tip_amount = Web3.toWei(1,"ether")
    # Act
    irshad_token.approve(dapp_poets_society.address,tip_amount,{"from":non_author_account})
    dapp_poets_society.tipPoet(account,tip_amount,{"from":non_author_account})
    poet = dapp_poets_society.poets(account)
    # Assert
    assert poet[2] == tip_amount
