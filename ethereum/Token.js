import web3 from './web3';
import CompiledContractJson from '../build/contracts/Token.json';

// const CONTRACT_ADDRESS = '0xddD3Cd76b9360E02A4329dcF95Fa9fa421dfA7A1';
let contractAddress = '0xb9082Bff67bd8c3D31a58457C32aA5a66209FfC4';
const RINKEBY_NETWORK_ID = '4';

//Get contract adress from deployed json files(compiled and export by truffle)
contractAddress = CompiledContractJson.networks[RINKEBY_NETWORK_ID].address;

const tokenInstance = new web3.eth.Contract(
  CompiledContractJson.abi,
  contractAddress
);
export default tokenInstance;
