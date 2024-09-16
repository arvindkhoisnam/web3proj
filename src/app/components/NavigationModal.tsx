import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button, { Type } from "./Button";
import {
  deleteAWall,
  navigationModal,
  smallScreen,
  Wallets,
} from "../utils/recoil";
import { useRecoilState } from "recoil";

function NavigationModal() {
  const route = useRouter();
  const [smScreen, setSmScreen] = useRecoilState(smallScreen);
  const [navModal, setNavModal] = useRecoilState(navigationModal);
  const [active1, setActive1] = useState(true);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
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
  return (
    smScreen &&
    currentPath.startsWith("/dashboard") && (
      <div className="absolute top-16 right-2 border border-violet-500 rounded-xl z-50 bg-slate-800">
        <div className="flex flex-col p-3 gap-4">
          <Button
            active={active1}
            onClick={() => {
              route.push("/dashboard");
              setNavModal(false);
            }}
          >
            Manage Wallets
          </Button>
          <Button
            active={active2}
            onClick={() => {
              route.push("/dashboard/token");
              setNavModal(false);
            }}
          >
            Mint Token
          </Button>
          <Button
            active={active3}
            onClick={() => {
              route.push("/dashboard/dapp");
              setNavModal(false);
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
                setNavModal(false);
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

export default NavigationModal;
