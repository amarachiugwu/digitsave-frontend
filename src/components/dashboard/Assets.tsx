"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useReadContract, useAccount, useChainId } from "wagmi";
import { StorageContractAbi } from "@/abis/StorageContractAbi";
import { assetsDetails } from "@/constants";
import { useContractAddresses } from "@/constants/index";
import { getEthersProvider } from "@/ethersProvider";
import { config } from "@/wagmi";
import { ethers } from "ethers";
import { NumericFormat } from "react-number-format";
import AssetsLoader from "./Loaders/AssetsLoader";

// Define the type for an asset object
interface Asset {
  id: string;
  assetAddress: string;
  chainLinkAggregator: string;
  isActive: boolean;
  price: string;
}

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextAssetId, setNextAssetId] = useState<number | null>(null);

  const provider = getEthersProvider(config);
  const { storageContractAddrs } = useContractAddresses();
  const chainId = useChainId();
  const { isConnected } = useAccount();

  const {
    data: nextAssetIdData,
    isLoading: isLoadingAssetId,
    error: errorAssetId,
  } = useReadContract({
    abi: StorageContractAbi,
    address: storageContractAddrs,
    functionName: "assetId",
    args: [],
  });

  // Set next asset ID when data is available
  useEffect(() => {
    if (nextAssetIdData) {
      setNextAssetId(parseInt(nextAssetIdData.toString()));
    }
  }, [nextAssetIdData]);

  // Fetch all assets when the next asset ID is set
  useEffect(() => {
    if (nextAssetId !== null) {
      const fetchAllAssets = async () => {
        try {
          const contract = new ethers.Contract(
            storageContractAddrs,
            StorageContractAbi,
            provider
          );

          const assetPromises = Array.from(
            { length: nextAssetId - 1 },
            (_, i) =>
              Promise.all([
                contract.assets(i + 1),
                contract.getAssetDetail(i + 1),
              ])
          );

          const assetsData = await Promise.all(assetPromises);
          const formattedAssets = assetsData.map(
            ([assetData, assetDetailData]) => ({
              id: assetData.id.toString(),
              assetAddress: assetData.asset,
              chainLinkAggregator: assetData.chainLinkAggregator,
              isActive: assetData.isActive,
              price: assetDetailData.price.toString(),
            })
          );

          setAssets(formattedAssets);
        } catch (error) {
          console.error("Error fetching assets:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAllAssets();
    }
  }, [nextAssetId, chainId, provider, storageContractAddrs]);

  if (isLoadingAssetId || loading) return <AssetsLoader />;

  // Error rendering if asset ID retrieval fails
  if (errorAssetId) return <div>Error: {errorAssetId.message}</div>;

  const renderAsset = (asset: Asset, index: number) => {
    if (!asset.isActive || !assetsDetails || !chainId) return null;
    //@ts-ignore
    const assetDetail = assetsDetails[chainId]?.[asset.assetAddress];
    if (!assetDetail) return null;

    const formattedPrice = Number(asset.price) / 10 ** assetDetail.decimal;

    return (
      <div key={index} className="w-full flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Image
            width={48}
            height={48}
            src={assetDetail.ticker}
            alt={assetDetail.name}
            className="border border-white rounded-full"
          />
          <div className="flex flex-col gap-1">
            <p>{assetDetail.name}</p>
          </div>
        </div>
        <p>
          {"$ "}
          <NumericFormat
            value={formattedPrice}
            thousandSeparator
            displayType="text"
            decimalScale={2}
            fixedDecimalScale={formattedPrice % 1 === 0}
          />
        </p>
      </div>
    );
  };

  return (
    <div className="w-2/5 flex flex-col gap-4">
      <p className="font-semibold">Supported assets</p>
      <div className="w-full flex flex-col rounded-lg gap-4 bg-[#2B2B2B80] p-6">
        {assets.map(renderAsset)}
      </div>
    </div>
  );
};

export default Assets;
