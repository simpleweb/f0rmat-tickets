import { Router, useRouter } from "next/router";
import { Button } from "../../components";
import { callContract } from "../../helpers";
import { useConnectWallet } from "@web3-onboard/react";
import toast from "react-hot-toast";
import { useGetTicket } from "../../queries";
import { useState } from "react";
import {
  getMetadataValue,
  errorNotification,
  loadingNotification,
  dismissNotification,
  transformURL,
} from "../../helpers";
import { ethers } from "ethers";
import { useEffect } from "react";

export default function Ticket() {
  const { query, push } = useRouter();
  const [{ wallet }] = useConnectWallet();
  const ticketContract = query.id;
  const [isPurchaseButtonLoading, setPurchaseButtonLoading] = useState(false);
  const [isReleaseButtonLoading, setReleaseButtonLoading] = useState(false);
  const [refetchInterval, setRefetchInterval] = useState(0);
  const { data, error, isLoading } = useGetTicket(
    ticketContract?.toLowerCase(),
    refetchInterval
  );
  const [noFunds, setNoFunds] = useState(false);
  const [soldOut, setSoldOut] = useState(false);
  const walletAddress = wallet?.accounts[0].address;
  useEffect(() => {
    if (ticketContract && !data) {
      setRefetchInterval(1000);
    } else {
      setRefetchInterval(0);
    }
  }, [ticketContract, data]);

  useEffect(() => {
    if (wallet?.accounts[0].balance) {
      checkFunds();
    }
  }, [wallet, data, wallet?.accounts[0]]);

  useEffect(() => {
    if (data) {
      const saleData = data.saleData;
      const supply = saleData.maxSupply;
      const sold = saleData.totalSold;
      if (sold == supply) setSoldOut(true);
    }
  }, [data, wallet?.accounts[0].balance?.MATIC, isPurchaseButtonLoading]);

  function formatToEther(weiValue) {
    return ethers.utils.formatEther(weiValue);
  }

  async function checkFunds() {
    try {
      callContract({
        name: "factory",
        provider: wallet?.provider,
        address: ticketContract,
        cb: async (factory) => {
          const price = formatToEther(await factory.releaseSalePrice());

          const balance = await wallet?.accounts[0].balance.MATIC;
          if (!balance || balance < price) setNoFunds(true);
          else {
            setNoFunds(false);
          }
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  let isStakeholder;
  if (data) {
    for (const item of data?.stakeholders) {
      if (item.id.startsWith(walletAddress)) {
        isStakeholder = true;
      }
    }
  }
  let isOwner;
  if (data) {
    for (const item of data?.owners) {
      if (item.id.startsWith(walletAddress)) {
        isOwner = true;
      }
    }
  }

  function releaseFunds() {
    setReleaseButtonLoading(true);
    const waitingToConfirm = loadingNotification("Waiting for confirmation");
    try {
      callContract({
        name: "factory",
        provider: wallet?.provider,
        address: ticketContract,
        cb: async (factory) => {
          try {
            const release = await factory["release(address)"](walletAddress);
            dismissNotification(waitingToConfirm);
            toast
              .promise(
                release.wait(),
                {
                  loading: "Releasing Earnings...",
                  success: "success",
                  error: "failed",
                },
                {
                  position: "bottom-center",
                  style: {
                    background: "#94a4bb",
                    padding: "16px",
                  },
                }
              )
              .then(() => {
                setReleaseButtonLoading(false);
              })
              .catch((e) => {
                setReleaseButtonLoading(false);
                errorNotification("Release failed");
              });
          } catch (e) {
            errorNotification("Release failed");
            dismissNotification(waitingToConfirm);
            setReleaseButtonLoading(false);
            console.log(e);
          }
        },
      });
    } catch (e) {
      errorNotification("Release failed");
      dismissNotification(waitingToConfirm);
      setReleaseButtonLoading(false);
    }
  }

  if (isLoading) return <div>Loading ticket....</div>;
  if (error) return <div>There was an error: {error?.message}</div>;

  function purchaseTicket() {
    setPurchaseButtonLoading(true);
    const waitingToConfirm = loadingNotification("Waiting for confirmation");
    try {
      callContract({
        name: "factory",
        provider: wallet?.provider,
        address: ticketContract,
        cb: async (factory) => {
          try {
            const price = await factory.releaseSalePrice();

            const ticket = await factory.mintRelease(
              walletAddress,
              walletAddress,
              { value: price.toString() }
            );
            dismissNotification(waitingToConfirm);
            toast
              .promise(
                ticket.wait(),
                {
                  loading: "Purchasing...",
                  success: "success",
                  error: "failed",
                },
                {
                  position: "bottom-center",
                  style: {
                    background: "#94a4bb",
                    padding: "16px",
                  },
                }
              )
              .then(() => {
                setPurchaseButtonLoading(false);
                push("/user");
              })
              .catch((e) => {
                setPurchaseButtonLoading(false);
                errorNotification("Purchase Failed");
              });
          } catch (e) {
            setPurchaseButtonLoading(false);
            errorNotification("Purchase Failed");
            dismissNotification(waitingToConfirm);
            console.log(e);
          }
        },
      });
    } catch (e) {
      errorNotification(e.toString());
      dismissNotification(waitingToConfirm);
      setPurchaseButtonLoading(false);
    }
  }

  function EventDataCard() {
    if (!data) return;

    const metadata = data.metadata;
    const image = getMetadataValue(metadata, "image");
    const title = getMetadataValue(metadata, "name");
    const description = getMetadataValue(metadata, "description");
    const date = getMetadataValue(metadata, "date");
    const start = getMetadataValue(metadata, "start");
    const end = getMetadataValue(metadata, "end");
    const venue = getMetadataValue(metadata, "venue");
    const address = getMetadataValue(metadata, "address");
    const genres = getMetadataValue(metadata, "genres");
    const categories = getMetadataValue(metadata, "categories");

    return (
      <div className="grid gap-2">
        <img
          className="w-1/2 rounded-lg lg:col-span-1 lg:col-start-2"
          loading="lazy"
          src={transformURL(image)}
          alt="Event Flyer"
        />
        <div className="sm:order-2 lg:col-span-1 lg:col-start-1 lg:row-start-1">
          <div className="flex-wrap">
            <h1 className="text-5xl">{title}</h1>
            <h1 className="text-3xl">{venue}</h1>
            <h1 className="text-2xl">{address}</h1>
            <div className="flex border-b-2 border-slate-100/[0.6] text-2xl">
              <p>{date}</p>
              <p>,{"  " + start}</p>
              <p>-{end}</p>
            </div>
            <div>
              {categories && (
                <div className="flex">
                  Catagories{" - "}
                  <div className="pl-1 text-white">{categories}</div>
                </div>
              )}
              {genres && (
                <div className="flex">
                  Genres{" - "}
                  <div className="pl-1 text-white">{genres}</div>
                </div>
              )}
            </div>
            <br></br>
            <h2 className="text-3xl">About</h2>
            <p className="text-l">{description}</p>
          </div>
        </div>
      </div>
    );
  }
  const saleData = data.saleData;
  return (
    <div className="gap-2 lg:grid-cols-2">
      {data && (
        <div>
          <EventDataCard />
          <br></br>
          <div className="mt-3 flex-wrap md:flex lg:flex">
            <div className="mb-2">
              {isStakeholder || data?.creator.id == walletAddress ? (
                <div className="border-t-2 border-slate-100/[0.6]">
                  <div className="mt-1">
                    TOTAL SOLD: {saleData.totalSold} / {saleData.maxSupply} @
                    {"  "}
                    {formatToEther(saleData.salePrice)}MATIC EACH
                  </div>
                  <div>
                    TOTAL EARNINGS: {formatToEther(saleData.totalEarnings)}{" "}
                    MATIC
                  </div>
                  <div>
                    TOTAL RELEASED: {formatToEther(saleData.totalEarnings)}{" "}
                    MATIC
                  </div>
                </div>
              ) : soldOut ? (
                <h1 className="mb-2 text-4xl">SOLD OUT</h1>
              ) : (
                <Button
                  onClick={purchaseTicket}
                  isLoading={isPurchaseButtonLoading}
                  disabled={noFunds || isPurchaseButtonLoading}
                >
                  Purchase Ticket at{" "}
                  {ethers.utils.formatEther(data?.saleData.salePrice) + " "}
                  MATIC
                </Button>
              )}
            </div>
            <div className="md:ml-2 lg:ml-2">
              {isStakeholder ? (
                <Button
                  onClick={releaseFunds}
                  isLoading={isReleaseButtonLoading}
                  disabled={isReleaseButtonLoading}
                >
                  Release My Earnings
                </Button>
              ) : (
                isOwner && (
                  <div className="pt-2">YOU OWN A TICKET TO THIS EVENT</div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      <br></br>
    </div>
  );
}
