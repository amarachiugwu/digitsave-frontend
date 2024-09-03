"use client";

import {
  ActivitiesIcon,
  DisconnectIcon,
  OverviewIcon,
  LearnIcon,
  SaveIcon,
  AccountIcon,
} from "@/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { useAccount, useDisconnect } from "wagmi";

const ListItem = ({ path, label, icon: Icon, otherPaths }) => {
  const pathname = usePathname();
  const additionalPaths = otherPaths ? otherPaths.split(",") : [];
  const isActive = pathname === path || additionalPaths.includes(pathname);

  return (
    <Link
      href={path}
      className={`w-full lg:pl-12 pl-4 flex py-3 px-4 gap-2 rounded-md ${isActive ? "bg-[#2B2B2BE5]" : ""}`}
    >
      <Icon color={isActive ? "white" : "currentColor"} />
      <span className={isActive ? "text-white" : "text-current"}>{label}</span>
    </Link>
  );
};

export default function MobileSidebar() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return (
    <>
      <div className="bg-blend-overlay lg:hidden w-max h-full"></div>
      <div className="min-h-screen flex flex-col w-full border-r border-tertiary-6 px-6">
        <ul className="w-full flex flex-col gap-6 text-neutral-6 py-16">
          <ListItem path="/dashboard" label="Overview" icon={OverviewIcon} />
          <ListItem
            path="/save"
            otherPaths="/create-save"
            label="Save"
            icon={SaveIcon}
          />
          <ListItem path="/learn" label="Learn" icon={LearnIcon} />
          <ListItem
            path="/activities"
            label="Activities"
            icon={ActivitiesIcon}
          />
          <ListItem path="/account" label="Account" icon={AccountIcon} />
        </ul>

        {isConnected && (
          <div className=" py-16  border-t border-tertiary-6">
            <div
              onClick={handleDisconnect}
              className={`w-full pl-12 flex py-3 px-4 gap-2 rounded-md  cursor-pointer group`}
            >
              <DisconnectIcon className="text-[#898989] group-hover:text-white" />
              <span className={"text-neutral-6 group-hover:text-white"}>
                Disconnect
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
