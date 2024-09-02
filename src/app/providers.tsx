"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/wagmi";
import {
  Client,
  Provider as UrqlProvider,
  cacheExchange,
  fetchExchange,
} from "urql";
import { WagmiProvider } from "wagmi";

const APIURL =
  "https://api.studio.thegraph.com/query/85604/digitsave/version/latest";

const client = new Client({
  url: APIURL,
  exchanges: [cacheExchange, fetchExchange],
});

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#008080",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
          modalSize="compact"
          appInfo={{
            appName: "DigitSave",
            learnMoreUrl: "https://digitsave.onrender.com/learn",
          }}
        >
          <UrqlProvider value={client}>{props.children}</UrqlProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
