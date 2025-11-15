import React from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../config/supabase";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Redirect to login page after logout
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out: " + error.message);
    }
  };

  return (
    <div className="h-screen w-58 bg-white shadow-lg flex flex-col">
      <div className="p-6">
        <Link to="/dashboard">
          <p className="text-xl font-semibold text-gray-800">RouteReady</p>
        </Link>
      </div>

      <div className="space-y-2 flex-1">
        <div className="flex-none flex items-center justify-start hover:bg-gray-100 rounded-md transition-colors w-full pl-4">
          <img src="/images/home.svg" alt="Home" />
          <Link to="/dashboard" className="block px-4 py-2 text-gray-700">
            Dashboard
          </Link>
        </div>

        <div className="flex-none flex items-center justify-start hover:bg-gray-100 rounded-md transition-colors w-full pl-4">
          <img src="/images/navigation.svg" alt="Navigation" />
          <Link to="/yourtrails" className="block px-4 py-2 text-gray-700">
            Planned Hikes
          </Link>
        </div>

        <div className="flex-none flex items-center justify-start hover:bg-gray-100 rounded-md transition-colors w-full pl-4">
          <img src="/images/trending-up.svg" alt="Trending" />
          <Link to="/recommended" className="block px-4 py-2 text-gray-700">
            Recommended Trails
          </Link>
        </div>
      </div>

      {/* Logout Button at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center justify-start hover:bg-red-50 rounded-md transition-colors w-full px-4 py-2 text-red-600 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
