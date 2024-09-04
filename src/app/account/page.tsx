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
import { useContractAddresses } from "@/constants/index";
import { FactoryAbi } from "@/abis/FactoryContractAbi";
import {
  Circle,
  FileIcon,
  FilterIcon,
  SearchIcon,
  WalletIconPlain,
} from "@/icon";
import { isValidAddress } from "@/utils/validateAddress";
import FullPageLoader from "@/components/dashboard/Loaders/FullPageLoader";
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
import SavingListLoader from "@/components/dashboard/Loaders/SavingListLoader";
import { NumericFormat } from "react-number-format";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const { isDisconnected } = useAccount();

  useEffect(() => {
    if (isDisconnected) {
      router.push("/dashboard");
    }
  }, [isDisconnected, router]);

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
        <div className="w-1/5">
          <Sidebar />
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
        <div className="w-full flex flex-col gap-4">
          {isLoading && isConnected && <FullPageLoader />}

          <div className="w-full flex flex-col">
            <div className="p-6 pb-0">
              <h1 className="font-bold text-2xl">Account</h1>
              <p className="text-tertiary-4 font-medium text-xl">
                Manage your savings account here.
              </p>
            </div>
            {/* history  */}
            <section className="w-full m-h-screen w-4/4 px-6  h-[500px] overflow-y-scroll py-10">
              <div className="flex gap-4 w-full">
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full flex flex-col  rounded-lg  ">
                    <div className="w-full flex flex-col gap-4"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
