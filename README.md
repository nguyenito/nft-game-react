# nft-game-react

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
Click [here](https://github.com/StephenGrider/ReactStarter/releases) then download the .zip file.  Extract the contents of the zip file, then open your terminal, change to the project directory, and:

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

#### 3. After that now I manage to using the same method I did in my unit test file to apply it in my application which is using react and next js.

```
> npm run dev
```

#### 4. Go to my browser and got to 'http://localhost:3000/' to see my demo for react app for create pet token

