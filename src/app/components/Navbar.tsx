"use client";
import { usePathname, useRouter } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRecoilState } from "recoil";
import { navigationModal, smallScreen } from "../utils/recoil";
import NavigationModal from "./NavigationModal";
import { SiBasicattentiontoken } from "react-icons/si";
function Navbar() {
  const route = useRouter();
  const currentPath = usePathname();
  const [smScreen, setSmScreen] = useRecoilState(smallScreen);
  const [navModal, setNavModal] = useRecoilState(navigationModal);
  return (
    <div className="sticky top-0 w-full bg-neutral-900 h-auto p-2 flex justify-between border-b border-neutral-700 z-30">
      <button
        onClick={() => route.push("/")}
        className="cursor-pointer flex justify-center items-center gap-2"
      >
        <span className="text-neutral-400">
          <SiBasicattentiontoken />
        </span>

        <span className="text-violet-500">
          <span className="text-white">All</span>Sol
        </span>
      </button>
      {smScreen && currentPath.startsWith("/dashboard") && (
        <button
          className="p-2 text-xl text-neutral-400 rounded-lg hover:bg-neutral-800 cursor-pointer"
          onClick={() => setNavModal(true)}
        >
          <RxHamburgerMenu />
        </button>
      )}
      {navModal && <NavigationModal />}
    </div>
  );
}

export default Navbar;
