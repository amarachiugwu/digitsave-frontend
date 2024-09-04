import Link from "next/link";
import React from "react";
import {
  GithubIcon,
  LinkedinIcon,
  LogoIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../../icon";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";

export default function Footer() {
  return (
    <section className="w-full sm:px-10 px-6 md:px-20 pt-28">
      <div className="flex w-full justify-between mb-8 items-center">
        <div className="flex flex-col gap-8 ">
          <Link href={"/"}>
            <Image
              src="/logo.png"
              alt="logo"
              className="md:w-44 w-32"
              width={100}
              height={100}
            />
          </Link>

          <nav className=" md:flex gap-6 items-center">
            <ul className="sm:flex grid grid-cols-2 gap-8 text-neutral-3">
              <ScrollLink
                to="/learn"
                spy={true}
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-white transition-colors duration-300"
              >
                Learn
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

              <ScrollLink
                to="roadmap"
                spy={true}
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-white transition-colors duration-300"
              >
                Roadmap
              </ScrollLink>
            </ul>
          </nav>
        </div>
      </div>

      <hr />

      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-8 text-neutral-3 mt-8 pb-12">
        <p>&copy; DigitSave. All right reserved</p>

        <nav className=" md:flex gap-4 items-center">
          <ul className="flex gap-8">
            <li>
              <a target="_blank" href={"https://x.com/digitsave?s=21"}>
                <TwitterIcon />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href={"https://github.com/orgs/DigitSave/repositories"}
              >
                <GithubIcon />
              </a>
            </li>
            <li>
              <a target="_blank" href={"https://www.youtube.com/@digitsave"}>
                <YoutubeIcon />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href={"https://www.linkedin.com/company/digitsave/"}
              >
                <LinkedinIcon />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
