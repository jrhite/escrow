import Escrow from './artifacts/Escrow';
import {ethers} from 'ethers';

const provider = new ethers.providers.Web3Provider(web3.currentProvider);

async function deploy(arbiter, beneficiary, value) {
  await ethereum.enable();
  const signer = provider.getSigner();
  const factory = new ethers.ContractFactory(Escrow.abi, Escrow.bytecode, signer);
  return factory.deploy(arbiter, beneficiary, { value });
}

module.exports = deploy;
