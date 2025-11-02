import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

export default function SignedInLayout() {
  return (
    <div className="flex">
      <div className="fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 ml-32">
        {" "}
        <Outlet />
      </main>
    </div>
  );
}
