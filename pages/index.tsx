import { WalletState } from "@web3-onboard/core";
import type { NextPage } from "next";
interface HomeProps {
  wallet: WalletState;
}

const Home: NextPage = ({ wallet }: HomeProps) => {
  return (
    <div
      className="bg-cover"
      style={{
        backgroundImage: "url('images/background.png')",
        minHeight: "100vh",
      }}
    >
      <div className="relative z-10 py-5">Web3 base.</div>
    </div>
  );
};

export default Home;
