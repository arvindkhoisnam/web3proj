"use client";
import { useEffect, useState } from "react";
import Button from "./Button";
import { createWallet, generate } from "../actions/actions";
import { useSetRecoilState } from "recoil";
import {
  copiedSPMint,
  copiedSPWallet,
  secretPhraseMint,
  secretPhraseWallet,
  showSecretPhraseWallet,
  showSecretPhraseMint,
  mintWallet,
} from "../utils/recoil";
import bs58 from "bs58";
function SecretRecovery({ componentOrigin }: { componentOrigin: string }) {
  const [mnemonic, setMnemonic] = useState<string[]>();
  const setSecretPhraseWallet = useSetRecoilState(secretPhraseWallet);
  const setSecretPhraseMint = useSetRecoilState(secretPhraseMint);
  const setShowSecretPhraseWallet = useSetRecoilState(showSecretPhraseWallet);
  const setShowSecretPhraseMint = useSetRecoilState(showSecretPhraseMint);
  const setCopiedSPWallet = useSetRecoilState(copiedSPWallet);
  const setCopiedSPMint = useSetRecoilState(copiedSPMint);
  const setMintWall = useSetRecoilState(mintWallet);

  useEffect(() => {
    function polpulate() {
      const gen = generate();
      setMnemonic(gen.split(" "));
    }
    polpulate();
  }, [setMnemonic]);

  return (
    <div className="mt-24">
      <h2 className="text-center md:text-2xl md:mb-20">
        Secert Recovery phrase
      </h2>
      <div className="px-10 md:px-24">
        <section className="border border-neutral-700 grid grid-cols-3 lg:grid-cols-4 gap-4 mx-auto w-full lg:w-1/2 p-2 md:p-5 rounded-lg blur-sm hover:blur-none transition ease-in-out delay-75 mt-10">
          {mnemonic?.map((phrase: string, index) => (
            <span
              key={index}
              className="border border-neutral-500 py-3 px-2 flex justify-center items-center rounded-lg text-xs md:text-sm lg:text-base overflow-x-hidden"
            >
              {phrase}
            </span>
          ))}
        </section>
      </div>
      <p className="text-yellow-600 mt-5 text-xs md:text-base text-center px-2">
        This phrase is the ONLY way to recover your wallet. Do NOT share it with
        anyone!
      </p>
      <div className="flex flex-col justify-center items-center my-5">
        <Button
          onClick={() => navigator.clipboard.writeText(mnemonic?.join(" ")!)}
        >
          Copy Mnemonic Phrase
        </Button>
        <div className="mt-10 flex items-center gap-5">
          <input
            className="bg-white p-5"
            type="checkbox"
            onChange={() => {
              if (componentOrigin === "wallet") {
                setSecretPhraseWallet(mnemonic!);
                setCopiedSPWallet(true);
                setShowSecretPhraseWallet(false);
              } else {
                setSecretPhraseMint(mnemonic!);
                setCopiedSPMint(true);
                setShowSecretPhraseMint(false);
                const mnem = mnemonic?.join("");
                const { publicKey, privateKey } = createWallet(mnem!, 1);
                const pubKey = publicKey.toBase58();
                const priv = bs58.encode(privateKey);
                const mintWall = {
                  walletName: "",
                  walletId: 1,
                  publicKey: pubKey,
                  pubKeyObj: publicKey,
                  privateKey: priv,
                  privKeyArr: privateKey,
                  tokens: [],
                  delete: false,
                };

                setMintWall(mintWall);
              }
            }}
            // disabled={copied}
          />
          <label className={`md:pl-4 text-xs md:text-sm`}>
            I have saved my Mnemonic Phrase.
          </label>
        </div>
      </div>
    </div>
  );
}

export default SecretRecovery;
