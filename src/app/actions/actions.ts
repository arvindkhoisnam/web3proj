import { generateMnemonic } from "bip39";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Keypair,
  clusterApiUrl,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  ExtensionType,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
  getTokenMetadata,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";

const URL = process.env.NEXT_PUBLIC_API_URL;

export function generate() {
  const mnemonic = generateMnemonic();
  return mnemonic;
}

export function createWallet(mnemonicString: string, id: number) {
  const seed = mnemonicToSeedSync(mnemonicString);

  const sol = `m/44'/501'/${id}'/0'`;
  const derivedSeed = derivePath(sol, seed.toString("hex")).key;
  const solSecret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  const privateKey = Array.from(solSecret);
  const publicKey = Keypair.fromSecretKey(solSecret).publicKey;
  return { publicKey, privateKey };
}

export async function createWalletFromPrivateKey(privateKey: string) {
  const connection = new Connection(clusterApiUrl("devnet"));
  const res = JSON.parse(privateKey);
  const uint = new Uint8Array(res);
  const publicKey = Keypair.fromSecretKey(uint).publicKey;
  const publicKeyStr = Keypair.fromSecretKey(uint).publicKey.toBase58();
  const wallet = await connection.getAccountInfo(publicKey);
  return { wallet, publicKeyStr };
}

export async function airdropSol(publicKey: string, amount: number) {
  const connection = new Connection(URL!, "confirmed");
  // const connection = new Connection(clusterApiUrl("devnet"));
  await new Promise((res) => {
    return setTimeout(() => {
      res("15 secs timer");
    }, 15000);
  }).then((res) => console.log(res));

  const airdropSignature = await connection.requestAirdrop(
    new PublicKey(publicKey),
    amount * LAMPORTS_PER_SOL
  );
  // const res = await connection.confirmTransaction(airdropSignature);

  return airdropSignature;
}

export const getAirdrop = async (publicKey: string, amount: number) => {
  try {
    if (!publicKey) {
      throw new Error("Wallet is not Connected");
    }
    // const connection = new Connection(clusterApiUrl("devnet"));
    const connection = new Connection(URL!);
    const [latestBlockhash, signature] = await Promise.all([
      connection.getLatestBlockhash(),
      connection.requestAirdrop(
        new PublicKey(publicKey),
        amount * LAMPORTS_PER_SOL
      ),
    ]);
    const sigResult = await connection.confirmTransaction(
      { signature, ...latestBlockhash },
      "confirmed"
    );
    return signature;
  } catch (err) {
    throw new Error("Problem while airdropping");
  }
};

export async function createToken(
  privKey: number[],
  tokenName: string,
  tokenSymbol: string,
  image: string
) {
  const payer = Keypair.fromSecretKey(Uint8Array.from(privKey));

  const mint = Keypair.generate();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const decimals = 9;

  const metadata: TokenMetadata = {
    mint: mint.publicKey,
    name: tokenName,
    symbol: tokenSymbol,
    uri: image,
    additionalMetadata: [["new-field", "new-value"]],
  };

  const mintLen = getMintLen([ExtensionType.MetadataPointer]);

  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

  const mintLamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen
  );
  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint.publicKey,
      space: mintLen,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mint.publicKey,
      payer.publicKey,
      mint.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mint.publicKey,
      decimals,
      payer.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mint.publicKey,
      metadata: mint.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: payer.publicKey,
      updateAuthority: payer.publicKey,
    })
  );

  const res = await sendAndConfirmTransaction(connection, mintTransaction, [
    payer,
    mint,
  ]);
  return { res, mint };
}

export async function createATA(privKey: number[], mint: PublicKey) {
  const payer = Keypair.fromSecretKey(Uint8Array.from(privKey));

  const connection = new Connection(clusterApiUrl("devnet"));

  await new Promise((resolve) => setTimeout(resolve, 45000)); // 35 seconds delay
  console.log("Delay from server of 45 secs, Creating ATA");
  try {
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
      true,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    return ata;
  } catch (err) {
    throw new Error(
      "Some problem with Solana network while creating ATA.",
      err!
    );
  }
}

export async function mintToken(
  privKey: number[],
  mint: PublicKey,
  ata: PublicKey,
  amount: number
) {
  try {
    const payer = Keypair.fromSecretKey(Uint8Array.from(privKey));
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    console.log("Waiting for ATA to be confirmed...");

    // Artificial delay to wait for ATA confirmation (can be adjusted)
    await new Promise((resolve) => setTimeout(resolve, 20000)); // 15 seconds delay

    // Validate inputs before calling mintTo
    console.log("Minting token after delay...");
    const tokens = await mintTo(
      connection,
      payer,
      mint,
      ata,
      payer.publicKey,
      amount,
      [],
      { commitment: "finalized" },
      TOKEN_2022_PROGRAM_ID
    );

    console.log("Minting Success:", tokens);
    return tokens;
  } catch (error) {
    console.error("Error during token minting:", error);
    throw error;
  }
}

export async function fetchWallet(pubKey: string) {
  // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const connection = new Connection(clusterApiUrl("devnet"));
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(pubKey),
    {
      programId: TOKEN_2022_PROGRAM_ID,
    }
  );

  return tokenAccounts;
}

export async function getTokenMeta(mint: PublicKey) {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const res = await getTokenMetadata(connection, mint);
  return res;
}

export async function solBal(mint: PublicKey) {
  const connection = new Connection(clusterApiUrl("devnet"));
  const bal = await connection.getBalance(mint);
  return bal;
}
