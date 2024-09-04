"use client";

import Link from "next/link";
import { CloseIcon, HamburgerIcon } from "@/icon.js";
import { Link as ScrollLink } from "react-scroll";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image.js";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

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
    <header className="relative w-full h-20">
      <div
        className={`w-full z-50 fixed top-0 left-0 ${
          scrolled ? "bg-[#008888]" : ""
        } transition-all duration-500 ease-in-out`}
      >
        <div
          className={`flex justify-between items-center h-20 px-6 sm:px-10 md:py-6 md:px-20 border-b border-tertiary-6 lg:border-none`}
        >
          <Link href={"/"}>
            <Image
              src="/logo.png"
              alt="logo"
              className="md:w-44 w-32"
              width={100}
              height={100}
            />
          </Link>

          {/* desktop nav */}
          <nav className="hidden lg:flex gap-12 items-center">
            <ul className="flex gap-8 text-neutral-3">
              <Link
                href="/learn"
                className="cursor-pointer hover:text-white transition-colors duration-300"
              >
                Learn
              </Link>

              <ScrollLink
                to="roadmap"
                spy={true}
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-white transition-colors duration-300"
              >
                Roadmap
              </ScrollLink>

              <ScrollLink
                to="faq"
                spy={true}
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-white transition-colors duration-300"
              >
                FAQ
              </ScrollLink>
            </ul>

            <div className="flex gap-6">
              <Link
                href="/dashboard"
                className={`text-center py-3 px-8 rounded-lg bg-primary-0 text-neutral-1 transition-all duration-100 ${
                  scrolled
                    ? "bg-transparent border border-neutral-1"
                    : "bg-btn-gradient-0"
                } font-semibold`}
              >
                Launch App
              </Link>
            </div>
          </nav>

          {/* Mobile Nav menu */}
          <div className="lg:hidden flex gap-6">
            <Link
              href="/dashboard"
              className={`text-center py-3 px-4 rounded-lg text-xs bg-primary-0 text-neutral-1 transition-all duration-100 ${
                scrolled
                  ? "bg-transparent border border-neutral-1"
                  : "bg-btn-gradient-0"
              } font-semibold`}
            >
              Launch App
            </Link>
            <button onClick={() => setNavOpen(!navOpen)}>
              {navOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Animated Mobile Navigation Menu */}
      <AnimatePresence>
        {navOpen && (
          <div className="">
            <div
              onClick={() => setNavOpen(false)}
              className="h-screen w-full p-0 cursor-pointer bg-transparent backdrop-blur-sm fixed z-10"
            ></div>

            <motion.div
              exit={{ height: 0, opacity: 0, transition: { duration: 0.6 } }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: { duration: 0.9 },
              }}
              initial={{ height: 0 }}
              className={`lg:hidden z-50 top-20 fixed overflow-hidden right-0 flex-col gap-4 items-left bg-tertiary-0 w-full px-6 py-6 `}
            >
              <ul className="flex z-50 flex-col gap-2 text-neutral-3">
                <Link
                  href="/learn"
                  className="cursor-pointer hover:text-white hover:bg-[#2B2B2B4D] py-4 px-4 transition-colors duration-300"
                >
                  Learn
                </Link>

                <ScrollLink
                  to="roadmap"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:text-white  hover:bg-[#2B2B2B4D] py-4 px-4 transition-colors duration-300"
                >
                  Roadmap
                </ScrollLink>

                <ScrollLink
                  to="faq"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:text-white  hover:bg-[#2B2B2B4D] py-4 px-4 transition-colors duration-300"
                >
                  FAQ
                </ScrollLink>
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
