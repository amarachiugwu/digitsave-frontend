"use client";

import Link from "next/link";
import Header from "@/components/front/Header";

import FaqData from "@/components/front/FaqData";
import Footer from "@/components/front/Footer";
import Learn from "@/components/front/Learn";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full min-h-full font-swiss">
        {/* Hero Section */}

        <div
          id="Hero"
          className="w-full font-swiss text-neutral-3 sm:pt-28 py-16 sm:px-20bg-cover bg-[url('/images/learn-hero-bg.png')]"
        >
          <div className="text-center w-full lg:w-[60%] mx-auto">
            <h2 className="text-white font-bold text-xl sm:text-3xl lg:text-4xl leading-relaxed mx-auto lg:w-[60%]">
              Learn and grow with web3
            </h2>
            <p className=" pt-2 text-sm font-thin sm:text-base mt-4 mx-auto lg:w-[70%] text-neutral-3 leading-loose">
              An easy-to-follow education guide that teach you how web3 works
              and how to use our platform to create a savings account and create
              savings
            </p>
          </div>
        </div>

        {/* Learn Section */}
        <div
          id="Learn"
          className="w-full font-swiss text-neutral-3  pt-8 sm:px-20 "
        >
          <Learn />
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
