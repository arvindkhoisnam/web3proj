/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  mintWallet,
  modalState,
  showWallet,
  Token,
  WalletType,
} from "../utils/recoil";
import { createPortal } from "react-dom";
import { IoQrCode } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { IoIosSwap } from "react-icons/io";
import { FiDollarSign } from "react-icons/fi";
import { IoArrowBackSharp } from "react-icons/io5";
import { fetchWallet, getTokenMeta, solBal } from "../actions/actions";

function Modal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [showModal, setModal] = useRecoilState(modalState);
  const [currWallet, setCurrWallet] = useRecoilState(showWallet);
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currToken, setCurrToken] = useState<Token>();
  const wall = useRecoilValue(mintWallet);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        setModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showModal, setModal]);

  useEffect(() => {
    navigator.clipboard.writeText(String(currWallet.privKeyArr));
    const walletDetails = async () => {
      setLoading(true);
      if (currWallet.tokenMintObj) {
        const latestSolBal = await solBal(wall.pubKeyObj!);
        const solToken: Token = {
          tokenName: "Solana",
          tokenSymbol: "SOL",
          decimal: 9,
          supply: 6412784612843721,
          image:
            "https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fsolana-labs%2Ftoken-list%40main%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png&fit=cover&width=40&height=40",
          value: latestSolBal / 1000000000,
          tokenMintObj: null,
          mintAuthority: currWallet.publicKey,
        };
        setCurrWallet((wallet) => {
          return {
            ...wallet,
            tokens: [solToken, ...wall.tokens],
          };
        });
      } else {
        const sol = await solBal(currWallet.pubKeyObj!);
        if (sol) {
          const solTok: Token = {
            tokenName: "Solana",
            tokenSymbol: "SOL",
            decimal: 9,
            supply: 6412784612843721,
            image:
              "https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fsolana-labs%2Ftoken-list%40main%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png&fit=cover&width=40&height=40",
            value: sol / 1000000000,
            tokenMintObj: null,
            mintAuthority: currWallet.publicKey,
          };
          setCurrWallet((wallet) => {
            return {
              ...wallet,
              tokens: [solTok],
            };
          });
        }
      }
      setLoading(false);
    };
    walletDetails();
  }, [
    setCurrWallet,
    wall.sol,
    wall.tokens,
    currWallet.tokenMintObj,
    currWallet.publicKey,
    currWallet.pubKeyObj,
    wall.pubKeyObj,
  ]);
  return (
    <>
      {showModal &&
        createPortal(
          <div
            className="fixed inset-0 bg-neutral-950 bg-opacity-90 backdrop-blur-sm flex justify-center items-center z-20"
            id="overlay"
          >
            {loading && (
              <div className="text-xs md:text-base text-neutral-600">
                loading...
              </div>
            )}
            {!loading && (
              <div
                ref={ref}
                className="border border-neutral-600 inset-0 p-6 flex flex-col gap-5 rounded-xl max-h-[44rem] z-20"
              >
                {!showToken ? (
                  <>
                    <div className="text-neutral-200">
                      {currWallet.walletName}
                    </div>
                    <div className="p-3 md:p-10 flex justify-center items-center text-neutral-400">
                      -
                    </div>
                    <div className="flex justify-center items-center">
                      <div className="grid grid-cols-2 sm:flex gap-2">
                        <button className="text-sm md:text-2xl border border-neutral-600 text-violet-400 h-14 w-20 md:h-20 md:w-28 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-neutral-400 transition-all ease-in-out">
                          <IoQrCode />
                          <span className="text-[10px] md:text-xs text-neutral-400">
                            Receive
                          </span>
                        </button>
                        <button className="text-sm md:text-2xl border border-neutral-600 text-violet-400 h-14 w-20 md:h-20 md:w-28 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-neutral-400 transition-all ease-in-out">
                          <FiSend />
                          <span className="text-[10px] md:text-xs text-neutral-400">
                            Send
                          </span>
                        </button>
                        <button className="text-sm md:text-2xl border border-neutral-600 text-violet-400 h-14 w-20 md:h-20 md:w-28 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-neutral-400 transition-all ease-in-out">
                          <IoIosSwap />
                          <span className="text-[10px] md:text-xs text-neutral-400">
                            Swap
                          </span>
                        </button>
                        <button className="text-sm md:text-2xl border border-neutral-600 text-violet-400 h-14 w-20 md:h-20 md:w-28 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-neutral-400 transition-all ease-in-out">
                          <FiDollarSign />
                          <span className="text-[10px] md:text-xs text-neutral-400">
                            Buy
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {currWallet.tokens?.map((token, ind) => (
                        <div
                          onClick={(e) => {
                            setCurrToken(token);
                            e.stopPropagation(); // Prevents the modal from closing
                            setShowToken(true);
                          }}
                          className="border border-neutral-600 p-2 md:p-4 rounded-xl text-neutral-300 cursor-pointer hover:border-neutral-400 transition-all ease-in-out flex justify-between items-center"
                          key={ind}
                        >
                          <div className="flex justify-center items-center gap-3">
                            <img
                              alt="token logo"
                              src={token.image}
                              className="relative rounded-full z-10 size-6 md:size-12"
                            />
                            <span className="text-[10px] md:text-base">{`${
                              token?.tokenName.length > 6
                                ? token?.tokenName.slice(0, 10)
                                : token?.tokenName
                            }`}</span>
                          </div>
                          <span className="text-[10px] md:text-base">
                            {token?.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowToken(false);
                        }}
                        className="text-md md:text-xl text-neutral-400 flex items-center gap-2 hover:scale-105"
                      >
                        <IoArrowBackSharp />
                      </button>
                      <div className="text-neutral-400 text-xs md:text-base">
                        Token Details
                      </div>
                    </div>
                    <div className="p-3 md:p-10 flex justify-center items-center text-neutral-400">
                      {`${currToken?.value}${" "}${currToken?.tokenSymbol}`}
                    </div>
                    <div className="flex justify-center items-center">
                      <div className="grid grid-cols-2 sm:flex gap-2">
                        <button className="text-sm md:text-2xl border border-neutral-600 text-violet-400 h-14 w-20 md:h-20 md:w-28 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-neutral-400 transition-all ease-in-out">
                          <IoQrCode />
                          <span className="text-[10px] md:text-xs text-neutral-400">
                            Receive
                          </span>
                        </button>
                        <button className="text-sm md:text-2xl border border-neutral-600 text-violet-400 h-14 w-20 md:h-20 md:w-28 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-neutral-400 transition-all ease-in-out">
                          <FiSend />
                          <span className="text-[10px] md:text-xs text-neutral-400">
                            Send
                          </span>
                        </button>
                        <button className="text-sm md:text-2xl border border-neutral-600 text-violet-400 h-14 w-20 md:h-20 md:w-28 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-neutral-400 transition-all ease-in-out">
                          <IoIosSwap />
                          <span className="text-[10px] md:text-xs text-neutral-400">
                            Swap
                          </span>
                        </button>
                        <button className="text-sm md:text-2xl border border-neutral-600 text-violet-400 h-14 w-20 md:h-20 md:w-28 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-neutral-400 transition-all ease-in-out">
                          <FiDollarSign />
                          <span className="text-[10px] md:text-xs text-neutral-400">
                            Buy
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="p-3 md:p-10 text-[10px] md:text-base flex justify-center items-center text-neutral-400">
                      Details about the selected token
                    </div>
                  </>
                )}
              </div>
            )}
          </div>,
          document.getElementById("parent")!
        )}
    </>
  );
}

export default Modal;
