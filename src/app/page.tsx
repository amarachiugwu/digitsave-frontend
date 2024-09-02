"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";
import Header from "@/components/front/Header";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <>
      <Header />
    </>
  );
}
