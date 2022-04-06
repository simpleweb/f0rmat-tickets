import { WalletState } from "@web3-onboard/core";
import type { NextPage } from "next";
import { Button } from "../components";
import Router from "next/router";
interface HomeProps {
  wallet: WalletState;
}

const Home: NextPage = ({ wallet }: HomeProps) => {
  function toCreateTickets() {
    Router.push("/ticket/create");
  }
  return (
    <div
      className="bg-cover"
      style={{
        backgroundImage: "url('images/background.png')",
        minHeight: "100vh",
      }}
    >
      <div className="relative z-10 py-5">Web3 base.</div>
      <Button onClick={toCreateTickets}>Create Tickets Page</Button>
    </div>
  );
};

export default Home;
