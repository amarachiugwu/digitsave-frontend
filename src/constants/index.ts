import { Asset } from "@/@types/assets.types";

export const factoryContractAddrs = '0xc6Bb6bD945Af880fab19B5fbaC0D8e42a8942E12'
export const storageContractAddrs = '0xFD0D395CA4E8b22f657F55e635F4D27D987BeFC0'
export const digitsafeAcctContractAddrs = '0x00C8F042163F224d360D38875f81BD46beab6284'


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
    }
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
    ]
}