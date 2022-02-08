// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DappPoetsSociety is Ownable{

    // storage
    struct Poet {
        address account;
        uint256 totalRewardEarned;
        uint256 poems;
    }

    struct Poem {
        string poem;
        address poetAddress;
        uint256 earnedRewards;
    }

    mapping (address=>Poet) public poets;
    mapping (address=>bool) public poetExists;
    Poem[] public poems;
    IERC20 public irshadTokenAddress;
    address public irshadTokenPriceFeed;

    constructor(address _irshadTokenAddress) public{
        irshadTokenAddress = IERC20(_irshadTokenAddress);
    }

    function setPriceFeedContract(address _priceFeed) public onlyOwner {
        irshadTokenPriceFeed = _priceFeed;
    }

    // register
    // createPost
    // tipPost
    // tipAuthor

    // Register a new User
    function register(address _account) public {
        Poet memory newPoet = Poet(_account, 0, 0);
        poets[_account] = newPoet;
        poetExists[_account] = true;
        issueRegisterationTokens(_account);
    }

    function issueRegisterationTokens(address _account) public {
        irshadTokenAddress.transfer(_account,100000000000000000000);
    }

    function checkIfAlreadyUser(address _account) public view returns (bool) {
        return poetExists[_account];
    }
    
    // create new post
    function createPost(string memory _poem) public {
        address author = address(msg.sender);
        Poem memory newPoem = Poem(_poem, author, 0);
        poems.push(newPoem);
        poets[author].poems = poets[author].poems + 1;    
    }

    // to tip a particular poem
    function tipPoem(uint256 _poemId, uint256 _amount) public {
        Poem memory poem = poems[_poemId];
        Poet memory poet = poets[poem.poetAddress];
        irshadTokenAddress.transferFrom(msg.sender, poet.account, _amount);
        poems[_poemId].earnedRewards = poem.earnedRewards + _amount;
        poets[poet.account].totalRewardEarned = poet.totalRewardEarned + _amount;
    }

    function tipPoet(address _author , uint256 _amount) public {
        irshadTokenAddress.transferFrom(msg.sender, _author,_amount);
        poets[_author].totalRewardEarned = poets[_author].totalRewardEarned + _amount;
    }

    function getPoetInfo(address _account) public view returns(Poet memory) {
        return poets[_account];
    }

    function getPoems() public view returns(Poem[] memory) {
        return poems;
    }

    function getAllPoemsCount() public view returns (uint256){
        return poems.length;
    }

}