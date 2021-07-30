const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

console.log('Remove current build...');
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

console.log('Compiling your contracts...');
console.log('===========================');

const contractFolder = path.resolve(__dirname, 'contracts');
const contractFiles = fs.readdirSync(contractFolder);

const contractFilesPath = contractFiles.map((fileName) => {
  const filePath = path.resolve(contractFolder, fileName);
  return filePath;
});

contractFilesPath.forEach(async (filePath) => {
  console.log('Compiling ', filePath);

  //This compiling way worked and tested on solc@0.8.4
  const source = fs.readFileSync(filePath, 'utf8');
  let input = {
    language: 'Solidity',
    sources: {
      'test.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  console.log(output);
  console.log('Compiled successfully');

  // `output` here contains the JSON output as specified in the documentation
  for (var contractName in output.contracts['test.sol']) {
    console.log(
      contractName +
        ': ' +
        output.contracts['test.sol'][contractName].evm.bytecode.object
    );
  }
  // for (let contract in output) {
  //   console.log(path.resolve(buildPath, contract.replace(':', '') + '.json'));
  //   fs.outputJsonSync(
  //     path.resolve(buildPath, contract.replace(':', '') + '.json'),
  //     output[contract]
  //   );
  // }
});
