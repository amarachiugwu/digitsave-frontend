"use client";

import Link from "next/link";
import { CloseIcon, HamburgerIcon } from "../../icon.js";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAccount } from "wagmi";
import { useAccountEffect } from 'wagmi'


import Image from "next/image.js";

export default function Header({ navOpen, setNavOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();  
  // const { isDisconnected } = useAccount();

  // useEffect(() => {
  //   if (isDisconnected) {
  //     router.push('/');
  //   }
  // }, [isDisconnected, router]);

  useAccountEffect({
    onDisconnect() {
      router.push('/');
    },
  })

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header className="relative w-full h-20 z-50">
      <div
        className={` w-full fixed top-0 left-0 ${scrolled ? "bg-[#008888]" : ""}  transition-all duration-500 ease-in-out`}
      >
        <div className="flex justify-between items-center h-20 px-10 md:py-6 lg:px-20">
          <Link href={"/"}>
            <Image
              src="/logo.png"
              alt="logo"
              className="md:w-44 w-32"
              width={100}
              height={100}
            />
          </Link>
          <div className="flex gap-4">
            <ConnectButton showBalance={false} />
            <button className="lg:hidden" onClick={() => setNavOpen(!navOpen)}>
              {navOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
