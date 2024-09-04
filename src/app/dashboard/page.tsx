"use client";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useSimulateContract,
  useReadContract,
} from "wagmi";
import { useChainUrl, useContractAddresses } from "@/constants/index";
import { FactoryAbi } from "@/abis/FactoryContractAbi";
import { Circle, FileIcon, WalletIconPlain } from "@/icon";
import { isValidAddress } from "@/utils/validateAddress";
import OverviewLoader from "@/components/dashboard/Loaders/OverviewLoader";
import { toRelativeTime, toFormattedDate } from "@/utils/dateFormat";
import ActivityLoader from "@/components/dashboard/Loaders/ActivityLoader";
import Balances from "@/components/dashboard/Balances";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import GuestLayout from "@/components/dashboard/GuestLayout";
import Assets from "@/components/dashboard/Assets";
import { useQuery } from "urql";
import { activitiesQuery } from "@/queries/activitiesQuery";
import { DigitsaveAcctAbi } from "@/abis/DigitsaveAccountAbi";
import { getEthersProvider } from "@/ethersProvider";
import { config } from "@/wagmi";
import { ethers } from "ethers";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Web3 from "web3";
import { getWeb3Provider } from "@/web3jsProvider";
import { NumericFormat } from "react-number-format";
import SavingListLoader from "@/components/dashboard/Loaders/SavingListLoader";

export default function Dashboard() {
  const { chainUrl } = useChainUrl();
  const { factoryContractAddrs } = useContractAddresses();
  const { address, isConnected, chainId } = useAccount();
  const [savings, setSavings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextSavingId, setNextSavingId] = useState<number | null>(null);
  const provider = getEthersProvider(config);
  // const provider = getWeb3Provider(config);

  const [navOpen, setNavOpen] = useState(false);
  const activities = activitiesQuery(address);
  const [result, reexecuteQuery] = useQuery({
    query: activities,
    pause: address == undefined,
  });

  const web3 = new Web3();

  const refreshActivities = () => {
    // Refetch the query and skip the cache
    reexecuteQuery({ requestPolicy: "network-only" });
  };

  const { data: activitiesData, fetching, error: activitiesError } = result;

  // fetch users contract >> savings account
  const {
    data: savingsAcct,
    error,
    isLoading,
  }: any = useReadContract({
    abi: FactoryAbi,
    address: factoryContractAddrs,
    functionName: "userSavingsContracts",
    args: [address],
  });

  // Fetch nextAssetId using useReadContract
  const {
    data: nextSavingIdData,
    error: errorSavingId,
    isLoading: isLoadingSavingId,
  } = useReadContract({
    abi: DigitsaveAcctAbi,
    address: savingsAcct,
    functionName: "savingId",
    args: [],
  });

  console.log(savings);

  useEffect(() => {
    if (nextSavingIdData) {
      setNextSavingId(parseInt(nextSavingIdData.toString()));
    }
  }, [nextSavingIdData]);

  useEffect(() => {
    if (nextSavingId !== null) {
      const fetchAllSavings = async () => {
        try {
          const savingPromises = [];
          for (let i = 1; i < nextSavingId; i++) {
            // Create a new promise for each asset fetch
            savingPromises.push(
              (async () => {
                const contract = new ethers.Contract(
                  savingsAcct,
                  DigitsaveAcctAbi,
                  provider
                );

                // const filter = {
                //   address: savingsAcct,
                //   topics: [
                //     ethers.utils.id("SavingCreated(uint256,uint256)"),
                //     ethers.utils.hexZeroPad(ethers.utils.hexlify(i), 32),
                //   ],
                //   fromBlock: 13767310,
                //   toBlock: 13767310,
                // };

                // console.log(filter);
                const [
                  savingData,
                  // savingEvent
                ] = await Promise.all([
                  contract.savings(i),
                  // provider?.getLogs(filter),
                ]);

                return {
                  id: savingData.id.toString(),
                  totalDepositInUSD: savingData.totalDepositInUSD.toString(),
                  totalWithdrawnInUSD:
                    savingData.totalWithdrawnInUSD.toString(),
                  totalAssetLocked: savingData.totalAssetLocked.toString(),
                  lockPeriod: savingData.lockPeriod,
                  isCompleted: savingData.isCompleted,
                  date: 1725412179,
                  name: savingData.name,
                  // eventLog: savingEvent,
                };
              })()
            );
          }

          // Wait for all promises to resolve
          const savingsData = await Promise.all(savingPromises);
          setSavings(savingsData);
        } catch (error) {
          console.error("Error fetching assets:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAllSavings();
    }
  }, [nextSavingId, chainId]);

  // validates if user has created a savings account
  const isAddressValid = savingsAcct ? isValidAddress(savingsAcct) : false;

  // fetch users contract creation event
  useEffect(() => {
    if (!address) return;
  }, [address]);

  // create a savings account for new user
  const { data: createSavingsAccount } = useSimulateContract({
    abi: FactoryAbi,
    address: factoryContractAddrs,
    functionName: "createSavingsAccount",
  });

  const { writeContract, isPending } = useWriteContract();

  return (
    <main className="text-neutral-2">
      <Header navOpen={navOpen} setNavOpen={setNavOpen} />
      <section className="flex min-h-screen border-t border-tertiary-6">
        <div className="w-1/5 hidden lg:block">
          <div className="w-1/5 fixed">
            <Sidebar />
          </div>
        </div>
        <AnimatePresence>
          {navOpen && (
            <div className="w-full h-screen lg:hidden fixed block  z-20">
              <div
                onClick={() => setNavOpen(!navOpen)}
                className="h-screen w-full cursor-pointer bg-transparent backdrop-blur-sm fixed z-20"
              ></div>
              <motion.div
                exit={{ width: 0, opacity: 0, transition: { duration: 0.6 } }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.9 },
                }}
                initial={{ opacity: 0 }}
                className=" sm:w-1/3 w-full fixed bg-tertiary-0 z-40"
              >
                {" "}
                <MobileSidebar />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {!isConnected && (
          <GuestLayout>
            <div className="flex w-full flex-col item-center py-10 justify-center text-center gap-6 min-h-[350px]">
              <div className="flex justify-center w-full">
                <FileIcon />
              </div>
              <p className="mx-auto text-neutral-6 w-4/5">
                Connect your wallet to start saving.
              </p>

              <div className="flex justify-center gap-6">
                <ConnectButton showBalance={false} />
              </div>
            </div>
          </GuestLayout>
        )}

        {isLoading && isConnected && <OverviewLoader />}

        {error && isConnected && (
          <div className="flex w-4/5 flex-col my-auto text-center gap-6">
            <div className="flex justify-center w-full">
              <FileIcon />
            </div>
            {error && (
              <p className="mx-auto text-positive-7 w-2/5">
                Error: {error.message}
              </p>
            )}
          </div>
        )}

        {isAddressValid && isConnected && (
          <div className="w-4/5 flex flex-col">
            {/* Balances */}
            <Balances />

            {/* history and token */}
            <section className="w-full m-h-screen w-4/4   px-6 py-10">
              <div className="flex gap-4 w-full">
                <div className="w-3/5 flex flex-col gap-4">
                  <p className="font-semibold">Recent activities</p>

                  <div className="w-full flex flex-col overflow-y-scroll rounded-lg bg-[#1B1B1B] h-[350px]">
                    {fetching && <ActivityLoader />}

                    {!activitiesData && !fetching && (
                      <div className="p-6 w-full">
                        <p className="text-positive-7 text-center">
                          error fetching activity
                        </p>
                      </div>
                    )}

                    {activitiesData !== undefined &&
                      Object.values(activitiesData).every(
                        (arr) =>
                          Array.isArray(arr) && (arr as unknown[]).length === 0
                      ) &&
                      !fetching && (
                        <div className="flex w-full flex-col item-center justify-center text-center gap-6 pt-10">
                          <div className="flex justify-center w-full">
                            <FileIcon />
                          </div>
                          <p className="mx-auto text-neutral-6 w-2/5">
                            All activities will appear here
                          </p>
                          <button
                            className={`mx-auto mt-10 flex gap-2 items-center font-semibold  justify-center rounded-md bg-primary-0 text-neutral-3  py-4 px-12 ${
                              fetching ? "cursor-not-allowed" : "cursor-pointer"
                            }`}
                            disabled={fetching}
                            onClick={() => refreshActivities()}
                          >
                            {fetching ? "Loading..." : "Refresh"}
                          </button>
                        </div>
                      )}

                    <table className="min-w-full bg-[#1B1B1B] border-b border-tertiary-5">
                      <thead className=""></thead>
                      <tbody>
                        {loading && <SavingListLoader />}

                        {savings.map((saving, index) => (
                          <tr
                            key={index}
                            className="hover:bg-tertiary-4 transition-all ease-in-out py-[23px]"
                          >
                            {/* <td className="border-b border-tertiary-5 text-center">
                              <Link
                                href={`/view-save?id=${saving.id}&datecreated=${saving.date}&period=${saving.lockPeriod}`}
                                className="inline-block px-2 py-[23px] w-full"
                              >
                                #{index + 1}
                              </Link>
                            </td> */}

                            <td className="border-b border-tertiary-5 text-center">
                              <Link
                                href={`/view-save?id=${saving.id}&datecreated=${saving.date}&period=${saving.lockPeriod}`}
                                className="inline-block px-2 py-[23px] w-full"
                              >
                                <div className="flex flex-grow gap-4">
                                  <WalletIconPlain />
                                  <div className="flex flex-col gap-1 ">
                                    <p>
                                      <b>
                                        {/* {ethers.utils.parseBytes32String(
                                      saving.name
                                    )} */}
                                        {Web3.utils.hexToUtf8(saving.name)}
                                      </b>{" "}
                                      Save created
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </td>

                            <td className="border-b border-tertiary-5 text-center">
                              <Link
                                href={`/view-save?id=${saving.id}&datecreated=${saving.date}&period=${saving.lockPeriod}`}
                                className="inline-block px-2 py-[23px] w-full"
                              >
                                $
                                <NumericFormat
                                  thousandSeparator
                                  displayType="text"
                                  value={web3.utils.fromWei(
                                    saving.totalDepositInUSD,
                                    "ether"
                                  )}
                                  decimalScale={2}
                                  fixedDecimalScale={
                                    saving.totalDepositInUSD % 1 === 0
                                      ? true
                                      : false
                                  }
                                />
                              </Link>
                            </td>

                            <td className="border-b border-tertiary-5 text-center">
                              <Link
                                href={`/view-save?id=${saving.id}&datecreated=${saving.date}&period=${saving.lockPeriod}`}
                                className="inline-block px-2 py-[23px] w-full"
                              >
                                <div className="flex flex-grow gap-2 py-1 px-3 items-center justify-center bg-tertiary-7 rounded-xl">
                                  <Circle />
                                  <p>Successful</p>
                                </div>
                              </Link>
                            </td>

                            <td className="border-b border-tertiary-5 text-center">
                              <Link
                                href={`/view-save?id=${saving.id}&datecreated=${saving.date}&period=${saving.lockPeriod}`}
                                className="inline-block px-2 py-[23px] w-full"
                              >
                                Fixed
                              </Link>
                            </td>

                            <td className="border-b border-tertiary-5 text-center">
                              <Link
                                href={`/view-save?id=${saving.id}&datecreated=${saving.date}&period=${saving.lockPeriod}`}
                                className="inline-block px-2 py-[23px] w-full"
                              >
                                {toFormattedDate(saving.date)}
                              </Link>
                            </td>
                          </tr>
                        ))}
                        {activitiesData !== undefined &&
                          activitiesData.savingsContractCreateds[0] && (
                            <tr className="hover:bg-tertiary-4 transition-all ease-in-out py-[23px]">
                              {/* <td className="border-b border-tertiary-5 text-center">
                                <Link
                                  href={`https://${chainUrl}/address/${
                                    activitiesData.savingsContractCreateds[0]
                                      .savingsContract
                                  }`}
                                  className="inline-block px-2 py-[23px] w-full"
                                >
                                  #{savings.length + 1}
                                </Link>
                              </td> */}

                              <td className="border-b border-tertiary-5 text-center">
                                <Link
                                  href={`https://${chainUrl}/address/${activitiesData.savingsContractCreateds[0].savingsContract}`}
                                  className="inline-block px-2 py-[23px] w-full"
                                >
                                  <div className="flex flex-grow gap-4">
                                    <WalletIconPlain />
                                    <div className="flex flex-col gap-1 ">
                                      <p>
                                        <b>Savings account created</b>{" "}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              </td>

                              <td className="border-b border-tertiary-5 text-center">
                                <Link
                                  href={`https://${chainUrl}/address/${activitiesData.savingsContractCreateds[0].savingsContract}`}
                                  className="inline-block px-2 py-[23px] w-full"
                                >
                                  -
                                </Link>
                              </td>

                              <td className="border-b border-tertiary-5 text-center">
                                <Link
                                  href={`https://${chainUrl}/address/${activitiesData.savingsContractCreateds[0].savingsContract}`}
                                  className="inline-block px-2 py-[23px] w-full"
                                >
                                  <div className="flex flex-grow gap-2 py-1 px-3 items-center justify-center bg-tertiary-7 rounded-xl">
                                    <Circle />
                                    <p>Successful</p>
                                  </div>
                                </Link>
                              </td>

                              <td className="border-b border-tertiary-5 text-center">
                                <Link
                                  href={`https://${chainUrl}/address/${activitiesData.savingsContractCreateds[0].savingsContract}`}
                                  className="inline-block px-2 py-[23px] w-full"
                                >
                                  -
                                </Link>
                              </td>

                              <td className="border-b border-tertiary-5 text-center">
                                <Link
                                  href={`https://${chainUrl}/address/${activitiesData.savingsContractCreateds[0].savingsContract}`}
                                  className="inline-block px-2 py-[23px] w-full"
                                >
                                  {toFormattedDate(
                                    activitiesData.savingsContractCreateds[0]
                                      .date
                                  )}{" "}
                                </Link>
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <Assets />
              </div>
            </section>
          </div>
        )}

        {!isAddressValid && isConnected && !error && !isLoading && (
          <div className="flex w-4/5 flex-col item-center justify-center text-center gap-6">
            <div className="flex justify-center w-full">
              <FileIcon />
            </div>

            <p className="text-neutral-3 text-xl font-medium">
              No savings Account found
            </p>
            <p className="mx-auto text-neutral-6 w-2/5">
              You don’t have a savings account yet.
            </p>
            <button
              className={`mx-auto mt-10 flex gap-2 items-center font-semibold  justify-center rounded-md bg-primary-0 text-white  py-4 px-12 ${
                !Boolean(createSavingsAccount?.request)
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={!Boolean(createSavingsAccount?.request)}
              onClick={() => writeContract(createSavingsAccount!.request)}
            >
              {isPending ? "Loading..." : "create account"}
            </button>
          </div>
        )}

        {fetching}
        {activitiesError}
        {/* {activitiesData } */}
      </section>
    </main>
  );
}
