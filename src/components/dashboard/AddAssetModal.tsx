import { StorageContractAbi } from "@/abis/StorageContractAbi";
import {
  Asset,
  AssetDetail,
  assetsArray,
  assetsDetails,
  storageContractAddrs,
} from "@/constants";
import { getEthersProvider } from "@/ethersProvider";
import { config } from "@/wagmi";
import { ethers } from "ethers";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import AssetsLoader from "./Loaders/AssetsLoader";
import { getAssetBalance } from "@/utils/getAssetBalance";
import { erc20Abi } from "@/abis/erc20Abi";

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AssetData {
  id: string;
  assetAddress: string;
  chainLinkAggregator: string;
  isActive: boolean;
  price: string;
}

interface FullAsset {
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

const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose }) => {
  const { chainId, address } = useAccount();
  const [selectedAsset, setSelectedAsset] = useState<FullAsset>();
  const [inputValue, setInputValue] = useState<number | string>(0);
  const [isToggled, setIsToggled] = useState<boolean>(true); // Toggle state
  const [showAssetSelect, setShowAssetSelect] = useState<boolean>(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [nextAssetId, setNextAssetId] = useState<number | null>(null);
  const provider = getEthersProvider(config);
  const [loading, setLoading] = useState(true);

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
  }, [nextAssetId, chainId, assets]);

  useEffect(() => {
    if (assets.length > 0) {
      const fetchBalances = async () => {
        try {
          const assetBalancePromises = [];
          for (let i = 0; i < assets.length; i++) {
            // Create a new promise for each asset fetch
            assetBalancePromises.push(
              (async () => {
                const contract = new ethers.Contract(
                  assets[i].assetAddress,
                  erc20Abi,
                  provider
                );

                const [balance, decimals] = await Promise.all([
                  contract.balanceOf(address),
                  contract.decimals(),
                ]);

                const formatedBalance = ethers.utils.formatUnits(
                  balance,
                  decimals
                );
                const formatedPrice = ethers.utils.formatUnits(
                  assets[i].price,
                  decimals
                );

                return {
                  balance: formatedBalance,
                  usdBal: parseInt(formatedBalance) * parseInt(formatedPrice),
                };
              })()
            );
          }

          // Wait for all promises to resolve
          const assetBalance = await Promise.all(assetBalancePromises);
          setBalances(assetBalance);
        } catch (error) {
          console.error("Error fetching balances:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchBalances();
    }
  }, [assets]);

  useEffect(() => {
    if (assets && balances && !selectedAsset) {
      const assetsDetail = {
        name: "USDT",
        ticker: "/images/tickers/usdt.png",
        decimal: 18,
        fullName: "Tether",
      }
      const combinedObjects = {
        ...assets[0],
        ...balances[0],
        ...assetsDetail
      };
      setSelectedAsset(combinedObjects);
    }
  }, [assets, balances]);

  const handleAssetSelect = (
    asset: AssetData,
    assetsDetail: AssetDetail,
    balances: { balance: number; usdBal: number }
  ) => {
    const combinedObject = {
      ...asset,
      ...assetsDetail,
      ...balances,
    };
    setSelectedAsset(combinedObject);
    setShowAssetSelect(false);
  };

  const handleToggle = () => {
    if (isToggled && selectedAsset) {
      setInputValue(
        (
          parseFloat(inputValue as string) * parseFloat(`${parseFloat(selectedAsset.price)/selectedAsset.decimal}`)
        ).toFixed(2)
      );
    } else {
      if (selectedAsset) {
        setInputValue(
          (
            parseFloat(inputValue as string) / parseFloat(`${parseFloat(selectedAsset.price)/selectedAsset.decimal}`)
          ).toFixed(6)
        );
      }
    }
    setIsToggled(!isToggled);
  };

  const handlePercentageClick = (percentage: number) => {
    //@ts-ignore
    const balance =
      isToggled && selectedAsset
        ? selectedAsset?.usdBal
        //@ts-ignore
        : selectedAsset?.usdBal * parseFloat(selectedAsset?.price);
    setInputValue(
      // isToggled
      //   ? (balance * percentage).toFixed(isToggled ? 6 : 2)
      //   //@ts-ignore
      //   : parseFloat(selectedAsset?.price) *
      //       parseFloat((balance * percentage).toFixed(isToggled ? 6 : 2))
      (balance * percentage).toFixed(isToggled ? 6 : 2)
    );
  };

  useEffect(() => {
    if (!isToggled && selectedAsset) {
      setInputValue(
        (
          parseFloat(inputValue as string) * parseFloat(`${parseFloat(selectedAsset.price)/selectedAsset.decimal}`)
        ).toFixed(2)
      );
    }
  }, [selectedAsset]);

  if (!isOpen) return null;

  console.log(selectedAsset)

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-tertiary-7 text-white px-6 py-12 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <button className="text-white font-medium text-xl" onClick={onClose}>
            &larr; Add asset
          </button>
        </div>

        <div className="flex">
          <div className="flex flex-col w-[97%]">
            {selectedAsset && (
              <p className="text-sm text-gray-400 text-right cursor-pointer">
                {isToggled
                  ? `${(parseFloat(inputValue as string) * parseFloat(`${parseFloat(selectedAsset.price)/selectedAsset.decimal}`)).toFixed(2)} USD`
                  : `${(parseFloat(inputValue as string) / parseFloat(`${parseFloat(selectedAsset.price)/selectedAsset.decimal}`)).toFixed(6)} ${selectedAsset.name}`}
              </p>
            )}

            <div className="mb-4 relative">
              <div className="flex items-center justify-between bg-tertiary-6 rounded-lg p-4 cursor-pointer">
                <div
                  className="flex items-center gap-2"
                  onClick={() => setShowAssetSelect(!showAssetSelect)}
                >
                  {selectedAsset && (
                    <Image
                      src={selectedAsset.ticker}
                      alt={selectedAsset?.name}
                      width={24}
                      height={24}
                      className="border rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    <p className="flex items-center gap-1">
                      <span className=" font-medium">
                        {selectedAsset?.name}
                      </span>
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.07924 7.39706C6.03921 7.44906 5.96079 7.44906 5.92076 7.39706L0.927785 0.911C0.877164 0.845243 0.924041 0.75 1.00703 0.75L10.993 0.750001C11.076 0.750001 11.1228 0.845243 11.0722 0.911L6.07924 7.39706Z"
                          fill="white"
                        />
                      </svg>
                    </p>
                    <span className=" text-xs text-neutral-5">
                      $
                      {selectedAsset && (
                        <NumericFormat
                          thousandSeparator
                          displayType="text"
                          value={selectedAsset.usdBal}
                          decimalScale={selectedAsset.usdBal % 1 === 0 ? 2 : 8}
                          fixedDecimalScale={
                            selectedAsset.usdBal % 1 === 0 ? true : false
                          }
                        />
                      )}
                    </span>
                  </div>
                </div>

                <p className="border border-y-0 border-r-0 border-l-tertiary-5 py-3 text-tertiary-6">
                  |
                </p>

                <div className="flex">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-transparent p-2 outline-none border rounded-l-md text-white border-tertiary-5"
                  />
                  {selectedAsset && (
                    <span className="bg-tertiary-5 p-2 rounded-r-md">
                      {!isToggled ? `USD` : `${selectedAsset.name}`}
                    </span>
                  )}
                </div>
              </div>

              {showAssetSelect && (
                <div className="absolute top-full left-0 bg-tertiary-6 mt-2 p-4 rounded-lg shadow-lg z-50 flex w-full h-80 overflow-y-auto flex-col gap-4 overflow-x-auto">
                  {loading && <AssetsLoader />}

                  {assets.map(
                    (asset, index) =>
                      asset.isActive && (
                        <div
                          key={index}
                          className="w-full flex justify-between items-center border border-x-0 border-t-0 pb-4 border-b-tertiary-5"
                          onClick={() =>
                            handleAssetSelect(
                              asset,
                              // @ts-ignore
                              assetsDetails[chainId][asset.assetAddress],
                              balances[index]
                            )
                          }
                        >
                          <div
                            key={asset.ticker}
                            className="flex items-center gap-2"
                          >
                            <Image
                              width={32}
                              height={32}
                              // @ts-ignore
                              src={`${assetsDetails[chainId][asset.assetAddress].ticker}`}
                              // @ts-ignore
                              alt={`${assetsDetails[chainId][asset.assetAddress].name}`}
                              className="border border-white rounded-full"
                            />
                            <div className="flex flex-col">
                              <p className="flex items-center gap-1">
                                <span className=" text-sm">
                                  {
                                    // @ts-ignore
                                    assetsDetails[chainId][asset.assetAddress]
                                      .name
                                  }
                                </span>
                              </p>
                              <span className="text-[10px] text-[#979797]">
                                {
                                  // @ts-ignore
                                  assetsDetails[chainId][asset.assetAddress]
                                    .fullName
                                }
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="flex flex-col">
                              <p className="flex justify-end gap-1">
                                {balances.length > 0 && (
                                  <NumericFormat
                                    className=" text-sm"
                                    thousandSeparator
                                    displayType="text"
                                    value={balances[index].balance}
                                    decimalScale={
                                      balances[index].balance % 1 === 0 ? 2 : 8
                                    }
                                    fixedDecimalScale={
                                      balances[index].balance % 1 === 0
                                        ? true
                                        : false
                                    }
                                  />
                                )}
                              </p>
                              <p className="flex text-[10px] text-[#979797]">
                                {"~ $ "}
                                {balances.length > 0 && (
                                  <NumericFormat
                                    className="flex justify-end text-[10px] text-[#979797]"
                                    thousandSeparator
                                    displayType="text"
                                    value={balances[index].usdBal}
                                    decimalScale={
                                      balances[index].usdBal % 1 === 0 ? 2 : 8
                                    }
                                    fixedDecimalScale={
                                      balances[index].usdBal % 1 === 0
                                        ? true
                                        : false
                                    }
                                  />
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}
            </div>

            <div className="mb-6">
              <span className="text-sm text-gray-400">Choose amount</span>
              <div className="flex gap-3 mt-2 bg-tertiary-6 p-4 rounded-md">
                <button
                  onClick={() => handlePercentageClick(0.25)}
                  className="border border-neutral-4 hover:bg-gray-700 text-white font-semibold p-2 rounded-md"
                >
                  25%
                </button>
                <button
                  onClick={() => handlePercentageClick(0.5)}
                  className="border border-neutral-4 hover:bg-gray-700 text-white font-semibold p-2 rounded-md"
                >
                  50%
                </button>
                <button
                  onClick={() => handlePercentageClick(0.75)}
                  className="bg-secondry-4 hover:bg-secondry-5 text-tertiary-7 font-semibold p-2 rounded-md"
                >
                  75%
                </button>
                <button
                  onClick={() => handlePercentageClick(1)}
                  className="border border-neutral-4 hover:bg-gray-700 text-white font-semibold p-2 rounded-md"
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 pl-2 cursor-pointer" onClick={handleToggle}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.9598 4.74369L6.82291 5.88058L4.78392 3.84158L4.78392 14.4321H3.17588L3.17588 3.84158L1.13769 5.88058L0 4.74369L3.9799 0.763794L7.9598 4.74369ZM16 11.2563L12.0201 15.2362L8.0402 11.2563L9.17708 10.1194L11.2169 12.1584L11.2161 1.56781L12.8241 1.56781L12.8241 12.1584L14.8631 10.1194L16 11.2563Z"
                fill="#C4C4C4"
              />
            </svg>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <button className="bg-[#008080] hover:bg-teal-600 text-white font-medium text-lg py-3 px-4 mx-auto w-40 rounded-md">
            Add asset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal;
