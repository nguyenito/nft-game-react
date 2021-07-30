const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { promisify } = require('util');
const sleep = promisify(setTimeout);

const CompiledContractJson = require('../build/contracts/Token.json');
const TOKEN_NAME = 'CNT Coin';
const TOKEN_SYMBOL = 'CNTC';

let accounts;
let token;
let accountDeploy;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  accountDeploy = accounts[0];

  token = await new web3.eth.Contract(CompiledContractJson.abi)
    .deploy({
      data: CompiledContractJson.bytecode,
      arguments: [TOKEN_NAME, TOKEN_SYMBOL],
    })
    .send({ from: accountDeploy, gas: '5000000' });
});

describe('Pet token', () => {
  it('deploys a pet token', async () => {
    assert.ok(token.options.address);

    const tokenName = await token.methods.name().call();
    const tokenSymbol = await token.methods.symbol().call();
    assert(tokenName == TOKEN_NAME);
    assert(tokenSymbol == TOKEN_SYMBOL);
  });

  it('can mint a new pet token', async () => {
    let petId = 0;
    await token.methods.mint('100', '50', '1000').send({
      from: accountDeploy,
      gas: '1000000',
    });

    const petDetail = await token.methods.getTokenDetails(petId).call();

    const petDamage = petDetail[0];
    const petMagic = petDetail[1];
    const petLastMeal = petDetail[2];
    const petEndurance = petDetail[3];
    const petOwner = petDetail[4];

    assert(petDamage == '100');
    assert(petMagic == '50');
    assert(petEndurance == '1000');
    assert(petOwner == accountDeploy);
  });

  it('can mint multiple token', async () => {
    //.1 First pet token
    await token.methods.mint('100', '50', '1000').send({
      from: accountDeploy,
      gas: '1000000',
    });
    let petId = 0;
    let petDetail = await token.methods.getTokenDetails(petId).call();

    let petDamage = petDetail[0];
    let petMagic = petDetail[1];
    let petLastMeal = petDetail[2];
    let petEndurance = petDetail[3];
    let petOwner = petDetail[4];

    assert(petDamage == '100');
    assert(petMagic == '50');
    assert(petEndurance == '1000');
    assert(petOwner == accountDeploy);

    //2. Second pet token
    await token.methods.mint('200', '250', '2000').send({
      from: accountDeploy,
      gas: '1000000',
    });
    petId++;

    petDetail = await token.methods.getTokenDetails(petId).call();

    petDamage = petDetail[0];
    petMagic = petDetail[1];
    petLastMeal = petDetail[2];
    petEndurance = petDetail[3];
    petOwner = petDetail[4];

    assert(petDamage == '200');
    assert(petMagic == '250');
    assert(petEndurance == '2000');
    assert(petOwner == accountDeploy);

    const petTokenCount = await token.methods.getTokenCount().call();
    assert(petTokenCount == 2);
  });

  it('only owner can mint a pet token', async () => {
    let mintSuccess = false;
    try {
      await token.methods.mint('100', '50', '1000').send({
        from: accounts[1],
        gas: '1000000',
      });
      mintSuccess = true;
    } catch (err) {
      mintSuccess = false;
    }
    assert(mintSuccess == false);
  });

  it('can feed pet', async () => {
    //1. mint new pet token
    let petId = 0;
    const endurance = '10000';
    await token.methods.mint('100', '50', endurance).send({
      from: accountDeploy,
      gas: '1000000',
    });

    const petDetail1 = await token.methods.getTokenDetails(petId).call();
    const petLastMeal1 = parseInt(petDetail1[2]);

    //2. Feed it after 1000ms because last meal is counting in second
    await sleep(1000);
    await token.methods.feed(petId).send({ from: accountDeploy });

    const petDetail2 = await token.methods.getTokenDetails(petId).call();
    const petLastMeal2 = parseInt(petDetail2[2]);

    assert(petLastMeal2 > petLastMeal1);
  });

  it('pet will deadth after endurance time (if no body feed it)', async () => {
    //1. mint new pet token
    let petId = 0;
    const endurance = '1';
    await token.methods.mint('100', '50', endurance).send({
      from: accountDeploy,
      gas: '1000000',
    });

    let petDetail = await token.methods.getTokenDetails(petId).call();

    const petLastMeal1 = petDetail[2];

    //2. Feed it after 1200ms (by right now pet should death already because endurance is only 1 second)
    //==> we should not able to feed it now
    await sleep(1200);
    let successToFeed = false;
    try {
      await token.methods.feed(petId).send({ from: accountDeploy });
      successToFeed = true;
    } catch (err) {
      successToFeed = false;
    }
    assert(successToFeed == false);
  });
});
