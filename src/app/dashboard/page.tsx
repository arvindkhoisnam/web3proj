"use client";
import { useRecoilState } from "recoil";
import Wallet from "../components/Wallet";
import { smallScreen } from "../utils/recoil";

function Page() {
  const [smScreen, setSmScreen] = useRecoilState(smallScreen);
  return (
    <div
      className={`h-screen bg-neutral-900 ${
        smScreen ? "col-span-6" : "col-span-5"
      }`}
    >
      <Wallet />
    </div>
  );
}

export default Page;
