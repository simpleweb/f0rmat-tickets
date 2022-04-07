import { ExternalLinkIcon } from "@heroicons/react/outline";
import {
  ConnectOptions,
  DisconnectOptions,
  WalletState,
} from "@web3-onboard/core";
import { useSetChain, useConnectWallet } from "@web3-onboard/react";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";
import { Button } from "../components";
import { BLOCK_EXPLORER_URL, switchChain } from "../helpers";
import { useRouter } from "next/router";
export default function Header() {
  const { t } = useTranslation("common");
  const [{ chains, connectedChain }, setChain] = useSetChain();
  const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
  const [{ wallet }, connect, disconnect] = useConnectWallet();

  async function handleConnect() {
    await connect({});
  }

  useEffect(() => {
    if (wallet && CHAIN_ID) {
      switchChain(setChain, CHAIN_ID);
    }
  }, [wallet, connectedChain]);

  async function handleDisconnect() {
    if (wallet) {
      await disconnect(wallet);
    }
  }
  const router = useRouter();

  return (
    <header className="pb-3">
      <div className="flex justify-between">
        {router.route == "/" ? (
          <div>
            <Button
              onClick={() => {
                router.push("/ticket/create");
              }}
            >
              Create Tickets
            </Button>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => {
                router.push("/");
              }}
            >
              View All Tickets
            </Button>
          </div>
        )}
        <div className="flex items-center">
          {wallet?.accounts[0].address ? (
            <>
              <a
                target="_blank"
                rel="noreferrer"
                href={BLOCK_EXPLORER_URL(wallet?.accounts[0]?.address)}
              >
                <div className="mx-2 flex hover:text-indigo-800">
                  <span>
                    {wallet?.accounts[0]?.address.slice(0, 4)}...
                    {wallet?.accounts[0]?.address.slice(-4)}
                  </span>
                  <ExternalLinkIcon className="h-6 w-6" />
                </div>
              </a>
              <Button onClick={handleDisconnect}>
                {t("wallet.disconnect_button")}
              </Button>
            </>
          ) : (
            <Button onClick={handleConnect}>
              {t("wallet.connect_button")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
