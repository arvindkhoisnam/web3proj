"use client";
import Button, { Type } from "@/app/components/Button";
import SecretRecovery from "@/app/components/SecretRecovery";
import {
  showSecretPhraseMint,
  secretPhraseMint,
  copiedSPMint,
  mintWallet,
  smallScreen,
} from "@/app/utils/recoil";
import { useRecoilState, useRecoilValue } from "recoil";
import { FaRegCopy } from "react-icons/fa";
import TokenForm from "@/app/components/TokenForm";

function Page() {
  const [phrase, setShowSecretPhrase] = useRecoilState(showSecretPhraseMint);
  const mnemonic = useRecoilValue(secretPhraseMint);
  const [copiedSecretPhraseMint, setCopiedSecretPhrase] =
    useRecoilState(copiedSPMint);
  const [mintWall, setMintWall] = useRecoilState(mintWallet);
  const [smScreen, setSmScreen] = useRecoilState(smallScreen);
  return (
    <div
      className={`h-screen bg-neutral-900 ${
        smScreen ? "col-span-6" : "col-span-5"
      }`}
    >
      <div>
        {!copiedSecretPhraseMint && !phrase && (
          <div className="mt-24 p-10">
            <h1 className="text-center md:text-3xl text-neutral-400 pb-20">
              How about we allow you to create your own token and mint it?
            </h1>
            <div className="flex flex-col items-center justify-center gap-3">
              <Button
                type={Type.secondary}
                onClick={() => setShowSecretPhrase(true)}
              >
                Create a Wallet
              </Button>
            </div>
          </div>
        )}
        <div>
          {phrase && !copiedSecretPhraseMint && (
            <SecretRecovery componentOrigin="mint" />
          )}
        </div>
        {copiedSecretPhraseMint && (
          <div className="text-neutral-400 flex flex-col p-20">
            <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center pb-10">
              <span>Your public key is: </span>
              <div className="p-3 sm:p-4 bg-neutral-800 rounded-lg text-white flex items-center gap-4">
                <span
                  className="hover:scale-110 cursor-pointer"
                  onClick={() =>
                    navigator.clipboard.writeText(mintWall.publicKey)
                  }
                >
                  <FaRegCopy />
                </span>
                <span className="text-xs sm:text-base">
                  {`${mintWall.publicKey.slice(
                    0,
                    6
                  )} ... ${mintWall.publicKey.slice(38)}`}
                </span>
              </div>
            </div>
            <TokenForm />
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
