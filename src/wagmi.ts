import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {coinbaseWallet} from '@rainbow-me/rainbowkit/wallets';


const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [coinbaseWallet],
    },
  ],
  {
    appName: 'DigitSave',
    projectId: '',
  }
);


export const config = createConfig({
  chains: process.env.NODE_ENV === 'development' ? 
  [baseSepolia] : 
  process.env.NODE_ENV === 'production' ? [baseSepolia] : [base, baseSepolia],
  

  
  connectors,

  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
