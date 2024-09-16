"use client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import React from "react";
import { RecoilRoot } from "recoil";
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ConnectionProvider
        endpoint={
          "https://solana-devnet.g.alchemy.com/v2/Lzqmn6ok9fn1c3R6JYoxJnbTgmni8NpW"
        }
      >
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <RecoilRoot>{children}</RecoilRoot>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default Providers;
