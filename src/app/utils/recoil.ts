import { atom } from "recoil";
import { PublicKey } from "@solana/web3.js";

export interface Token {
  tokenName: string;
  tokenSymbol: string;
  decimal: number;
  supply: number;
  image?: string;
  description?: string;
  value?: number;
  tokenMintObj: PublicKey | null;
  mintAuthority: string;
}
export interface WalletType {
  walletName: string;
  walletId: number;
  publicKey: string;
  pubKeyObj?: PublicKey | null;
  privateKey?: string;
  privKeyArr?: number[];
  sol?: number;
  tokenMint?: string;
  tokenMintObj?: PublicKey | null;
  ata?: {
    address?: PublicKey | null;
  };
  tokens: Token[];
  delete: boolean;
}
const modalState = atom({
  key: "modalState",
  default: false,
});

const Wallets = atom<WalletType[]>({
  key: "wallets",
  default: [],
});

const tokens = atom<Token>({
  key: "token",
  default: {
    tokenName: "",
    tokenSymbol: "",
    decimal: 6,
    supply: 1,
    image: "",
    description: "",
    value: 1,
    tokenMintObj: null,
    mintAuthority: "",
  },
});
const mintWallet = atom<WalletType>({
  key: "mintWallet",
  default: {
    walletName: "",
    publicKey: "",
    pubKeyObj: null,
    privKeyArr: [],
    privateKey: "",
    walletId: 0,
    sol: 0,
    tokenMint: "",
    tokenMintObj: null,
    ata: {
      address: null,
    },
    tokens: [],
    delete: false,
  },
});
const showWallet = atom<WalletType>({
  key: "showWallet",
  default: {
    walletName: "",
    publicKey: "",
    pubKeyObj: null,
    privKeyArr: [],
    privateKey: "",
    walletId: 0,
    sol: 0,
    tokenMint: "",
    tokenMintObj: null,
    ata: {
      address: null,
    },
    tokens: [],
    delete: false,
  },
});

const showSecretPhraseWallet = atom({
  key: "showSecretPhraseWallet",
  default: false,
});
const showSecretPhraseMint = atom({
  key: "showSecretPhraseMint",
  default: false,
});
const secretPhraseWallet = atom<string[]>({
  key: "secretPhraseWallet",
  default: [],
});
const secretPhraseMint = atom<string[]>({
  key: "secretPhraseMint",
  default: [],
});
const copiedSPWallet = atom({
  key: "copiedSecretPhraseWallet",
  default: false,
});
const copiedSPMint = atom({
  key: "copiedSecretPhraseMint",
  default: false,
});

const walletCount = atom({
  key: "walletCooun",
  default: 1,
});

const smallScreen = atom({
  key: "smallScreen",
  default: false,
});
const navigationModal = atom({
  key: "navigationModal",
  default: false,
});

const deleteAWall = atom({
  key: "delete",
  default: false,
});
export {
  modalState,
  Wallets,
  showWallet,
  showSecretPhraseWallet,
  showSecretPhraseMint,
  secretPhraseWallet,
  secretPhraseMint,
  copiedSPWallet,
  copiedSPMint,
  mintWallet,
  walletCount,
  smallScreen,
  navigationModal,
  deleteAWall,
};
