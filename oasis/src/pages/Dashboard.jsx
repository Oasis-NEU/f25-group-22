import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../config/supabase";
import {
  Mountain,
  ArrowRight,
  Calendar,
  MapPin,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    upcomingHikes: 0,
    completedHikes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all user's planned hikes
      const { data: hikes, error } = await supabase
        .from("planned_hikes")
        .select("status")
        .eq("user_id", user.id);

      if (error) throw error;

      // Count upcoming (planned) and completed hikes
      const upcoming = hikes.filter((hike) => hike.status === "planned").length;
      const completed = hikes.filter(
        (hike) => hike.status === "completed"
      ).length;

      setStats({
        upcomingHikes: upcoming,
        completedHikes: completed,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-24">
      <div className="max-w-4xl ml-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl text-gray-900">Welcome back!</h1>
        </div>

        {/* CTA Section */}
        <div className="bg-emerald-600 rounded-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Mountain className="w-5 h-5" />
            <span className="text-sm">Ready for adventure?</span>
          </div>
          <h2 className="text-2xl mb-3">Plan your next hike</h2>
          <p className="text-emerald-100 mb-4 text-sm">
            Discover trails, check weather conditions, and create your perfect
            hiking experience
          </p>
          <Link to="/planhike">
            <button className="bg-white text-emerald-600 px-5 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm cursor-pointer">
              Start planning
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-6">
          <h3 className="text-emerald-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trail tips
          </h3>
          <div className="space-y-2 text-sm text-emerald-800">
            <p>• Start early to avoid crowds and afternoon heat</p>
            <p>• Check trail conditions and closures before you go</p>
            <p>• Always tell someone your hiking plan</p>
            <p>• Pack the 10 essentials for any day hike</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <p className="text-gray-600 text-sm">Upcoming hikes</p>
            </div>
            {loading ? (
              <div className="h-8 flex items-center">
                <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
              </div>
            ) : (
              <p className="text-2xl text-gray-900">{stats.upcomingHikes}</p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <p className="text-gray-600 text-sm">Trails explored</p>
            </div>
            {loading ? (
              <div className="h-8 flex items-center">
                <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
              </div>
            ) : (
              <p className="text-2xl text-gray-900">{stats.completedHikes}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
