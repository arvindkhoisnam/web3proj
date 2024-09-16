import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Button, { Type } from "./Button";
import { useEffect, useState } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

function Airdrop() {
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [showBal, setShowBal] = useState(false);
  const [balanceStatus, setBalanceStatus] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState(1);
  const [transferStatus, setTransferStatus] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (wallet.publicKey) {
      setConnected(true);
    } else {
      setBalance(0);
      setToAddress("");
      setAmount(1);
      setShowBal(false);
      setConnected(false);
    }
  }, [wallet.publicKey]);

  async function checkBal() {
    setBalanceStatus(true);
    const balance = await connection.getBalance(wallet.publicKey!);
    console.log(balance);
    setBalance(balance / 1000000000);
    setShowBal(true);
    setBalanceStatus(false);
  }
  function airdrop() {
    console.log(wallet.publicKey?.toBase58());
  }

  async function sendTokens() {
    console.log(wallet.publicKey?.toBase58());
    console.log(toAddress);
    console.log(amount);

    const transaction = new Transaction();
    if (wallet.publicKey) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(toAddress),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
    }
    const res = await wallet.sendTransaction(transaction, connection);
    console.log(res);
  }
  return (
    connected && (
      <div className="w-1/2 mx-auto rounded-lg border border-neutral-600 flex flex-col justify-center items-center gap-4 md:gap-7 lg:gap-10 p-10 mt-7">
        <div className="flex gap-4 md:gap-7 lg:gap-10">
          <Button type={Type.secondary} onClick={() => checkBal()}>
            {balanceStatus ? "Checking..." : "Check Balance"}
          </Button>
          <Button onClick={() => airdrop()} type={Type.secondary}>
            Airdrop 1 SOL
          </Button>
        </div>
        {showBal && (
          <div className="w-full mt-5 text-center text-violet-400 text-[10px] md:text-xs lg:text-base">
            Balance: {balance} SOL
          </div>
        )}
        {balance !== 0 && (
          <>
            <div className="border border-neutral-800 rounded-xl p-2 md:p-6 lg:p-10">
              <p className="text-center text-[14px] md:text-sm text-neutral-400 lg:text-lg mb-4 md:mb-7 lg:mb-10">
                Send Solana
              </p>
              <div className="flex gap-2 md:gap-6 lg:gap-10">
                <input
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="text-[10px] md:text-xs lg:text-base p-2 sm:p-4 bg-neutral-900 text-neutral-400 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700 w-20 md:w-32 lg:w-44"
                  type="text"
                  placeholder="Public Address"
                />
                <input
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  max={Math.floor(balance)}
                  min={1}
                  type="number"
                  placeholder="Amount"
                  className="text-[10px] md:text-xs lg:text-base p-2 sm:p-4 bg-neutral-900 text-neutral-400 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700 w-20 md:w-32 lg:w-44"
                />
              </div>
              <div className="w-full flex justify-center items-center mt-4 md:mt-7 lg:mt-10">
                {toAddress && (
                  <Button
                    type={Type.danger}
                    onClick={() => sendTokens()}
                    disabled={transferStatus}
                  >
                    {transferStatus ? "Sending..." : "Send"}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  );
}

export default Airdrop;
