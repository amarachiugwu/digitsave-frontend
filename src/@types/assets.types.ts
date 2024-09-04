import { BigNumber } from "ethers";

export interface AddAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    savingId: string;
  }

  export interface TopupAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    savingId: string;
    assetId: number;
  }
  
  export interface AssetData {
    id: string;
    assetAddress: string;
    chainLinkAggregator: string;
    isActive: boolean;
    price: string;
  }
  
  export interface FullAsset {
    name: string;
    ticker: string;
    decimal: number;
    fullName: string;
    id: string;
    assetAddress: string;
    chainLinkAggregator: string;
    isActive: boolean;
    price: string;
    balance: number;
    usdBal: number;
  }
  


    // Type for the second object
export interface AssetDetail {
    name: string;
    ticker: string;
    decimal: number;
    fullName: string;
  }


export interface Asset {
    name?: string;
    ticker?: string;
    decimal?: number;
    fullName?: string;
    contractAddrs?: string;
  }

    
export interface SavingsAsset
{
    assetId?: BigNumber;
    amountDepositedInUsd?: BigNumber;
    amount?: BigNumber;
    amountWithdrawnInUsd?: BigNumber;
}

export type CombinedAsset = SavingsAsset & Asset;

  