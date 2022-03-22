import { ExternalLinkIcon } from "@heroicons/react/outline";
import {
  ConnectOptions,
  DisconnectOptions,
  WalletState,
} from "@web3-onboard/core";
import { useSetChain } from "@web3-onboard/react";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";
import { Button } from "../components";
import { BLOCK_EXPLORER_URL, switchChain } from "../helpers";

interface HeaderProps {
  wallet: WalletState;
  connect: (options: ConnectOptions) => Promise<void>;
  disconnect: (options: DisconnectOptions) => Promise<void>;
}

export default function Header({ wallet, connect, disconnect }: HeaderProps) {
  const { t } = useTranslation("common");
  const [{}, setChain] = useSetChain();
  const CHAIN_ID = process.env.NEXT_CHAIN_ID;

  async function handleConnect() {
    await connect({});
  }

  useEffect(() => {
    if (wallet && CHAIN_ID) {
      switchChain(setChain, CHAIN_ID);
    }
  }, [wallet]);

  async function handleDisconnect() {
    if (wallet) {
      await disconnect(wallet);
    }
  }

  return (
    <header className="w-full">
      <div className="flex items-center justify-end">
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
          <Button onClick={handleConnect}>{t("wallet.connect_button")}</Button>
        )}
      </div>
    </header>
  );
}
