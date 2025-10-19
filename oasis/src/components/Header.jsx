import React from "react";
import { Link } from "react-router";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/">
            <div className="flex items-center">
              <span style={{ color: "#2E6F40" }} className="text-3xl font-bold">
                Oasis Project
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to={"/login"}>
              <button className="px-4 py-2 text-gray-700 hover:text-green-800 font-medium transition-colors cursor-pointer">
                Log In
              </button>
            </Link>

            <Link to="signup">
              <button
                style={{ backgroundColor: "#2E6F40" }}
                className="px-5 py-2 text-white rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
              >
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
