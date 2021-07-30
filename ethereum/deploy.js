const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'point remember butter spatial fall flat volcano gentle identify poet snack used',
  'https://rinkeby.infura.io/v3/51aa937e43f94cd5b4db01a722602bd8'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: 5000000 });

  console.log('Contract deployed to ', result.options.address);
};
deploy();
