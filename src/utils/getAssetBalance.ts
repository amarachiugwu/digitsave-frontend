import { getEthersProvider } from '@/ethersProvider';
import { config } from '@/wagmi';
import { ethers } from 'ethers';
import { erc20Abi } from '@/abis/erc20Abi'

const provider = getEthersProvider(config);


export async function getAssetBalance(erc20ContractAddress: string, address: string) {
    const erc20Contract = new ethers.Contract(erc20ContractAddress, erc20Abi, provider);
  try {
    // Fetch the balance
    const balance = await erc20Contract.balanceOf(address);

    // Fetch the decimals
    const decimals = await erc20Contract.decimals();

    // Format the balance based on the decimals
    const formattedBalance = ethers.utils.formatUnits(balance, decimals);

    return formattedBalance
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}

