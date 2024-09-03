"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BaseError, useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { StorageContractAbi } from "@/abis/StorageContractAbi";
import { assetsDetails, storageContractAddrs } from "@/constants";
import { getEthersProvider } from "@/ethersProvider";
import { config } from "@/wagmi";
import { ethers } from "ethers";
import { NumericFormat } from "react-number-format";
import AssetsLoader from "./Loaders/AssetsLoader";

export default function Assets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextAssetId, setNextAssetId] = useState<number | null>(null);
  const provider = getEthersProvider(config);

  const { chainId, isConnected } = useAccount();
  // Fetch nextAssetId using useReadContract
  const {
    data: nextAssetIdData,
    error: errorAssetId,
    isLoading: isLoadingAssetId,
  } = useReadContract({
    abi: StorageContractAbi,
    address: storageContractAddrs,
    functionName: "assetId",
    args: [],
  });

  // console.log(assets);
  useEffect(() => {
    if (nextAssetIdData) {
      setNextAssetId(parseInt(nextAssetIdData.toString()));
    }
  }, [nextAssetIdData]);

  useEffect(() => {
    if (nextAssetId !== null) {
      const fetchAllAssets = async () => {
        try {
          const assetPromises = [];
          for (let i = 1; i < nextAssetId; i++) {
            // Create a new promise for each asset fetch
            assetPromises.push(
              (async () => {
                const contract = new ethers.Contract(
                  storageContractAddrs,
                  StorageContractAbi,
                  provider
                );

                const [assetData, assetDetailData] = await Promise.all([
                  contract.assets(i),
                  contract.getAssetDetail(i),
                ]);

                return {
                  id: assetData.id.toString(),
                  assetAddress: assetData.asset,
                  chainLinkAggregator: assetData.chainLinkAggregator,
                  isActive: assetData.isActive,
                  price: assetDetailData.price.toString(),
                };
              })()
            );
          }

          // Wait for all promises to resolve
          const assetsData = await Promise.all(assetPromises);
          setAssets(assetsData);
        } catch (error) {
          console.error("Error fetching assets:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAllAssets();
    }
  }, [nextAssetId, chainId]);

  if (isLoadingAssetId || loading) return <AssetsLoader />;
  // if (errorAssetId) return <div>Error: {errorAssetId.message}</div>;

  // console.log(nextAssetId);

  return !isConnected && chainId ? (
    <div className="w-2/5 flex flex-col gap-4">
      <p className="font-semibold">Supported assets</p>
      {/* {errorAssetId && (
        <div>
          Error:{" "}
          {(errorAssetId as BaseError).shortMessage || errorAssetId.message}
        </div>
      )} */}
      <div className="w-full flex flex-col rounded-lg gap-4 bg-[#2B2B2B80] p-6">
        {assets.map(
          (asset, index) =>
            asset.isActive && (
              <div
                key={index}
                className="w-full flex justify-between items-center"
              >
                <div className="flex gap-4 items-center">
                  <Image
                    width={48}
                    height={48}
                    // @ts-ignore
                    src={`${assetsDetails[chainId][asset.assetAddress].ticker}`}
                    // @ts-ignore
                    alt={`${assetsDetails[chainId][asset.assetAddress].name}`}
                    className="border border-white rounded-full"
                  />
                  <div className="flex flex-col gap-1 ">
                    <p>
                      {
                        // @ts-ignore
                        assetsDetails[chainId][asset.assetAddress].name
                      }
                    </p>
                  </div>
                </div>

                <p>
                  {"$ "}
                  <NumericFormat
                    thousandSeparator
                    displayType="text"
                    value={
                      asset.price /
                      10 **
                        // @ts-ignore
                        assetsDetails[`${chainId}`][asset.assetAddress].decimal
                    }
                    decimalScale={2}
                    fixedDecimalScale={
                      asset.price /
                        10 **
                          // @ts-ignore
                          assetsDetails[84532][asset.assetAddress].decimal &&
                      (asset.price /
                        // @ts-ignore
                        10 **
                          // @ts-ignore
                          assetsDetails[chainId][asset.assetAddress].decimal) %
                        1 ===
                        0
                        ? true
                        : false
                    }
                  />
                  <span></span>
                </p>
              </div>
            )
        )}
      </div>
    </div>
  ) : (
    <div className="w-2/5 flex flex-col gap-4">
      <p className="font-semibold">Supported assets</p>
      {/* {errorAssetId && (
        <div>
          Error:{" "}
          {(errorAssetId as BaseError).shortMessage || errorAssetId.message}
        </div>
      )} */}
      <div className="w-full flex flex-col rounded-lg gap-4 bg-[#2B2B2B80] p-6">
        {assets.map(
          (asset, index) =>
            asset.isActive && (
              <div
                key={index}
                className="w-full flex justify-between items-center"
              >
                <div className="flex gap-4 items-center">
                  <Image
                    width={48}
                    height={48}
                    // @ts-ignore
                    src={`${assetsDetails[84532][asset.assetAddress].ticker}`}
                    // @ts-ignore
                    alt={`${assetsDetails[84532][asset.assetAddress].name}`}
                    className="border border-white rounded-full"
                  />
                  <div className="flex flex-col gap-1 ">
                    <p>
                      {
                        // @ts-ignore
                        assetsDetails[84532][asset.assetAddress].name
                      }
                    </p>
                  </div>
                </div>

                <p>
                  {"$ "}
                  <NumericFormat
                    thousandSeparator
                    displayType="text"
                    value={
                      asset.price /
                      // @ts-ignore
                      10 ** assetsDetails[84532][asset.assetAddress].decimal
                    }
                    decimalScale={2}
                    fixedDecimalScale={
                      asset.price /
                        10 **
                          // @ts-ignore
                          assetsDetails[84532][asset.assetAddress].decimal &&
                      (asset.price /
                        // @ts-ignore
                        10 **
                          // @ts-ignore
                          assetsDetails[84532][asset.assetAddress].decimal) %
                        1 ===
                        0
                        ? true
                        : false
                    }
                  />
                  <span></span>
                </p>
              </div>
            )
        )}
      </div>
    </div>
  );
}
