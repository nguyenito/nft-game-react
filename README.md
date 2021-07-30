# nft-game-react

##### 1. When the contract first deployed
<img width="1185" alt="Screen Shot 2021-07-30 at 8 49 37 PM" src="https://user-images.githubusercontent.com/79323002/127662948-54e9c396-ef09-4d2b-8238-f7b34195d362.png">

##### 2. Create new Pet page
<img width="1185" alt="Screen Shot 2021-07-30 at 8 49 50 PM" src="https://user-images.githubusercontent.com/79323002/127663220-97804d96-bd01-4dcb-9c4a-6247d8953123.png">

##### 3. Need to sig in for every transaction on ethereum. And this fee is required to paid from you haha
<img width="1492" alt="Screen Shot 2021-07-30 at 8 50 15 PM" src="https://user-images.githubusercontent.com/79323002/127663457-73ce23b6-c641-4fa2-a200-2bda2b0dff40.png">

##### 4. After created few pets
<img width="1231" alt="Screen Shot 2021-07-30 at 9 00 41 PM" src="https://user-images.githubusercontent.com/79323002/127664305-498a6131-2c4b-4ff2-ab1f-f700b0cee6b6.png">

### Getting Started

There are two methods for getting started with this repo.

#### Familiar with Git?
Checkout this repo, install dependencies, then start the gulp process with the following:

```
> git clone https://github.com/nguyenito/nft-game-react.git
> cd nft-game-react
> npm install
> npm start
```

#### Not Familiar with Git?
Click [here](https://github.com/nguyenito/nft-game-react/archive/refs/heads/master.zip) then download the .zip file.  Extract the contents of the zip file, then open your terminal, change to the project directory, and:

```
> npm install
> npm start
```
## You must have truffle and ganache installed to work with this project. After have truffle install, run this

```
> truffle init
```
#### 1. First I use truffle to compile the contract. All the solidity code under '/contracts' folder will be compiled into folder '/build/contracts/*.json'

```
> truffle compile
```

#### 2. Now I have my compiled contract in '/build/contracts/'. Now I switch to mocha to testing my contract on local network provided by 'ganach-cli'. I write my unit test in '/test/*.js' folder

```
> npm run test
```

#### 4. After that now you're confident to work on the test network on rinkeby. Deploy it on rinkeby by using truffle migrate.
Note that the identifier 'rinkeby' is defined in 'truffle-config.js', you can deploy to another test network or main network by config the identifier inside truffle config file. One thing I need to remind you is you also required metamask to be installed in your browser and have some ether on it because every actionn on the Ethereum world also need some fee.

```
> truffle --network rinkeby
```

#### 5. Now your contract should be deployed to the rinkeby network. 
You can see the contract address on the result of console. The comiled contract is writen under '/build/contracts/Token.json'. It also conclude the address of your deployed contract too. Inside my 'ethereum/contracts/Token.js' you can find the way how I get the abi from '/build/contracts/Token.json' and the deployed contract.

#### 6. Finally now I manage to using the same method I did in my unit test file to apply it in my application which is using react and next js.
Run this command for next server to be running

```
> npm run dev
```

#### 7. Go to 'http://localhost:3000/' to see my demo for react app for create pet token.

