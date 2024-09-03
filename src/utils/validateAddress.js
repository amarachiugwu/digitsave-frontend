import { ethers } from 'ethers';

export function isValidAddress(address) {
  return ethers.utils.isAddress(address) && address !== '0x0000000000000000000000000000000000000000';
}
