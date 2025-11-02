import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-screen w-48 bg-white shadow-lg">
      <div className="p-6">
        <Link to="/dashboard">
          <p className="text-xl font-semibold text-gray-800">RouteReady</p>
        </Link>
      </div>

      <div className="space-y-2">
        <div className="flex-none flex items-center justify-start hover:bg-gray-100 rounded-md transition-colors w-full pl-4">
          <img src="/images/home.svg" />
          <Link to="/dashboard" className="block px-4 py-2 text-gray-700">
            Dashboard
          </Link>
        </div>

        <div className="flex-none flex items-center justify-start hover:bg-gray-100 rounded-md transition-colors w-full pl-4">
          <img src="/images/navigation.svg" />
          <Link to="/yourtrails" className="block px-4 py-2 text-gray-700">
            Planned Hikes
          </Link>
        </div>
      </div>
    </div>
  );
}
