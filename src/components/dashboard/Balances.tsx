import { EyeIcon } from "@/icon";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { getEthersProvider } from "@/ethersProvider";
import { config } from "@/wagmi";
import { DigitsaveAcctAbi } from "@/abis/DigitsaveAccountAbi";
import { FactoryAbi } from "@/abis/FactoryContractAbi";
import { factoryContractAddrs } from "@/constants";
import { ethers } from "ethers";
import { NumericFormat } from "react-number-format";

export default function Balances() {
//   const pathname = usePathname();
  const { address, chainId } = useAccount();
  const [totalAmountInUsd, setTotalAmountInUsd] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [nextSavingId, setNextSavingId] = useState<number | null>(null);
  const provider = getEthersProvider(config);

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

  useEffect(() => {
    if (nextSavingIdData) {
      setNextSavingId(parseInt(nextSavingIdData.toString()));
    }
  }, [nextSavingIdData]);

  useEffect(() => {
    if (nextSavingId !== null) {
      const calculateBalanceInUsd = async () => {
        try {
          let cumulativeTotal = 0;

          for (let i = 1; i < nextSavingId; i++) {
            const contract = new ethers.Contract(
              savingsAcct,
              DigitsaveAcctAbi,
              provider
            );

            const savingData = await contract.savings(i);

            // Convert BigNumber to a number, assuming 18 decimal places
            const totalDepositInUSD = parseFloat(
              ethers.utils.formatUnits(savingData.totalDepositInUSD, 18)
            );
            cumulativeTotal += totalDepositInUSD;
          }

          // Update the state with the cumulative total
          setTotalAmountInUsd(cumulativeTotal);
        } catch (error) {
          console.error("Error fetching assets:", error);
        } finally {
          setLoading(false);
        }
      };

      calculateBalanceInUsd();
    }
  }, [nextSavingId, chainId]);
  return (
    <section className="w-full m-h-screen w-4/4 px-6 py-10">
      <div className="flex gap-4 w-full">
        <div className="w-3/5 flex flex-col gap-4 p-6 bg-center rounded-lg bg-[url('/images/stats-bg.png')]">
          <div className="flex gap-8 items-center">
            <span className="text-sm">Total Balance</span>
            <EyeIcon />
          </div>

          <p className="font-bold font-swiss text-4xl">
            $
            <NumericFormat
              thousandSeparator
              displayType="text"
              value={totalAmountInUsd}
              decimalScale={2}
              fixedDecimalScale={totalAmountInUsd % 1 === 0 ? true : false}
            />
          </p>

          <div className="flex justify-between item-center">
            <p className="text-xs"></p>
            {/* {pathname == "/dashboard" && (
              <Link
                href="/save"
                className={`flex gap-2 items-center justify-center rounded-lg bg-secondry-6 text-tertiary-7 font-semibold w-44 py-2 px-5 `}
              >
                start saving
              </Link>
            )} */}

            {/* {pathname == "/save" && ( */}
              <Link
                href="/create-save"
                className={`flex gap-2 items-center justify-center rounded-lg bg-secondry-6 text-tertiary-7 font-semibold w-44 py-2 px-5 `}
              >
                create saving
              </Link>
            {/* )} */}
          </div>
        </div>

        <div className="w-2/5 p-6 bg-[#2B2B2B80] rounded-lg">
          <div className="flex flex-col gap-4">
            <span className="text-sm text-neutral-6">Intrest Balance</span>
            <p className="font-bold font-swiss text-4xl text-neutral-6">
              $0.00
            </p>
            {/* <span className='pt-2 text-neutral-3'>Feature coming soon</span> */}
          </div>
        </div>
      </div>
    </section>
  );
}
