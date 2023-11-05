// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";

contract PopularityBattle is LSP8IdentifiableDigitalAsset {
    struct Battle {
        uint256 postId1;
        uint256 postId2;
        uint256 endTimestamp;
        uint256 votesPost1;
        uint256 votesPost2;
    }

    mapping(uint256 => Battle) public battles;
    uint256 public battleCounter = 0;
    address public admin;
    
    // Whitelisting variables and mapping
    bool public whitelistEnabled = true;
    mapping(address => bool) public whitelist;

    // Mapping to track who has voted for a given battle
    mapping(uint256 => mapping(address => bool)) public voters;

    constructor(
        string memory _name,
        string memory _symbol,
        address _newOwner
    ) LSP8IdentifiableDigitalAsset(_name, _symbol, _newOwner) {
        admin = _newOwner;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyWhitelisted() {
        require(!whitelistEnabled || whitelist[msg.sender], "Not whitelisted");
        _;
    }

    function toggleWhitelist() public onlyAdmin {
        whitelistEnabled = !whitelistEnabled;
    }

    function addWhitelist(address[] memory users) public onlyAdmin {
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[users[i]] = true;
        }
    }

    function removeWhitelist(address[] memory users) public onlyAdmin {
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[users[i]] = false;
        }
    }

    function initiateBattle(uint256 _postId1, uint256 _postId2, uint256 _hoursDuration) public onlyAdmin {
        battleCounter++;
        battles[battleCounter] = Battle({
            postId1: _postId1,
            postId2: _postId2,
            endTimestamp: block.timestamp + _hoursDuration * 1 hours,
            votesPost1: 0,
            votesPost2: 0
        });

        // Mint a new NFT for the battle with initial metadata
        bytes memory initialData = encodeBattleMetadata(_postId1, _postId2, "Battle Started");
        _mintWithTokenURI(admin, battleCounter, initialData);
    }

    function vote(uint256 _battleId, uint256 _postId) public onlyWhitelisted {
        require(battles[_battleId].endTimestamp > block.timestamp, "Battle ended");
        require(!voters[_battleId][msg.sender], "Already voted for this battle");

        if (_postId == battles[_battleId].postId1) {
            battles[_battleId].votesPost1++;
        } else if (_postId == battles[_battleId].postId2) {
            battles[_battleId].votesPost2++;
        } else {
            revert("Invalid post ID");
        }

        voters[_battleId][msg.sender] = true;
        
        bytes memory updatedData = encodeBattleMetadata(battles[_battleId].postId1, battles[_battleId].postId2, "Ongoing");
        _setData(battleCounter, updatedData);
    }

    function finalizeBattle(uint256 _battleId) public onlyAdmin {
        require(battles[_battleId].endTimestamp <= block.timestamp, "Battle still ongoing");

        bytes memory finalData;
        if (battles[_battleId].votesPost1 > battles[_battleId].votesPost2) {
            finalData = encodeBattleMetadata(battles[_battleId].postId1, battles[_battleId].postId2, "Post 1 Wins");
        } else {
            finalData = encodeBattleMetadata(battles[_battleId].postId1, battles[_battleId].postId2, "Post 2 Wins");
        }

        _setData(battleCounter, finalData);
    }

    function encodeBattleMetadata(uint256 _postId1, uint256 _postId2, string memory _status) public pure returns (bytes memory) {
        return abi.encodePacked(_postId1, _postId2, _status);
    }
}


