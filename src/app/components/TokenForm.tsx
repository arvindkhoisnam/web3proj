import { useRecoilState } from "recoil";
import Button, { Type } from "./Button";
import ProgressButton from "./ProgressBar";
import { mintWallet, smallScreen, Token } from "../utils/recoil";
import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import {
  airdropSol,
  createATA,
  createToken,
  mintToken,
} from "../actions/actions";

function TokenForm() {
  const [mintWall, setMintWall] = useRecoilState(mintWallet);
  const [solAmount, setSolAmoint] = useState(1);
  const [airdropStatus, setAirdropStatus] = useState(false);
  const [fullfilledAirdrop, setFullfilledAirdtop] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimal, setDecimal] = useState<number>(9);
  const [supply, setSupply] = useState<number>(1);
  const [image, setImage] = useState(
    "https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fsolana-labs%2Ftoken-list%40main%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png&fit=cover&width=40&height=40"
  );
  const [description, setDescription] = useState("");
  const [mintPub, setMintPub] = useState<PublicKey>();
  const [ata, setATA] = useState<PublicKey>();
  const [createTokeNStatus, setCreateTokenStatus] = useState(false);
  const [mintBtnShow, setMintBtnShow] = useState(false);
  const [mintTokenStatus, setMintTokenStatus] = useState(false);
  const [completedCreatingToken, setCompletedCreatingToken] = useState(false);
  const [error, setError] = useState(false);
  const [smScreen, setSmScreen] = useRecoilState(smallScreen);

  async function createTok() {
    setCreateTokenStatus(true);

    console.log("Inside createTok");

    const airdrop = await airdropSol(mintWall.publicKey, 1);
    console.log(airdrop);
    setMintWall({ ...mintWall, sol: 1 });

    //Artificial timer to let balance propogate in Solana Network
    await new Promise((res) => {
      return setTimeout(() => {
        res("Delay of 10 secs,Airdrop done.");
      }, 10000);
    }).then((res) => {
      console.log(res);
    });

    const { res, mint } = await createToken(
      mintWall.privKeyArr!,
      tokenName,
      tokenSymbol,
      image
    );
    console.log(res);
    console.log(`Mint public key ${mint.publicKey.toBase58()}`);
    setMintPub(mint.publicKey);
    setMintWall({ ...mintWall, tokenMintObj: mint.publicKey });

    new Promise((res) => {
      return setTimeout(() => {
        res("Fullfilled after 30 secs");
      }, 30000);
    }).then(async (res) => {
      console.log(res);
      try {
        const meta = await createATA(mintWall.privKeyArr!, mint.publicKey);
        setATA(meta.address);
        setCreateTokenStatus(false);
        setMintBtnShow(true);
      } catch (error) {
        setTokenName("");
        setTokenSymbol("");
        setImage("");
        setDescription("");
        setDecimal(9);
        setSupply(1);
        setError(true);
        setCreateTokenStatus(false);
        return;
      }
    });
  }

  async function mint() {
    setMintTokenStatus(true);
    console.log("Inside mint func");
    console.log("Starting...");

    const token = await mintToken(
      mintWall.privKeyArr!,
      mintPub!,
      ata!,
      supply * 1000000000
    );
    const newToken: Token = {
      tokenName,
      tokenSymbol,
      supply,
      decimal,
      image,
      value: supply,
      description,
      tokenMintObj: mintWall.tokenMintObj!,
      mintAuthority: mintWall.publicKey,
    };
    setMintWall({
      walletName: mintWall.walletName,
      publicKey: mintWall.publicKey,
      pubKeyObj: mintWall.pubKeyObj,
      privKeyArr: mintWall.privKeyArr,
      privateKey: mintWall.privateKey,
      walletId: mintWall.walletId,
      sol: mintWall.sol,
      tokenMint: mintPub?.toBase58(),
      tokenMintObj: mintPub,
      ata: {
        address: ata,
      },
      tokens: [...mintWall.tokens, newToken],
      delete: false,
    });
    setMintTokenStatus(false);
    setMintBtnShow(false);
    setCompletedCreatingToken(true);
  }
  return (
    <div>
      <div className="border border-neutral-800 p-5 rounded-xl">
        <h2 className="text-md sm:text-2xl text-center mb-6 sm:mb-10">
          Create a Solana Based Token
        </h2>
        <form
          className="flex flex-col sm:grid grid-cols-2 gap-3 sm:gap-7 mb-16"
          onSubmit={() => createTok()}
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-base">
              <span className="text-rose-700">*</span>Name
            </label>
            <input
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="h-10 sm:h-14 p-2 sm:p-5 bg-neutral-900 text-neutral-400 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-base">
              <span className="text-rose-700">*</span>Symbol
            </label>
            <input
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              className="h-10 sm:h-14 p-2 sm:p-5 bg-neutral-900 text-neutral-400 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700"
              type="text"
            />
          </div>
          <div className="hidden sm:flex flex-col gap-2">
            <label className="text-xs sm:text-base">
              <span className="text-rose-700">*</span>Decimals
            </label>
            <input
              value={decimal}
              onChange={(e) => setDecimal(Number(e.target.value))}
              className="h-10 sm:h-14 p-2 sm:p-5 bg-neutral-900 text-neutral-400 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-base">
              <span className="text-rose-700">*</span>Supply
            </label>
            <input
              value={supply}
              onChange={(e) => setSupply(Number(e.target.value))}
              className="h-10 sm:h-14 p-2 sm:p-5 bg-neutral-900 text-neutral-400 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700"
              type="text"
            />
          </div>
          <div className="hidden sm:flex flex-col gap-2">
            <label className="text-xs sm:text-base">
              <span className="text-rose-700">*</span>Image
            </label>
            <input
              disabled={true}
              placeholder="Already set to a default image for now"
              className="h-10 sm:h-14 p-2 sm:p-5 bg-neutral-900 text-neutral-400 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-base">
              <span className="text-rose-700">*</span>Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-10 sm:h-14 p-2 sm:p-5 bg-neutral-900 text-neutral-400 rounded-lg border border-neutral-700 outline-none focus:outline-offset-3 focus:outline-violet-700"
              type="text"
            />
          </div>
        </form>
        {!completedCreatingToken && (
          <div className="flex flex-col items-center gap-7 justify-center ">
            {tokenName &&
              tokenSymbol &&
              // decimal &&
              supply &&
              description &&
              !mintBtnShow && (
                <>
                  {/* {!fullfilledAirdrop && (
                <Button onClick={() => airdrop()}>
                  {!airdropStatus ? "Airdrop 1 SOL" : "Airdropping"}
                </Button>
              )} */}

                  <ProgressButton
                    onClick={() => {
                      setError(false);
                      createTok();
                    }}
                    disabled={createTokeNStatus}
                    inc={1}
                  >
                    {!createTokeNStatus ? "Create" : "Creating..."}
                  </ProgressButton>
                </>
              )}
            {mintBtnShow && (
              <div>
                <ProgressButton
                  onClick={mint}
                  disabled={mintTokenStatus}
                  inc={3}
                >
                  {!mintTokenStatus ? "Mint" : "Minting..."}
                </ProgressButton>
              </div>
            )}
            {createTokeNStatus && (
              <p className="text-yellow-600 text-sm">
                Please do not refresh or leave this page.
              </p>
            )}
            {error && (
              <p className="text-rose-700 text-sm">
                Some problem with Solana network while creating ATA. Please try
                again.
              </p>
            )}
            {mintTokenStatus && (
              <p className="text-yellow-600 text-sm">
                Please do not refresh or leave this page.
              </p>
            )}
          </div>
        )}
        {completedCreatingToken && (
          <>
            <p className="text-center text-violet-500 text-xs lg:text-sm mb-6">
              Token successfully created and minted. Verify in Manage Wallets
              section.
            </p>
            <div className="flex justify-center">
              <Button
                type={Type.danger}
                onClick={() =>
                  navigator.clipboard.writeText(
                    `[${mintWall.privKeyArr?.toString()!}]`
                  )
                }
              >
                Copy Private Key
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TokenForm;
