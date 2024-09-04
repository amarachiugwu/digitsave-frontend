"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  BackArrowIcon,
  ClockIcon,
  FileIcon,
  LockIcon,
  NoOfAssetsIcon,
  YellowPlusIcon,
} from "@/icon";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { DigitsaveAcctAbi } from "@/abis/DigitsaveAccountAbi";
import { FactoryAbi } from "@/abis/FactoryContractAbi";
import { assetsArray, factoryContractAddrs } from "@/constants";
import { ethers } from "ethers";
import { getEthersProvider } from "@/ethersProvider";
import { config } from "@/wagmi";
import { useSearchParams } from "next/navigation";
import { NumericFormat } from "react-number-format";
import {
  calculatePercentageDaysGone,
  toRelativeTime,
} from "@/utils/dateFormat";
import ProgressBar from "@/components/dashboard/ProgressBar";
import OverlayLoader from "@/components/dashboard/Loaders/OverlayLoader";
import AddAssetModal from "@/components/dashboard/AddAssetModal";
import { BigNumber } from "ethers";
import Image from "next/image";
import { CombinedAsset } from "@/@types/assets.types";
import TopupAssetModal from "@/components/dashboard/TopupAssetModal";

type Save = {
  id: number;
  totalDepositInUSD: string;
  totalWithdrawnInUSD: string;
  totalAssetLocked: string;
  lockPeriod: number;
  isCompleted: boolean;
  name: string;
  date: number;
  assets: any[];
};

export default function ViewSave() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dateCreated = parseInt(searchParams.get("datecreated") as string);
  const lockPeriod = parseInt(searchParams.get("period") as string);
  const { address, chainId } = useAccount();
  const [saving, setSaving] = useState<Save[]>([]);
  const [loading, setLoading] = useState(true);
  const provider = getEthersProvider(config);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [navOpen, setNavOpen] = useState(false);
  const [isTopupModalOpen, setTopupModalOpen] = useState<boolean>(false);
  const [selectedAssetId, setSelectedAssetId] = useState(1);
  const percentGone = calculatePercentageDaysGone(
    dateCreated,
    lockPeriod
  ).toFixed(2);
  const isPercentageGone = isNaN(parseFloat(percentGone)) ? "0" : percentGone;

  const handleCloseModal = () => setModalOpen(false);
  const handleOpenModal = () => setModalOpen(true);

  const handleTopupCloseModal = () => setTopupModalOpen(false);
  const handleTopupOpenModal = (assetId: number) => {
    setSelectedAssetId(assetId);
    setTopupModalOpen(true);
  };

  useEffect(() => {}, [isModalOpen]);

  // fetch users contract >> savings account
  const {
    data: savingsAcct,
    error: errorUserSavingsContracts,
    isLoading: isLoadingUserSavingsContracts,
  }: any = useReadContract({
    abi: FactoryAbi,
    address: factoryContractAddrs,
    functionName: "userSavingsContracts",
    args: [address],
  });

  useEffect(() => {
    if (
      (savingsAcct !== null && id) ||
      isModalOpen === false ||
      isTopupModalOpen === false
    ) {
      const fetchAllSavings = async () => {
        try {
          const savingPromise = [];
          savingPromise.push(
            (async () => {
              const contract = new ethers.Contract(
                savingsAcct,
                DigitsaveAcctAbi,
                provider
              );

              // const savingData = await contract.savings(id);

              const [savingData, savingsAssets] = await Promise.all([
                contract.savings(id),
                contract.getSavingsAssets(id),
              ]);

              const combinedAssetData: CombinedAsset[] = [];
              savingsAssets.map(
                (asset: {
                  assetId: BigNumber;
                  amountDepositedInUsd: BigNumber;
                  amount: BigNumber;
                  amountWithdrawnInUsd: BigNumber;
                }) => {
                  const id = parseInt(asset.assetId.toString());

                  const extraDetails = assetsArray[chainId as number][id - 1];

                  combinedAssetData.push({
                    ...asset,
                    ...extraDetails,
                  });
                }
              );

              return {
                id: savingData.id.toString(),
                totalDepositInUSD: savingData.totalDepositInUSD.toString(),
                totalWithdrawnInUSD: savingData.totalWithdrawnInUSD.toString(),
                totalAssetLocked: savingData.totalAssetLocked.toString(),
                lockPeriod: savingData.lockPeriod,
                isCompleted: savingData.isCompleted,
                name: savingData.name,
                date: 1723658675,
                assets: combinedAssetData,
              };
            })()
          );

          // Wait for all promises to resolve
          const savingsData = await Promise.all(savingPromise);

          console.log(savingsAcct, id, savingsData);

          setSaving(savingsData);
        } catch (error) {
          // console.error("Error fetching assets:", error);
        } finally {
          // Ensure loading state is updated
          setLoading(false);
        }
      };

      fetchAllSavings();
    }
  }, [savingsAcct, id, isModalOpen, isTopupModalOpen]);

  return (
    <main className="text-neutral-2">
      <Header navOpen={navOpen} setNavOpen={setNavOpen} />
      <section className="flex min-h-screen border-t border-tertiary-6">
        <div className="w-1/5">
          <div className="w-1/5 fixed">
            <Sidebar />
          </div>
        </div>

        <div className="w-4/5 flex flex-col">
          <Link href="/save" className="flex gap-2 p-6 pb-2 items-center">
            <BackArrowIcon />
            <p className="text-tertiary-4">Back</p>
          </Link>

          <div className="p-6 pb-0">
            <h1 className="font-bold text-2xl">Savings</h1>
            <p className="text-tertiary-4 font-medium text-xl mt-2">
              This saving is for{" "}
              {saving[0]?.name && (
                <b className="text-neutral-1">
                  {ethers.utils.parseBytes32String(saving[0]?.name)}
                </b>
              )}{" "}
              save only
            </p>
          </div>

          {saving[0]?.assets.length > 0 && (
            <section className="w-full m-h-screen w-4/4 px-6 py-10">
              <div className="flex gap-4 w-full">
                <div className="w-3/5 flex flex-col gap-4 p-6 bg-center rounded-lg bg-[url('/images/stats-bg.png')]">
                  <div className="flex gap-8 items-center">
                    <p className="font-bold font-swiss text-[32px] text-secondry-4">
                      {saving[0]?.name && (
                        <b className="">
                          {ethers.utils.parseBytes32String(saving[0]?.name)}
                        </b>
                      )}{" "}
                      Save
                    </p>
                  </div>

                  <div className="flex flex-1 justify-between gap-3 item-center">
                    <div className="flex flex-col gap-2">
                      <div className="flex">
                        <div className="flex gap-2">
                          <LockIcon />
                          <span className="">savings Balance</span>
                        </div>
                      </div>

                      <div className="font-bold font-swiss text-2xl">
                        $
                        <NumericFormat
                          thousandSeparator
                          displayType="text"
                          value={ethers.utils.formatUnits(
                            saving[0]?.totalDepositInUSD
                          )}
                          decimalScale={2}
                          fixedDecimalScale={
                            parseInt(
                              ethers.utils.formatUnits(
                                saving[0]?.totalDepositInUSD
                              )
                            ) %
                              1 ===
                            0
                              ? true
                              : false
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex">
                        <div className="flex gap-2">
                          <NoOfAssetsIcon />
                          <span className="">No of assets</span>
                        </div>
                      </div>

                      <p className="font-bold font-swiss text-2xl">
                        {saving[0]?.assets.length}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex">
                        <div className="flex gap-2">
                          <ClockIcon />
                          <span className="">Save Progress</span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-2">
                        <ProgressBar value={parseInt(isPercentageGone)} />
                        {saving[0]?.lockPeriod && (
                          <span className="text-neutral-1 text-xs">
                            Due {toRelativeTime(saving[0]?.lockPeriod)}
                          </span>
                        )}{" "}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-2/5 p-6  border rounded-lg border-primary-5 bg-[#131e1e] text-white">
                  <div className="flex flex-col gap-4">
                    <span className="text-sm">Intrest Balance</span>
                    <p className="font-bold font-swiss text-4xl">$0.00</p>
                    {/* <span className='pt-2 text-neutral-3'>Feature coming soon</span> */}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="w-full m-h-screen w-4/4 px-6 py-10">
            <h1 className="font-swiss text-2xl p-6 border-b border-tertiary-4 w-full">
              Assets Details
            </h1>
            <div className="flex flex-col rounded-md gap-4 w-full border border-tertiary-4">
              <div className=" flex flex-row p-6 border-b border-tertiary-4 w-full justify-between item-center">
                <h1 className="font-swiss text-2xl ">My Assets</h1>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={handleOpenModal}
                    className={`flex gap-2 items-center justify-center rounded-lg border border-secondry-3 text-secondry-3 w-44 py-2 px-5 `}
                  >
                    <YellowPlusIcon />
                    Add assets
                  </button>
                </div>
              </div>

              {saving[0]?.assets.length === 0 && (
                <div className="flex w-full py-10 flex-col item-center justify-center text-center gap-6">
                  <div className="flex justify-center w-full">
                    <FileIcon />
                  </div>

                  <p className="text-neutral-3 text-xl font-medium">
                    No assets found
                  </p>
                  <p className="mx-auto text-neutral-6 w-2/5">
                    There are no assets here, all assets added will appear here
                  </p>
                  <button
                    className={`mx-auto mt-5 mb-5 flex gap-2 items-center font-semibold  justify-center rounded-md bg-primary-0 text-white  py-4 px-12`}
                    onClick={handleOpenModal}
                  >
                    Add Assets
                  </button>
                </div>
              )}

              <div className="py-8">
                {saving[0]?.assets.map((asset, index) => (
                  <div
                    key={index}
                    className="w-full sm:w-4/5 md:w-3/5 mx-auto flex items-center gap-4 mb-4"
                  >
                    <div
                      className={`flex-grow flex  justify-between items-center bg-tertiary-6 py-4 px-8 rounded-md border-b-tertiary-5 cursor-pointer`}
                    >
                      <div
                        key={asset.ticker}
                        className="flex items-center gap-2"
                      >
                        <Image
                          width={32}
                          height={32}
                          src={`${asset.ticker}`}
                          alt={`${asset.name}`}
                          className="border border-white rounded-full"
                        />
                        <div className="flex flex-col">
                          <p className="flex items-center gap-1">
                            <span className=" text-sm">{asset.name}</span>
                          </p>
                          <span className="text-[12px] text-[#979797]">
                            {asset.fullName}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <div className="flex justify-end gap-1">
                            <NumericFormat
                              className=" text-sm"
                              thousandSeparator
                              displayType="text"
                              value={ethers.utils.formatUnits(
                                BigNumber.from(asset.amount),
                                18
                              )}
                              decimalScale={
                                parseFloat(
                                  ethers.utils.formatUnits(
                                    BigNumber.from(asset.amount),
                                    18
                                  )
                                ) %
                                  1 ===
                                0
                                  ? 2
                                  : 8
                              }
                              fixedDecimalScale={
                                parseFloat(
                                  ethers.utils.formatUnits(
                                    BigNumber.from(asset.amount),
                                    18
                                  )
                                ) %
                                  1 ===
                                0
                                  ? true
                                  : false
                              }
                            />
                          </div>
                          <div className="flex text-[12px] text-[#979797]">
                            {"~ $ "}
                            <NumericFormat
                              className="flex justify-end text-[12px] text-[#979797]"
                              thousandSeparator
                              displayType="text"
                              value={ethers.utils.formatUnits(
                                BigNumber.from(asset.amountDepositedInUsd),
                                18
                              )}
                              decimalScale={
                                parseFloat(
                                  ethers.utils.formatUnits(
                                    BigNumber.from(asset.amountDepositedInUsd),
                                    18
                                  )
                                ) %
                                  1 ===
                                0
                                  ? 2
                                  : 8
                              }
                              fixedDecimalScale={
                                parseFloat(
                                  ethers.utils.formatUnits(
                                    BigNumber.from(asset.amountDepositedInUsd),
                                    18
                                  )
                                ) %
                                  1 ===
                                0
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <button
                        className="bg-primary-5 text-white py-2 px-4 rounded-md font-semibold"
                        onClick={() => {
                          handleTopupOpenModal(
                            parseInt(asset.assetId.toString())
                          );
                        }}
                      >
                        Top up
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      {loading && <OverlayLoader />}
      <AddAssetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        savingId={id as string}
      />

      <TopupAssetModal
        isOpen={isTopupModalOpen}
        onClose={handleTopupCloseModal}
        savingId={id as string}
        assetId={selectedAssetId}
      />
    </main>
  );
}
