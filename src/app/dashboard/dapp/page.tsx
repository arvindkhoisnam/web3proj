"use client";
import { smallScreen } from "@/app/utils/recoil";
import { useRecoilState } from "recoil";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import Airdrop from "@/app/components/Airdrop";

function Page() {
  const [smScreen, setSmScreen] = useRecoilState(smallScreen);

  return (
    <div
      className={`h-screen bg-neutral-900 ${
        smScreen ? "col-span-6" : "col-span-5"
      }`}
    >
      <div className="w-1/2 p-10 mx-auto flex flex-col lg:flex-row justify-center items-center gap-4 border border-neutral-600 rounded-xl mt-28">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      <Airdrop />
    </div>
  );
}

export default Page;
