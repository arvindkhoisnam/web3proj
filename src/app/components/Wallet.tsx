"use client";

import { useState } from "react";
import { createWallet, createWalletFromPrivateKey } from "../actions/actions";
import Button from "./Button";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  copiedSPWallet,
  deleteAWall,
  mintWallet,
  modalState,
  secretPhraseWallet,
  showSecretPhraseWallet,
  showWallet,
  smallScreen,
  walletCount,
  Wallets,
  WalletType,
} from "../utils/recoil";
import Modal from "./Modal";
import { FaRegCopy } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { Type } from "./Button";
import SecretRecovery from "./SecretRecovery";
import bs58 from "bs58";
function Wallet() {
  // const [wallets, setWallets] = useState<WalletType[]>([]);
  const [wallets, setWallets] = useRecoilState(Wallets);
  // const [showOptions, setShowOptions] = useState(true);
  const [newAccount, setNewAccount] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [privateKeyForm, setPrivateKeyFrom] = useState(false);
  const [walletId, setWalletId] = useRecoilState(walletCount);
  const [walletName, setWalletName] = useState(`Account ${walletId}`);

  //Recoil State
  const [phrase, setShowSecretPhrase] = useRecoilState(showSecretPhraseWallet);
  const copiedSecretPhrase = useRecoilValue(copiedSPWallet);
  const mnemonic = useRecoilValue(secretPhraseWallet);
  const showModal = useRecoilValue(modalState);
  const setShowModal = useSetRecoilState(modalState);
  const setCurrWallet = useSetRecoilState(showWallet);
  const [mintWall, setMintWall] = useRecoilState(mintWallet);
  const [deleteWallet, setDeleteWall] = useRecoilState(deleteAWall);
  function wallet(name: string) {
    const mnem = mnemonic?.join("");
    const { publicKey, privateKey } = createWallet(mnem!, walletId);
    const pubKey = publicKey.toBase58();
    const priv = bs58.encode(privateKey);

    const newWallet: WalletType = {
      walletName: name,
      walletId: walletId,
      publicKey: pubKey,
      pubKeyObj: publicKey,
      privateKey: priv,
      privKeyArr: privateKey,
      sol: 0,
      tokens: [],
      delete: false,
    };
    setWalletId((walletId) => walletId + 1);
    setWallets((wallets) => [...wallets, newWallet]);
  }
  async function importPrivateKey() {
    const { wallet, publicKeyStr } = await createWalletFromPrivateKey(
      privateKey
    );
    const alreadyExists = wallets.find(
      (wallet) => wallet.publicKey === publicKeyStr
    );
    if (!alreadyExists) {
      let newWallet: WalletType;
      if (publicKeyStr === mintWall.publicKey) {
        newWallet = {
          walletName: walletName,
          walletId: walletId,
          publicKey: publicKeyStr,
          privateKey: mintWall.privateKey,
          privKeyArr: mintWall.privKeyArr,
          tokenMint: mintWall.tokenMint,
          tokenMintObj: mintWall.tokenMintObj,
          ata: mintWall.ata,
          sol: wallet?.lamports! / 1000000000,
          tokens: [...mintWall.tokens],
          delete: false,
        };
      } else {
        newWallet = {
          walletName: walletName,
          walletId: walletId,
          publicKey: publicKeyStr,
          sol: wallet?.lamports! / 1000000000,
          tokens: [],
          delete: false,
        };
      }
      setWalletId((walletId) => walletId + 1);
      setWallets((wallets) => [...wallets, newWallet]);
    } else {
      alert("Account already exists");
    }
    setPrivateKey("");
  }
  return (
    <>
      {showModal && <Modal />}
      <div className="bg-neutral-900">
        {!phrase && !copiedSecretPhrase && (
          <div className="mt-24 flex flex-col justify-center items-center p-10">
            <h1 className="text-center md:text-3xl text-neutral-400 pb-20">
              Generate a Mnemonic Phrase to get started
            </h1>
            <Button
              type={Type.secondary}
              onClick={() => setShowSecretPhrase(true)}
            >
              Generate
            </Button>
          </div>
        )}
        {phrase && !copiedSecretPhrase && (
          <SecretRecovery componentOrigin="wallet" />
        )}
        {copiedSecretPhrase && (
          <section className="h-screen bg-neutral-900 p-20" id="parent">
            <div
              className={`rounded-xl flex flex-col md:grid grid-cols-2 gap-10`}
            >
              <div className="flex flex-col justify-start items-center md:items-start">
                {!newAccount && !privateKeyForm && (
                  <div className="p-3 sm:p-10 flex flex-col gap-5 sm:gap-10 rounded-xl border border-neutral-700">
                    <div className="w-full flex flex-col gap-5 sm:gap-10">
                      <Button
                        type={Type.secondary}
                        onClick={() => {
                          setNewAccount(true);
                          // setShowOptions(false);
                        }}
                      >
                        Create new Account
                      </Button>
                      <Button
                        type={Type.secondary}
                        onClick={() => setPrivateKeyFrom(true)}
                      >
                        Import Private Key
                      </Button>
                    </div>
                    <div className="flex justify-center">
                      <Button type={Type.secondary}>
                        Import Recovery Phrase
                      </Button>
                    </div>
                  </div>
                )}
                {newAccount && (
                  <div className="border border-neutral-700 flex flex-col gap-5 sm:gap-10 p-3 sm:p-10 rounded-xl w-full">
                    <input
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      type="text"
                      // className="p-2 sm:p-4 rounded-lg text-xs sm:text-base bg-neutral-900 text-neutral-200 border border-neutral-700"
                      className="p-2 sm:p-4 bg-neutral-900 text-xs sm:text-base text-neutral-200 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700"
                    />
                    <div className="flex justify-evenly">
                      <Button
                        onClick={() => {
                          wallet(walletName);
                          setWalletName(`Account ${walletId + 1}`);
                          setNewAccount(false);
                        }}
                        type={Type.secondary}
                      >
                        Create
                      </Button>
                      <Button
                        onClick={() => {
                          setNewAccount(false);
                        }}
                        type={Type.danger}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                {privateKeyForm && (
                  <div className="border border-neutral-700 flex flex-col gap-5 sm:gap-10 p-3 sm:p-10 rounded-xl w-full">
                    <div className="flex flex-col justify-center items-center gap-4 sm:flex-row md:flex-col lg:flex-row">
                      <input
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        type="text"
                        // className="p-2 sm:p-4 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-700 text-xs sm:text-base"
                        className="p-2 sm:p-4 bg-neutral-900 text-xs sm:text-base text-neutral-200 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700"
                      />
                      <input
                        value={privateKey}
                        onChange={(e) => {
                          setPrivateKey(e.target.value);
                        }}
                        placeholder="Private Key"
                        type="password"
                        // className="p-2 sm:p-4 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-700 text-xs sm:text-base"
                        className="p-2 sm:p-4 bg-neutral-900 text-xs sm:text-base text-neutral-200 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700"
                      />
                    </div>
                    <div className="flex justify-evenly">
                      <Button
                        onClick={() => {
                          importPrivateKey();
                          setPrivateKey("");
                          setWalletName(`Account ${walletId + 1}`);
                          setPrivateKeyFrom(false);
                        }}
                        type={Type.secondary}
                      >
                        Create
                      </Button>
                      <Button
                        onClick={() => {
                          setPrivateKeyFrom(false);
                          //in case the user clicks Create Button while setShowInputs is true.
                          // setShowOptions(false);
                        }}
                        type={Type.danger}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="flex flex-col gap-4">
                  {wallets?.map((wall, ind) => {
                    return (
                      <div
                        onClick={() => {
                          if (!wall.delete) {
                            setShowModal(true);
                          }
                          setCurrWallet(wall);
                        }}
                        key={ind}
                        className={`${
                          wall.delete ? "relative animate-wiggle" : "block"
                        } border border-violet-700 p-4 rounded-lg text-violet-200 cursor-pointer ${
                          !wall.delete ? "hover:scale-105" : ""
                        } flex justify-between transition-all ease-in-out delay-100 min-w-full hover:shadow-md hover:shadow-violet-200`}
                        // className="w-full before:block before:absolute before:-inset-1 before:-skew-x-[20deg] before:bg-gradient-to-tr from-[#dc1fff] to-[#00ffa3] text-neutral-800 relative inline-flex justify-between md:py-2 md:px-2 before:rounded-lg mt-5 cursor-pointer hover:scale-105 transition-all ease-in-out delay-100 before:hover:shadow-md before:hover:shadow-violet-500"
                      >
                        {wall.delete && (
                          <span
                            className="absolute top-1/2 -translate-y-1/2 right-4 translate-x-4  md:-right-4 hover:scale-110 text-rose-600 cursor-pointer text-sm md:text-2xl"
                            onClick={() => {
                              const updatedWallets = wallets.filter(
                                (wallet) => wallet.walletId !== wall.walletId
                              );
                              setWallets(updatedWallets);
                            }}
                          >
                            <RxCrossCircled />
                          </span>
                        )}
                        <span className="text-xs sm:text-base z-10">
                          {wall.walletName}
                        </span>
                        <span
                          className="flex items-center gap-1 text-xs sm:text-base z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(wall.publicKey);
                          }}
                        >
                          <FaRegCopy />
                          {`${wall.publicKey.slice(
                            0,
                            5
                          )}...${wall.publicKey.slice(38)}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default Wallet;
