// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC721, Ownable {
    struct Pet {
        uint8 damage;//0-255
        uint8 magic;
        uint256 lastMeal;
        uint256 endurance;//24 hours
    }

    uint256 private nextTokenId = 0;

    mapping( uint256 => Pet ) private _tokenDetails;

    constructor(string memory tokenName, string memory symbol) ERC721(tokenName, symbol) {
        
    }

    function mint(uint8 damage, uint8 magic, uint256 endurance) public onlyOwner {
        _tokenDetails[nextTokenId] = Pet(damage, magic, block.timestamp, endurance);
        _safeMint(msg.sender, nextTokenId);

        nextTokenId++;
    }

    function feed(uint256 tokenId) public {
        Pet storage pet = _tokenDetails[tokenId];
        require(pet.lastMeal + pet.endurance > block.timestamp, 'Pet is already dead');
        _tokenDetails[tokenId].lastMeal = block.timestamp;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        Pet storage pet = _tokenDetails[tokenId];
        require(pet.lastMeal + pet.endurance > block.timestamp, 'Pet is already dead');
    }
    
    // Note that when it's return data in web3 world, it will not under struct, it's array
    function getTokenDetails(uint256 tokenId) public view returns (uint8, uint8, uint256, uint256, address) {
        return (
            _tokenDetails[tokenId].damage,
            _tokenDetails[tokenId].magic,
            _tokenDetails[tokenId].lastMeal,
            _tokenDetails[tokenId].endurance,
            ownerOf(tokenId)
        );
    }

    function getTokenCount() public view returns(uint256) {
        return nextTokenId;
    }
}

