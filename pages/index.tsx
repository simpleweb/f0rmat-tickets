import { WalletState } from "@web3-onboard/core";
import type { NextPage } from "next";
import { TicketCard } from "../components";
import { useGetTickets } from "../queries";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/outline";

const Home: NextPage = () => {
  const [refetchInterval, setRefetchInterval] = useState(0);
  const { data, error, isLoading } = useGetTickets(
    process.env.NEXT_PUBLIC_FACTORY_ID,
    refetchInterval
  );

  if (isLoading) return <div>Loading Tickets....</div>;
  if (error) return <div>There was an error: {error?.message}</div>;

  return (
    <div>
      <div className="flex p-2 hover:text-white">
        Filter Tickets <PlusIcon className="h-6 w-5" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((ticket: Ticket, i) => (
          <TicketCard metadata={ticket.metadata} id={ticket.id} key={i} />
        ))}
      </div>
    </div>
  );
};

export default Home;
