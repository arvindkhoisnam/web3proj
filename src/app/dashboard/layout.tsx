import React from "react";
import Sidebar from "../components/Sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-900">
      <div className="grid grid-cols-6 max-w-screen-2xl mx-auto">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
