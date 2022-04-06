import type { OnboardAPI } from "@web3-onboard/core";
import { useConnectWallet, useWallets } from "@web3-onboard/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Header } from "../components";
import { initOnboard } from "../services";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const connectedWallets = useWallets();
  const [onboard, setOnboard] = useState<OnboardAPI>();

  useEffect(() => {
    setOnboard(initOnboard);
  }, []);

  useEffect(() => {
    if (!connectedWallets.length) return;

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    );
    window.localStorage.setItem(
      "connectedWallets",
      JSON.stringify(connectedWalletsLabelArray)
    );
  }, [connectedWallets]);

  useEffect(() => {
    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem("connectedWallets")
    );

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({ autoSelect: previouslyConnectedWallets[0] });
      }
      setWalletFromLocalStorage();
    }
  }, [onboard, connect]);

  return (
    <div className="bg-black font-sans text-slate-100/[0.6]">
      <QueryClientProvider client={queryClient}>
        <div>
          <Header disconnect={disconnect} connect={connect} />
          <Component wallet={wallet} {...pageProps} />
          <Toaster />
        </div>
      </QueryClientProvider>
    </div>
  );
}

export default MyApp;
