import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

export default function SignedInLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
