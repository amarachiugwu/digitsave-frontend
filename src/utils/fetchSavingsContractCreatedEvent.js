import { FactoryAbi } from '@/abis/FactoryContractAbi'
import { useContractAddresses } from "@/constants/index";
import { config } from '@/wagmi'
import { getEthersProvider } from '@/ethersProvider'
import { ethers } from 'ethers';
import Web3 from "web3";


 

export async function FetchSavingsContractCreatedEvent(userAddress) {
    const provider = getEthersProvider(config)
    const web3 = new Web3();

    const { factoryContractAddrs } = useContractAddresses();

    
    const contract = new ethers.Contract(factoryContractAddrs, FactoryAbi, provider);

    // Filter for the event with the specified user address
    const filter = contract.filters.SavingsContractCreated(userAddress);

    try {
        // Query for the event
        const events = await contract.queryFilter(filter);

        if (events.length === 0) {
        return null; // No event found for this user
        }

        return events[0]; // Return the first (and only) event
    } catch (error) {
        console.error('Error fetching event:', error);
        return null;
    }
}
