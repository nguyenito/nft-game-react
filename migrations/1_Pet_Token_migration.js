const Token = artifacts.require('Token');

module.exports = function (deployer) {
  deployer.deploy(Token, 'NFT Pet Game', 'CNTC');
};
