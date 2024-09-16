"use client";
import { useRouter } from "next/navigation";
import Button from "./Button";
import DotBackgroundDemo from "./DotBackground";

function Hero() {
  const router = useRouter();
  return (
    <div className="bg-neutral-900">
      <DotBackgroundDemo />
      {/* <div className="max-w-7xl text-white ">
        <div className="p-10 mb-20 text-neutral-400">
          <h1 className="md:text-5xl text-right mb-3">
            One stop place for everything{" "}
            <span className="font-bold text-violet-500">SOLANA</span>.
          </h1>
        </div>
      </div> */}
    </div>
  );
}

export default Hero;
