import { ethers } from 'ethers';
import Web3 from "web3";
import { isAddress } from 'web3-validator';
const web3 = new Web3();


export function isValidAddress(address) {
  // return ethers.utils.isAddress(address) && address !== '0x0000000000000000000000000000000000000000';
  return isAddress(address) && address !== '0x0000000000000000000000000000000000000000';

}
