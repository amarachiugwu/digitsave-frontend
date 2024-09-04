import { Asset } from "@/@types/assets.types";
import { useChainId } from "wagmi";

type Address = `0x${string}`;

// Define the return type of the hook
interface ContractAddresses {
    factoryContractAddrs: Address;
    storageContractAddrs: Address;
  }

export const useContractAddresses = (): ContractAddresses => {
    const chainId = useChainId();
  
    // Determine factory and storage contract addresses based on chain ID
    const factoryContractAddrs: Address =
      chainId === 84532
        ? "0xc6Bb6bD945Af880fab19B5fbaC0D8e42a8942E12"
        : chainId === 4202
        ? "0x588e75Ddf12976afEb95aBE4500924bD01dd4727"
        : "0x588e75Ddf12976afEb95aBE4500924bD01dd4727";
  
    const storageContractAddrs: Address =
      chainId === 84532
        ? "0xFD0D395CA4E8b22f657F55e635F4D27D987BeFC0"
        : chainId === 4202
        ? "0xE05d5540D2ED13D81C10D783a157F740226C2a93"
        : "0xE05d5540D2ED13D81C10D783a157F740226C2a93";
  
    return { factoryContractAddrs, storageContractAddrs };
  };


export interface AssetsArray {
    [key: number]: Asset[];
}

export const assetsDetails = {
    // baseSepolia
    84532:{
        "0xf6994372B14e886d2621619be33E67a1Ef19265c": {
            name: "USDT",
            ticker: "/images/tickers/usdt.png",
            decimal: 18,
            fullName : "Tether",
        },
        "0x3fa08A4F1D647E105514AFd65510C3CB0837397c": {
            name: "BTC",
            ticker: "/images/tickers/bitcoin.png",
            decimal: 18,
            fullName : "Bitcoin",
        },
        "0x64E81a223979911AeDfF3AF96DBDa8aC7355dead": {
            name: "ETH",
            ticker: "/images/tickers/ethereum.png",
            decimal: 18,
            fullName : "Ethereum",
        },
        "0x882066bB344b59b3b072a7F17caE7582FA4Bf660": {
            name: "LINK",
            ticker: "/images/tickers/link.png",
            decimal: 18,
            fullName : "Link",
        },
        "0xc6ceA2518610e6C0D9bF199F7B4692408649d10E": {
            name: "USDC",
            ticker: "/images/tickers/usdc.png",
            decimal: 18,
            fullName : "USD Coin",
        },
    },
     // liskSepolia
     4202:{
        "0xb47Eda1D52C6c09dCa6F83Acd7E3eCA576f000dC": {
            name: "USDT",
            ticker: "/images/tickers/usdt.png",
            decimal: 18,
            fullName : "Tether",
        },
        "0x94FA6257c3B182D71f88B85294B5C771451B7a69": {
            name: "BTC",
            ticker: "/images/tickers/bitcoin.png",
            decimal: 18,
            fullName : "Bitcoin",
        },
        "0x870954612eb55232423760593eE3A1d283aC7B93": {
            name: "ETH",
            ticker: "/images/tickers/ethereum.png",
            decimal: 18,
            fullName : "Ethereum",
        },
        "0x98F3bc937aB52d5B54BF4eBD7BaB8746eC14A159": {
            name: "LINK",
            ticker: "/images/tickers/link.png",
            decimal: 18,
            fullName : "Link",
        },
        "0x46Be9CcF941a8dEb257d7F29c72e06871139Fc7e": {
            name: "USDC",
            ticker: "/images/tickers/usdc.png",
            decimal: 18,
            fullName : "USD Coin",
        },
    },
}

export const assetsArray : AssetsArray = {
    84532: [
        {
            name: "USDT",
            ticker: "/images/tickers/usdt.png",
            decimal: 18,
            fullName : "Tether",
            contractAddrs: '0xf6994372B14e886d2621619be33E67a1Ef19265c'
        },
       {
            name: "BTC",
            ticker: "/images/tickers/bitcoin.png",
            decimal: 18,
            fullName : "Bitcoin",
            contractAddrs: '0x3fa08A4F1D647E105514AFd65510C3CB0837397c'
        },
       {
            name: "ETH",
            ticker: "/images/tickers/ethereum.png",
            decimal: 18,
            fullName : "Ethereum",
            contractAddrs: '0x64E81a223979911AeDfF3AF96DBDa8aC7355dead'
        },
       {
            name: "LINK",
            ticker: "/images/tickers/link.png",
            decimal: 18,
            fullName : "Link",
            contractAddrs: '0x882066bB344b59b3b072a7F17caE7582FA4Bf660'
        },
       {
            name: "USDC",
            ticker: "/images/tickers/usdc.png",
            decimal: 18,
            fullName : "USD Coin",
            contractAddrs: '0xc6ceA2518610e6C0D9bF199F7B4692408649d10E'
        },
    ],
    // liskSepolia
    4202: [
        {
            name: "USDT",
            ticker: "/images/tickers/usdt.png",
            decimal: 18,
            fullName : "Tether",
            contractAddrs: '0xb47Eda1D52C6c09dCa6F83Acd7E3eCA576f000dC'
        },
       {
            name: "BTC",
            ticker: "/images/tickers/bitcoin.png",
            decimal: 18,
            fullName : "Bitcoin",
            contractAddrs: '0x94FA6257c3B182D71f88B85294B5C771451B7a69'
        },
       {
            name: "ETH",
            ticker: "/images/tickers/ethereum.png",
            decimal: 18,
            fullName : "Ethereum",
            contractAddrs: '0x870954612eb55232423760593eE3A1d283aC7B93'
        },
       {
            name: "LINK",
            ticker: "/images/tickers/link.png",
            decimal: 18,
            fullName : "Link",
            contractAddrs: '0x98F3bc937aB52d5B54BF4eBD7BaB8746eC14A159'
        },
       {
            name: "USDC",
            ticker: "/images/tickers/usdc.png",
            decimal: 18,
            fullName : "USD Coin",
            contractAddrs: '0x46Be9CcF941a8dEb257d7F29c72e06871139Fc7e'
        },
    ],

}