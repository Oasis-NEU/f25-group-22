import React from "react";
import { Link } from "react-router-dom";
import {
  Mountain,
  ArrowRight,
  Calendar,
  MapPin,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen p-18">
      <div className="max-w-4xl ml-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <p className="text-gray-500 text-sm">Welcome back</p>
          <h1 className="text-3xl text-gray-900">Hey Alex</h1>
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
            <p className="text-2xl text-gray-900">3</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <p className="text-gray-600 text-sm">Trails explored</p>
            </div>
            <p className="text-2xl text-gray-900">12</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-base text-gray-900 mb-4">Recent activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-700 text-sm flex-1">
                Completed Mount Tamalpais trail
              </span>
              <span className="text-gray-400 text-xs">2 days ago</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 text-sm flex-1">
                Saved Yosemite Falls to favorites
              </span>
              <span className="text-gray-400 text-xs">5 days ago</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 text-sm flex-1">
                Joined Sierra Club meetup
              </span>
              <span className="text-gray-400 text-xs">1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
