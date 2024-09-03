"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";
import Header from "@/components/front/Header";
import {
  CryptoAssetsIcon,
  CustomizedIcon,
  DashedLine,
  DiverseIcon,
  FundDistributionIcon,
  PerformanceIcon,
  SecurityIcon,
  WalletIcon,
} from "@/icon";
import FaqData from "@/components/front/FaqData";
import Footer from "@/components/front/Footer";
import Roadmap from "@/components/front/Roadmap";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full min-h-full">
        {/* Hero Section */}

        <div className="md:px-10 lg:px-20 px-6 pb-4 flex flex-col lg:flex-row w-full lg:gap-24 md:gap-10 mt-10 sm:mt-12 lg:py-10 items-center">
          <div className="lg:w-1/2 w-full   font-swiss md:text-left xl:pr-20 ">
            <h1 className="font-bold text-neutral-2 text-center lg:text-left  lg:text-5xl sm:text-3xl text-[1.5rem] leading-10 sm:leading-relaxed">
              Savings that helps you build wealth
            </h1>

            <p className="text-neutral-2 font-light lg:text-base sm:text-sm text-[0.88rem] text-center  lg:text-justify py-6 ">
              Our app helps you save money by securely locking your crypto
              assets for a set period, ensuring you stay on track with your
              financial goals.
            </p>

            <Link
              href="/dashboard"
              className=" text-center py-4 px-10 m-5 mb-10 lg:mb-0 lg:mt-10 block rounded-lg bg-primary-0 text-neutral-1 bg-custom text-sm md:text-md font-bold w-[200px] mx-auto lg:mx-0"
            >
              Launch App
            </Link>
          </div>

          <div className="lg:w-1/2 w-[80%] mx-auto md:pb-0 pb-10 pt-6  relative ">
            <Image
              className=""
              width={542}
              height={482}
              src="/images/hero-image.png"
              alt="Hero Image"
            />

            <Image
              className="absolute md:top-[60%] md:left-[-20%] sm:top-[47%] top-[50%] left-[5%] sm:w-[261px] w-[200px] sm:h-[85px] h-[60px]"
              width={261}
              height={85}
              src="/images/save-ding.png"
              alt="Hero Image"
            />
          </div>
        </div>

        {/* stats */}

        <div className="sm:py-24 py-10 bg-[url('/images/stats-bg.png')] bg-cover lg:bg-center sm:px-20 px-6 w-full font-swiss">
          <div className="w-full flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/3 w-full text-center py-6">
              <strong className="font-bold sm:text-5xl text-2xl text-white leading-relaxed">
                $145B
              </strong>
              <p className="font-light text-neutral-2 text-sm sm:text-base leading-relaxed pb-3">
                Total Value Locked
              </p>
            </div>

            <div className="lg:w-1/3 w-full text-center lg:border-y-0 lg:border-x border-y py-3">
              <strong className="font-bold sm:text-5xl text-2xl text-white leading-relaxed">
                235
              </strong>
              <p className="font-light text-neutral-2 text-sm sm:text-base leading-relaxed pb-3">
                Crypto assets Available
              </p>
            </div>

            <div className="lg:w-1/3 w-full text-center py-6">
              <strong className="font-bold text-2xl sm:text-5xl text-white leading-relaxed">
                89
              </strong>
              <p className="font-light text-neutral-2 text-sm sm:text-base leading-relaxed pb-3">
                Countries supported
              </p>
            </div>
          </div>
        </div>

        {/* How to */}
        <div className="sm:px-20 px-6 flex w-full gap-24 pt-24 items-center bg-[url('/images/how-to-bg.png')]">
          <div className="lg:w-1/2 w-full font-swiss">
            <h2 className="font-bold text-neutral-2 text-3xl text-center md:text-left leading-relaxed">
              It only takes 5 minutes...
            </h2>

            <div className="flex flex-col gap-10 sm:gap-0 w-full text-neutral-3 my-14">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col items-center">
                  <WalletIcon />
                  <div className="hidden sm:block">
                    <DashedLine />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="font-bold text-lg sm:text-xl leading-loose mb-2 sm:mb-6">
                    Connect Your wallet
                  </h2>
                  <p className="text-sm sm:text-base">
                    Easily access and manage your assets effortlessly with just
                    a few clicks by connecting your wallet
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col items-center">
                  <CryptoAssetsIcon />
                  <div className="hidden sm:block">
                    <DashedLine />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="font-bold text-lg sm:text-xl leading-loose mb-2 sm:mb-6">
                    Select crypto assests
                  </h2>
                  <p className="text-sm sm:text-base">
                    Whether you are saving for the short term or looking to grow
                    your assets over a longer period, our Safe Lock feature
                    offers flexibility and security.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col items-center">
                  <FundDistributionIcon />
                  <div className="hidden sm:block">
                    <DashedLine />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="font-bold text-lg sm:text-xl leading-loose mb-2 sm:mb-6">
                    Fund Distribution
                  </h2>
                  <p className="text-sm sm:text-base">
                    Add as many assets as you&lsquo;d like and allocate funds to
                    each lock according to your saving goals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/2 hidden lg:block">
            <Image
              className=""
              width={542}
              height={482}
              src="/images/howto-image.png"
              alt="Howto Image"
            />
          </div>
        </div>

        {/* About */}

        <div
          id="about"
          className="w-full font-swiss text-neutral-3 sm:pt-28 pt-16 sm:px-20 px-6"
        >
          <div className="text-center w-full lg:w-[70%] mx-auto">
            <h2 className="font-bold text-xl sm:text-3xl leading-relaxed">
              Why Choose Digitsave
            </h2>
            <p className="leading-relaxed pt-2 text-sm sm:text-base">
              We provides a transparent, secure, customised and flexiblle
              savings system, which supports multiple crypto assets
            </p>
          </div>

          <div className="grid  lg:grid-cols-2 grid-cols-1 gap-5 pt-20">
            <div className="sm:p-14 p-5 text-center sm:text-left flex flex-col items-center md:items-start leading-relaxed bg-[#99999900] border  rounded-3xl">
              <SecurityIcon />
              <h2 className="font-bold sm:text-2xl text-xl  leading-relaxed py-8">
                Blockchain Security
              </h2>
              <p>
                We leverages advanced blockchain technology to provide top-notch
                security, ensuring your savings are protected from fraud and
                unauthorized access.
              </p>
            </div>
            <div className="sm:p-14 p-5 text-center sm:text-left flex flex-col items-center md:items-start leading-relaxed bg-[#99999900] border  rounded-3xl">
              <PerformanceIcon />
              <h2 className="font-bold sm:text-2xl text-xl  leading-relaxed py-8">
                Real Time Performance
              </h2>
              <p>
                Track the growth of your crypto portfolio and assets in
                real-time. Monitor your assets performance performance and make
                informed decisions.
              </p>
            </div>
            <div className="sm:p-14 p-5 text-center sm:text-left flex flex-col items-center md:items-start leading-relaxed bg-[#99999900] border  rounded-3xl">
              <DiverseIcon />
              <h2 className="font-bold sm:text-2xl text-xl  leading-relaxed py-8">
                Diverse Token Options
              </h2>
              <p>
                Digitsave upports a wide range of cryptocurrencies, allowing you
                to diversify your savings and choose the tokens that best meet
                your financial goals.
              </p>
            </div>
            <div className="sm:p-14 p-5 text-center sm:text-left flex flex-col items-center md:items-start leading-relaxed bg-[#99999900] border  rounded-3xl">
              <CustomizedIcon />
              <h2 className="font-bold sm:text-2xl text-xl  leading-relaxed py-8">
                Customized Savings Plans
              </h2>
              <p>
                Tailor your savings strategy with Digitsave&lsquo;s customizable
                plans, giving you the flexibility to set goals and save
                according to your unique financial needs.
              </p>
            </div>
          </div>
        </div>

        {/* Assets */}
        <div
          id="assets"
          className="sm:px-20 flex flex-col justify-between lg:flex-row w-full md:gap-4 pt-28 items-center"
        >
          <div className="lg:w-1/2 w-full text-center lg:text-start font-swiss">
            <h1 className="font-bold text-neutral-2 md:text-3xl px-6 sm:px-10 lg:px-0 text-2xl leading-relaxed">
              Create flexible savings portfolios with best crypto assets{" "}
            </h1>
            <p className="text-neutral-2 px-6 sm:px-10 lg:px-0 font-light text-sm sm:text-base text-center lg:text-left lg-text-justify py-6 sm:mb-6 mb-3">
              Build flexible savings portfolios and maximize crypto assets meet
              your financial goal
            </p>

            <div className="w-full hidden md:flex items-center sm:items-start">
              <Link
                href="/dashboard"
                className=" text-center py-4 px-10 mt-5 inline-block rounded-lg bg-primary-0 text-neutral-1 bg-custom text-lg lg:text-xl font-bold  w-[250px] mx-auto lg:mx-0"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 w-full hidden md:block">
            <Image
              className="w-full mx-auto"
              width={542}
              height={482}
              src="/images/flexibility.png"
              alt="Supported assets"
            />
          </div>
          <div className="block md:hidden w-full">
            <Image
              className="w-full mx-auto"
              width={542}
              height={482}
              src="/images/mobile-flexibility.png"
              alt="Supported assets"
            />
          </div>
          <div className="w-full px-6 sm:px-10 flex md:hidden justify-center">
            <Link
              href="/dashboard"
              className="text-center w-full py-4 px-6 mt-3 inline-block rounded-lg bg-primary-0 text-neutral-1 bg-custom text-sm md:text-xl font-bold"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Roadmap */}
        <div
          id="roadmap"
          className="md:w-[80%] w-[100%] px-6 sm:px-10 md:px-0 mx-auto pt-24 text-neutral-2 "
        >
          <h2 className="font-bold text-2xl md:text-4xl sm:text-xl text-center font-swiss leading-loose py-4">
            Roadmap
          </h2>
          <Roadmap />
        </div>

        {/* FAQ */}
        <div
          id="faq"
          className="md:w-[70%] w-[100%] px-6 sm:px-10 md:px-0 mx-auto pt-24 text-neutral-2 "
        >
          <h2 className="font-bold text-2xl md:text-4xl sm:text-xl text-center leading-loose py-4">
            We answered all your money questions
          </h2>
          <FaqData />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
