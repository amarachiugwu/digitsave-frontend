"use client";

import { InfoIcon, WarningIcon } from "@/icon";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { format, addMonths } from "date-fns";
import SubmitBtn from "@/components/dashboard/SubmitBtn";
import { factoryContractAddrs } from "@/constants";
import { FactoryAbi } from "@/abis/FactoryContractAbi";
import { DigitsaveAcctAbi } from "@/abis/DigitsaveAccountAbi";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  type BaseError,
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ethers } from "ethers";
import Modal from "./Modal";
import Web3 from "web3";

type FormModel = {
  name: string;
  period: number;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name of your save is required").max(50),
  period: Yup.number().required("Lock period is required"),
});

export default function CreateSaveForm() {
  const [lockPeriod, setLockPeriod] = useState("");
  const [displayText, setDisplayText] = useState("");
  const { address } = useAccount();
  const [nextSavingId, setNextSavingId] = useState<number | null>(null);
  const web3 = new Web3();

  useEffect(() => {
    if (lockPeriod === "") {
      setDisplayText("");
      return;
    }

    const value = Number(lockPeriod);
    if (value >= 1) {
      const startDate = new Date();
      const endDate = addMonths(startDate, value);
      const formattedStartDate = format(startDate, "MMMM dd yyyy");
      const formattedEndDate = format(endDate, "MMMM dd yyyy");
      setDisplayText(`${formattedStartDate} to ${formattedEndDate}`);
    }
  }, [lockPeriod]);

  const handleLockPeriodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value === "" || (Number(value) >= 1 && !isNaN(Number(value)))) {
      setLockPeriod(value);
    }
  };

  const { data: savingsAcct }: any = useReadContract({
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

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function submit(values: FormModel) {
    const name = values.name;
    const period = values.period;
    writeContract({
      address: savingsAcct,
      abi: DigitsaveAcctAbi,
      functionName: "createSaving",
      // args: [ethers.utils.formatBytes32String(name), period],
      args: [web3.utils.padRight(web3.utils.utf8ToHex(name), 64), period],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          period: 1,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          submit(values);
          setSubmitting(false);
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form className="w-full flex flex-col gap-6">
            <div className="flex gap-2 flex-col">
              <label htmlFor="name">Name of save</label>

              <Field
                type="text"
                id="name"
                name="name"
                className="outline-none w-full px-6 py-4 text-neutral-4 rounded-md bg-[#2B2B2B]"
                placeholder="eg : My rent"
              />
              {errors.name && touched.name ? (
                <div className="text-red-500">{errors.name}</div>
              ) : null}
            </div>

            <div className="flex gap-2 flex-col">
              <label htmlFor="period">Lock period</label>
              <div className="flex text-neutral-4 ">
                <Field
                  type="number"
                  id="period"
                  name="period"
                  value={lockPeriod}
                  onChange={handleLockPeriodChange}
                  min="1"
                  className="outline-none w-4/5 px-6 py-4 rounded-l bg-[#2B2B2B]"
                  placeholder="eg : 2"
                />
                {errors.period && touched.period ? (
                  <div className="text-red-500">{errors.period}</div>
                ) : null}
                <p className="w-1/5 px-6 py-4 text-right bg-[#2B2B2B] rounded-r">
                  {" "}
                  month(s)
                </p>
              </div>
              {displayText && (
                <div className=" mt-2 flex gap-2 p-2 w-full bg-[#42B0B01A] rounded-tr-xl rounded-bl-xl">
                  <InfoIcon />
                  <Link href="/learn" className="text-xs">
                    From {displayText}
                  </Link>
                </div>
              )}
            </div>

            <input required type="hidden" name="address" value={address} />

            <div className="flex gap-2 flex-col">
              <label htmlFor="type">Savings Type</label>
              <Field
                as="select"
                id="type"
                name="type"
                className="outline-none w-full px-6 py-4 text-neutral-4 rounded-md bg-[#2B2B2B]"
              >
                <option value="Fixed Saving">Fixed Saving</option>
                <option value="Fixed Saving" disabled>
                  Flexible Saving
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  coming soon
                </option>
              </Field>

              {/* {errors.type && touched.type ? (
              <div className="text-red-500">{errors.type}</div>
            ) : null} */}

              <div className=" mt-2 flex gap-2 p-2 w-full bg-[#FFEF9926] rounded-tr-xl rounded-bl-xl">
                <WarningIcon />
                <div className="flex flex-col gap-2 text-sm">
                  <h3 className="font-semibold">Important notice</h3>
                  <Link href="/learn" className="">
                    Funds locked in a fixed savings cannot be withdrawn until
                    due date.
                  </Link>
                </div>
              </div>
            </div>

            <SubmitBtn label="Create Savings" isSubmitting={isPending} />

            {/* {hash && <div>Transaction Hash: {hash}</div>} */}
            {/* {isConfirming && <div>Waiting for confirmation...</div>} */}
            {/* {isConfirmed && <div>Transaction confirmed.</div>} */}
            {error && (
              <div>
                Error: {(error as BaseError).shortMessage || error.message}
              </div>
            )}
          </Form>
        )}
      </Formik>

      {isPending && (
        <Modal
          status={
            <div className="flex justify-center mb-8">
              <div className="relative w-16 h-16 flex justify-center items-center">
                <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-ring"></div>
              </div>
            </div>
          }
          button={<></>}
          title="Creating savings"
          subtitle="This will only take a few seconds to complete"
        />
      )}

      {hash && (
        <Modal
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
          button={
            <Link
              href={`/view-save?id=${nextSavingId}`}
              className={`flex gap-2 items-center justify-center rounded-lg bg-primary-5 text-white mt-14 font-medium text-xl mx-auto w-44 py-4 px-5 `}
            >
              Next
            </Link>
          }
          title="Savings created"
          subtitle="You did it!!!, you can now add assets to your save."
        />
      )}
    </>
  );
}
