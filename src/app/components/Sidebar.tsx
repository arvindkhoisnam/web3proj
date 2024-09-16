"use client";
import { RedirectType, usePathname, useRouter } from "next/navigation";
import Button, { Type } from "./Button";
import { use, useEffect, useState } from "react";
import { CKDPriv } from "ed25519-hd-key";
import { useRecoilState, useRecoilValue } from "recoil";
import { deleteAWall, smallScreen, Wallets } from "../utils/recoil";
import Wallet from "./Wallet";
function Sidebar() {
  const route = useRouter();
  const [active1, setActive1] = useState(true);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [smScreen, setSmScreen] = useRecoilState(smallScreen);
  const [wallets, setWallets] = useRecoilState(Wallets);
  const [deleteWallet, setDeleteWall] = useRecoilState(deleteAWall);

  const currentPath = usePathname();
  useEffect(() => {
    if (wallets.length === 0) {
      setDeleteWall(false);
    }
    switch (currentPath) {
      case "/dashboard":
        setActive1(true);
        setActive2(false);
        setActive3(false);
        break;
      case "/dashboard/token":
        setActive1(false);
        setActive2(true);
        setActive3(false);
        break;
      case "/dashboard/dapp":
        setActive1(false);
        setActive2(false);
        setActive3(true);
        break;
      default:
        setActive1(false);
        setActive2(false);
        setActive3(false);
        break;
    }
  }, [currentPath, wallets]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1224) {
        setSmScreen(true);
      } else {
        setSmScreen(false);
      }
    };
    // Initial check and event listener for window resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [setSmScreen, smScreen]);
  return (
    !smScreen && (
      <div className="h-screen bg-neutral-900 border-r border-neutral-700">
        <div className="flex flex-col p-5 gap-6 mt-24">
          <Button
            active={active1}
            onClick={() => {
              route.push("/dashboard");
            }}
          >
            Manage Wallets
          </Button>
          <Button
            active={active2}
            onClick={() => {
              route.push("/dashboard/token");
            }}
          >
            Mint Token
          </Button>
          <Button
            active={active3}
            onClick={() => {
              route.push("/dashboard/dapp");
            }}
          >
            Airdrop / Sign
          </Button>
          {wallets.length > 0 && (
            <Button
              type={Type.danger}
              onClick={() => {
                setDeleteWall((deleteWallet) => !deleteWallet);
                if (!deleteWallet) {
                  const updated = wallets.map((wallet) => {
                    return { ...wallet, delete: true };
                  });
                  setWallets([...updated]);
                } else {
                  const notDelete = wallets.map((wallet) => {
                    return { ...wallet, delete: false };
                  });
                  setWallets([...notDelete]);
                }
                route.push("/dashboard");
              }}
            >
              {deleteWallet ? "Cancel" : "Delete a Wallet"}
            </Button>
          )}
        </div>
      </div>
    )
  );
}

export default Sidebar;
