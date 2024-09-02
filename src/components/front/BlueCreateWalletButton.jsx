import React, { useCallback } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { CoinbaseWalletLogo } from './CoinbaseWalletLogo';


export function BlueCreateWalletButton({label, coinbaseLogo = false, styles=""}) {
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === 'coinbaseWalletSDK'
    );
    if (coinbaseWalletConnector) {
      connect({
        connector: coinbaseWalletConnector,
      });
    }
  }, [connectors, connect]);


  return (
    <>
      {!isConnected && (
        <button className={`${styles ? styles : 'flex gap-2 items-center font-semibold  justify-center rounded-lg bg-primary-0 text-neutral-1 w-44 py-[7px] px-2'}`} onClick={createWallet}>
          {coinbaseLogo && <CoinbaseWalletLogo />}
          <span>{label}</span>
        </button>
      )}
      
    </>
  );
}
