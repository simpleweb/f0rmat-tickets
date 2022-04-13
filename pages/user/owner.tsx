import { WalletState } from "@web3-onboard/core";
import { TicketCard } from "../../components";
import { useGetOwner } from "../../queries";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/outline";
import { useConnectWallet } from "@web3-onboard/react";
import { useEffect } from "react";

export default function ownedTickets() {
  const [{ wallet }] = useConnectWallet();
  const [refetchInterval, setRefetchInterval] = useState(0);
  const { data, error, isLoading } = useGetOwner(
    wallet?.accounts[0].address,
    refetchInterval
  );

  if (isLoading) return <div>Loading Tickets....</div>;
  if (error) return <div>There was an error: {error?.message}</div>;

  return (
    <div>
      {data?.owner?.mediaItems.length ? (
        <>
          <div className="flex p-2 hover:text-white">
            Filter Tickets <PlusIcon className="h-6 w-5" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.owner.mediaItems.map((ticket: Ticket) => (
              <TicketCard
                metadata={ticket.mediaItem.metadata}
                id={ticket.mediaItem.id}
              />
            ))}
          </div>
        </>
      ) : (
        <h1 className="flex justify-center text-2xl">YOU HAVE NO TICKETS</h1>
      )}
    </div>
  );
}
