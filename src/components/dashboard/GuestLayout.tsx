import React, { type ReactNode } from "react";
import Assets from "./Assets";
import GuestBalance from "./GuestBalance";

export default function GuestLayout(props: { children: ReactNode }) {
  return (
    <div className="lg:w-4/5 w-full flex flex-col">
      {/* Balances */}
      <GuestBalance />

      {/* info and token */}
      {
        <section className="w-full m-h-screen w-4/4 px-6 py-0">
          <div className="flex gap-4 w-full">
            <div className="w-3/5 flex flex-col gap-4">
              <p className="font-semibold">Information</p>

              <div className="w-full flex flex-col rounded-lg bg-[#2B2B2B80]">
                {props.children}
              </div>
            </div>

            <Assets />
          </div>
        </section>
      }
    </div>
  );
}
