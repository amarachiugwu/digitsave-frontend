import { StorageContractAbi } from "@/abis/StorageContractAbi";
import { assetsArray, assetsDetails } from "@/constants";
import { useContractAddresses } from "@/constants/index";
import { getEthersProvider } from "@/ethersProvider";
import { config } from "@/wagmi";
import { ethers } from "ethers";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { BaseError, useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import AssetsLoader from "./Loaders/AssetsLoader";
import { erc20Abi } from "@/abis/erc20Abi";
import { useWriteContract } from "wagmi";
import { FactoryAbi } from "@/abis/FactoryContractAbi";
import { DigitsaveAcctAbi } from "@/abis/DigitsaveAccountAbi";
import { useWaitForTransactionReceipt } from "wagmi";
import { BigNumber } from "ethers";
import Modal from "./Modal";
import { readContract } from "@wagmi/core";
import {
  TopupAssetModalProps,
  AssetData,
  AssetDetail,
  FullAsset,
  SavingsAsset,
} from "@/@types/assets.types";

const TopupAssetModal: React.FC<TopupAssetModalProps> = ({
  isOpen,
  onClose,
  savingId,
  assetId: _assetId,
}) => {
  const { factoryContractAddrs, storageContractAddrs } = useContractAddresses();
  const { chainId, address } = useAccount();
  const [selectedAsset, setSelectedAsset] = useState<FullAsset>();
  const [inputValue, setInputValue] = useState<number | string>(0);
  const [isToggled, setIsToggled] = useState<boolean>(true); // Toggle state
  const [showAssetSelect, setShowAssetSelect] = useState<boolean>(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [savingsAssets, setSavingsAssets] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [nextAssetId, setNextAssetId] = useState<number | null>(null);
  const provider = getEthersProvider(config);
  const [loading, setLoading] = useState(true);
  const [percentClicked, setPercentClicked] = useState(0);
  const savingIdBigNumber = BigNumber.from(savingId);
  const [isAlertModalOpen, setAlertModalOpen] = useState(true);
  const [isTrackModalOpen, setTrackModalOpen] = useState(false);

  const closeAlertModal = () => {
    setAlertModalOpen(false);
    setTrackModalOpen(false);
  };
  // fetch the next asset add, to determine the number of assets supported
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

  // sets state with next asset id
  useEffect(() => {
    if (nextAssetIdData) {
      setNextAssetId(parseInt(nextAssetIdData.toString()));
    }
  }, [nextAssetIdData]);

  // fetches the balances of a user per asset
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

  // sets the default seleceted asset
  useEffect(() => {
    if (assets[0] && balances[0] && !selectedAsset && _assetId && chainId) {
      // @ts-ignore
      const assetsDetail = assetsArray[chainId][_assetId - 1];
      const combinedObjects = {
        ...assets[0],
        ...balances[0],
        ...assetsDetail,
      };
      console.log(combinedObjects, _assetId - 1);
      setSelectedAsset(combinedObjects);
    }
  }, [assets, balances, chainId, _assetId]);

  // handles the selection of assets form the dropdown
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
        getUsdValue(inputValue, selectedAsset.price, selectedAsset.decimal)
      );
    } else {
      if (selectedAsset) {
        setInputValue(
          getTokenValue(inputValue, selectedAsset.price, selectedAsset.decimal)
        );
      }
    }
    setIsToggled(!isToggled);
  };

  const handlePercentageClick = (percentage: number, id: number) => {
    //@ts-ignore
    const balance =
      isToggled && selectedAsset
        ? selectedAsset?.balance
        : //@ts-ignore
          selectedAsset?.usdBal;
    // @ts-ignore
    setInputValue((balance * percentage).toFixed(isToggled ? 6 : 2));
    setPercentClicked(id);
  };

  // handles selected asset change
  useEffect(() => {
    if (!isToggled && selectedAsset) {
      setInputValue(
        (
          parseFloat(inputValue as string) *
          parseFloat(
            `${parseFloat(selectedAsset.price) / selectedAsset.decimal}`
          )
        ).toFixed(2)
      );
    }
  }, [selectedAsset]);

  // gets the usd equivalence of crypto amount entered in input
  const getUsdValue = (value: any, price: string, decimal: number) => {
    if (value && price && decimal) {
      const stringValue = inputValue.toString();
      parseFloat(inputValue as string);
      const formatedPrice = ethers.utils.formatUnits(price, decimal).toString();
      const stringPrice = parseFloat(inputValue ? formatedPrice : "0").toFixed(
        2
      );
      return (parseFloat(stringValue) * parseFloat(stringPrice)).toFixed(2);
    } else {
      return 0;
    }
  };

  // gets the crypto equivalence of usd amount entered in input
  const getTokenValue = (value: any, price: string, decimal: number) => {
    if (value && price && decimal) {
      const stringValue = inputValue.toString();
      parseFloat(inputValue as string);
      const formatedPrice = ethers.utils.formatUnits(price, decimal).toString();
      const stringPrice = parseFloat(inputValue ? formatedPrice : "0").toFixed(
        2
      );
      return (parseFloat(stringValue) / parseFloat(stringPrice)).toFixed(6);
    } else {
      return 0;
    }
  };

  const { data: savingsAcct }: any = useReadContract({
    abi: FactoryAbi,
    address: factoryContractAddrs,
    functionName: "userSavingsContracts",
    args: [address],
  });

  const {
    data: approveHash,
    error: approvalError,
    isPending: approvalIsPending,
    writeContract: approveWrite,
  } = useWriteContract();
  const {
    data: addAssetHash,
    error: addAssetError,
    isPending: addAssetIsPending,
    writeContract: addAssetWrite,
  } = useWriteContract();

  const { isLoading: isApproving, isSuccess: isApproved } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: addAssetHash,
    });

  const fetchSavingsAssets: any = async () => {
    try {
      const result = (await readContract(config, {
        abi: DigitsaveAcctAbi,
        address: savingsAcct,
        functionName: "getSavingsAssets",
        args: [savingIdBigNumber],
        // account: address,
      })) as SavingsAsset[];
      //@ts-ignore
      const assetIds = result.map((asset) => asset.assetId.toString());

      setSavingsAssets(assetIds);
      return result;
    } catch (error: any) {
      console.log(error);
      setSavingsAssets([]);
    }
  };

  // fetches the current changes made to the save
  useEffect(() => {
    fetchSavingsAssets();
  }, [isConfirmed]);

  // fetches all assets and updates state
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
  }, [nextAssetId, chainId, assets, isConfirmed]);

  async function submit() {
    // onClose()
    setAlertModalOpen(true);

    const assetParam = isToggled
      ? {
          assetId: BigNumber.from(selectedAsset?.id),
          amount: ethers.utils.parseUnits(
            inputValue as string,
            selectedAsset?.decimal || 18
          ),
        }
      : {
          assetId: BigNumber.from(selectedAsset?.id),
          amount: ethers.utils.parseUnits(
            (
              parseFloat(inputValue as string) /
              //@ts-ignore
              selectedAsset?.usdBal
            ).toString(),
            selectedAsset?.decimal || 18
          ),
        };

    await approveWrite({
      address: selectedAsset?.assetAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [savingsAcct, assetParam.amount],
    });
  }

  async function topUpAsset() {
    setAlertModalOpen(true);
    setTrackModalOpen(true);

    const assetParam = isToggled
      ? {
          assetId: BigNumber.from(selectedAsset?.id),
          amount: ethers.utils.parseUnits(
            inputValue as string,
            selectedAsset?.decimal || 18
          ),
        }
      : {
          assetId: BigNumber.from(selectedAsset?.id),
          amount: ethers.utils.parseUnits(
            (
              parseFloat(inputValue as string) /
              //@ts-ignore
              selectedAsset?.usdBal
            ).toString(),
            selectedAsset?.decimal || 18
          ),
        };

    addAssetWrite({
      address: savingsAcct,
      abi: DigitsaveAcctAbi,
      functionName: "topUpAsset",
      args: [savingIdBigNumber, assetParam],
    });
  }

  useEffect(() => {
    if (isApproved) {
      topUpAsset();
    }
  }, [isApproved]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-tertiary-7 text-white px-6 py-12 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <button className="text-white font-medium text-xl" onClick={onClose}>
            &larr; Topup Asset
          </button>
        </div>
        <div className="flex">
          <div className="flex flex-col w-[97%]">
            {selectedAsset && (
              <p className="text-sm text-gray-400 text-right cursor-pointer">
                {isToggled ? (
                  <div>
                    <NumericFormat
                      thousandSeparator
                      displayType="text"
                      value={getUsdValue(
                        inputValue,
                        selectedAsset.price,
                        selectedAsset.decimal
                      )}
                      decimalScale={selectedAsset.usdBal % 1 === 0 ? 2 : 2}
                      fixedDecimalScale={
                        selectedAsset.usdBal % 1 === 0 ? true : false
                      }
                    />{" "}
                    USD
                  </div>
                ) : (
                  `${getTokenValue(
                    inputValue,
                    selectedAsset.price,
                    selectedAsset.decimal
                  )}
                     ${selectedAsset.name}`
                )}
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
                <div className="absolute top-full left-0 bg-tertiary-6 mt-2 p-4 rounded-lg shadow-lg z-10 flex w-full h-80 overflow-y-auto flex-col gap-4 overflow-x-auto">
                  {loading && <AssetsLoader />}

                  {assets.map(
                    (asset, index) =>
                      asset.isActive && (
                        <div
                          key={index}
                          className={`w-full flex justify-between items-center border border-x-0 border-t-0 pb-4 border-b-tertiary-5 cursor-pointer`}
                          onClick={() => {
                            handleAssetSelect(
                              asset,
                              // @ts-ignore
                              assetsDetails[chainId][asset.assetAddress],
                              balances[index]
                            );
                          }}
                        >
                          <div
                            key={asset.ticker}
                            className="flex items-center gap-2"
                          >
                            <Image
                              width={32}
                              height={32}
                              src={`${
                                // @ts-ignore
                                assetsDetails[chainId][asset.assetAddress]
                                  .ticker
                              }`}
                              alt={`${
                                // @ts-ignore
                                assetsDetails[chainId][asset.assetAddress].name
                              }`}
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
                  onClick={() => handlePercentageClick(0.25, 1)}
                  className={`font-semibold p-2 rounded-md ${
                    percentClicked === 1
                      ? "bg-secondry-4 hover:bg-secondry-5 text-tertiary-7 "
                      : "border border-neutral-4 hover:bg-gray-700 text-white "
                  }`}
                >
                  25%
                </button>
                <button
                  onClick={() => handlePercentageClick(0.5, 2)}
                  className={`font-semibold p-2 rounded-md ${
                    percentClicked === 2
                      ? "bg-secondry-4 hover:bg-secondry-5 text-tertiary-7 "
                      : "border border-neutral-4 hover:bg-gray-700 text-white "
                  }`}
                >
                  50%
                </button>
                <button
                  onClick={() => handlePercentageClick(0.75, 3)}
                  className={`font-semibold p-2 rounded-md ${
                    percentClicked === 3
                      ? "bg-secondry-4 hover:bg-secondry-5 text-tertiary-7 "
                      : "border border-neutral-4 hover:bg-gray-700 text-white "
                  }`}
                >
                  75%
                </button>
                <button
                  onClick={() => handlePercentageClick(1, 4)}
                  className={`font-semibold p-2 rounded-md ${
                    percentClicked === 4
                      ? "bg-secondry-4 hover:bg-secondry-5 text-tertiary-7 "
                      : "border border-neutral-4 hover:bg-gray-700 text-white "
                  }`}
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
          <button
            className={`bg-[#008080] hover:bg-teal-600 text-white font-medium text-lg py-3 px-4 mx-auto w-40 rounded-md ${
              approvalIsPending ||
              addAssetIsPending ||
              isApproving ||
              isConfirming
                ? "cursor-not-allowed"
                : ""
            }`}
            onClick={() => submit()}
            disabled={
              approvalIsPending ||
              addAssetIsPending ||
              isApproving ||
              isConfirming
            }
          >
            Topup Asset
          </button>
        </div>

        {/* {addAssetHash && <div>Transaction Hash: {addAssetHash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {addAssetIsPending && <div>Transaction Pending.</div>}

        {addAssetError && (
          <>
            <div className="text-center text-red-400 text-sm pt-3">
              Error:{" "}
              {(addAssetError as BaseError).shortMessage ||
                addAssetError.message}
            </div>
            <div>{addAssetError.message}</div>
          </>
        )} */}
      </div>

      {(isApproving || isConfirming) && (
        <Modal
          centerBg={false}
          onCloseModal={closeAlertModal}
          isOpen={isAlertModalOpen}
          status={
            <div className="flex justify-center mb-8">
              <div className="relative w-16 h-16 flex justify-center items-center">
                <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-ring"></div>
              </div>
            </div>
          }
          title="Confirming"
          subtitle="This will only take a few seconds to complete"
        />
      )}

      {(approvalIsPending || addAssetIsPending) && (
        <Modal
          centerBg={false}
          onCloseModal={closeAlertModal}
          isOpen={isAlertModalOpen}
          status={
            <div className="flex justify-center mb-8">
              <div className="relative w-16 h-16 flex justify-center items-center">
                <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-ring"></div>
              </div>
            </div>
          }
          title="Pending"
          subtitle="Check the app"
        />
      )}

      {isConfirmed && isTrackModalOpen && (
        <Modal
          centerBg={false}
          onCloseModal={closeAlertModal}
          isOpen={isAlertModalOpen}
          status={
            <svg
              width="140"
              height="141"
              viewBox="0 0 140 141"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_241_2941)">
                <circle
                  cx="70"
                  cy="66.25"
                  r="66"
                  fill="#94F2F2"
                  fillOpacity="0.1"
                  shapeRendering="crispEdges"
                />
              </g>
              <circle cx="69.6988" cy="66.25" r="41.2877" fill="#006262" />
              <path
                d="M88.3882 51.2856C89.2784 52.1758 89.2784 53.619 88.3882 54.5092L65.3999 77.4976C63.8378 79.0597 61.3051 79.0597 59.743 77.4976L51.6124 69.367C50.7219 68.4765 50.7219 67.0327 51.6124 66.1421C52.5022 65.2524 53.9444 65.2515 54.8353 66.1402L59.7443 71.0372C61.3065 72.5956 63.8354 72.5946 65.3964 71.0351L85.1653 51.2848C86.0556 50.3954 87.4983 50.3957 88.3882 51.2856Z"
                fill="white"
              />
              <defs>
                <filter
                  id="filter0_d_241_2941"
                  x="0"
                  y="0.25"
                  width="140"
                  height="140"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_241_2941"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_241_2941"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          }
          title="Success"
          subtitle="Transaction has completed successfully"
        />
      )}
    </div>
  );
};

export default TopupAssetModal;
