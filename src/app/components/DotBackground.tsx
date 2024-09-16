import React from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function DotBackgroundDemo() {
  const router = useRouter();
  return (
    <div className="h-[55rem] w-full dark:bg-black bg-neutral-900  dark:bg-dot-white/[0.2] bg-dot-neutral-100/[0.2] relative flex flex-col items-center justify-center max-w-7xl mx-auto">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-neutral-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="text-md lg:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 px-20">
        <h1 className="text-md lg:text-3xl text-center">
          From{" "}
          <span className="text-violet-400 text-xl lg:text-4xl">
            Managing Wallets
          </span>{" "}
          to{" "}
          <span className="text-violet-400 text-xl lg:text-4xl">
            Creating Tokens
          </span>{" "}
          and
          <span className="text-violet-400 text-xl lg:text-4xl">
            Creating dApps
          </span>
          , we have you all covered in one central place.
        </h1>
      </div>
      <div className="w-full text-center absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Button onClick={() => router.push("/dashboard")}>Enter here</Button>
      </div>
    </div>
  );
}
