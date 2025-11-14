import React, { useState } from 'react';
import {
  Mountain,
  Calendar,
  Users,
  Activity,
  Sun,
  Droplets,
  Wind,
  Clock,
  Trash2,
  CheckCircle,
} from "lucide-react";

export default function PlannedTrails() {
  const [plannedHikes, setPlannedHikes] = useState([
    {
      id: 1,
      location: "Yosemite Falls",
      date: "2024-12-20",
      groupSize: "2",
      experienceLevel: "intermediate",
      duration: "full-day",
      weather: {
        temp: 72,
        condition: "Mostly sunny",
        rain: 10,
        wind: 8,
        humidity: 55,
        high: 75,
        low: 58,
      },
      packingList: {
        essentials: ["Water (2-3 liters)", "Energy snacks", "First aid kit", "Map or GPS device"],
        clothing: ["Rain jacket", "Extra layers", "Sunscreen SPF 30+", "Headlamp"],
      },
      completed: false,
    },
    {
      id: 2,
      location: "Mount Tamalpais",
      date: "2024-12-15",
      groupSize: "1",
      experienceLevel: "beginner",
      duration: "half-day",
      weather: {
        temp: 68,
        condition: "Partly cloudy",
        rain: 20,
        wind: 12,
        humidity: 60,
        high: 70,
        low: 55,
      },
      packingList: {
        essentials: ["Water (2-3 liters)", "Energy snacks", "First aid kit", "Map or GPS device"],
        clothing: ["Rain jacket", "Extra layers", "Sunscreen SPF 30+", "Headlamp"],
      },
      completed: false,
    },
    {
      id: 3,
      location: "Muir Woods",
      date: "2024-11-10",
      groupSize: "3-4",
      experienceLevel: "beginner",
      duration: "half-day",
      weather: {
        temp: 65,
        condition: "Overcast",
        rain: 40,
        wind: 10,
        humidity: 70,
        high: 67,
        low: 52,
      },
      packingList: {
        essentials: ["Water (2-3 liters)", "Energy snacks", "First aid kit", "Map or GPS device"],
        clothing: ["Rain jacket", "Extra layers", "Sunscreen SPF 30+", "Headlamp"],
      },
      completed: true,
    },
  ]);

  const [expandedHike, setExpandedHike] = useState(null);

  function handleDelete(id) {
    setPlannedHikes(plannedHikes.filter((hike) => hike.id !== id));
  }

  function handleToggleComplete(id) {
    setPlannedHikes(
      plannedHikes.map((hike) =>
        hike.id === id ? { ...hike, completed: !hike.completed } : hike
      )
    );
  }

  function toggleExpand(id) {
    setExpandedHike(expandedHike === id ? null : id);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  const upcomingHikes = plannedHikes.filter((hike) => !hike.completed);
  const completedHikes = plannedHikes.filter((hike) => hike.completed);

  return (
    <div className="min-h-screen bg-gray-50 p-24">
      <div className="max-w-4xl ml-8">
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Your planned trails</h1>
          <p className="text-gray-600">
            Manage your upcoming and completed hikes
          </p>
        </div>

        {/* Upcoming Hikes Section */}
        <div className="mb-12">
          <h2 className="text-2xl text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Upcoming hikes
            <span className="text-lg text-gray-500 ml-2">
              ({upcomingHikes.length})
            </span>
          </h2>

          {upcomingHikes.length === 0 ? (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">
                No upcoming hikes planned
              </p>
              <p className="text-gray-500">
                Start planning your next adventure!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingHikes.map((hike) => (
                <div
                  key={hike.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Hike Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleExpand(hike.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl text-gray-900">
                            {hike.location}
                          </h3>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                            {hike.experienceLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(hike.date)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(hike.id);
                          }}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Mark as complete"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(hike.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete hike"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {hike.groupSize === "1" ? "Solo" : `${hike.groupSize} people`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {hike.duration === "half-day"
                            ? "Half day"
                            : hike.duration === "full-day"
                            ? "Full day"
                            : hike.duration === "overnight"
                            ? "Overnight"
                            : "Multi-day"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Sun className="w-4 h-4" />
                        <span className="text-sm">
                          {hike.weather.temp}° {hike.weather.condition}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedHike === hike.id && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      {/* Weather Details */}
                      <div className="mb-6">
                        <h4 className="text-lg text-gray-900 mb-3">
                          Weather forecast
                        </h4>
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4 text-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <Sun className="w-12 h-12" />
                              <div>
                                <p className="text-3xl">{hike.weather.temp}°</p>
                                <p className="text-blue-100">
                                  {hike.weather.condition}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-blue-100 mb-1">
                                High / Low
                              </p>
                              <p className="text-xl">
                                {hike.weather.high}° / {hike.weather.low}°
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Droplets className="w-4 h-4" />
                              <span>{hike.weather.rain}% rain</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wind className="w-4 h-4" />
                              <span>{hike.weather.wind} mph wind</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4" />
                              <span>{hike.weather.humidity}% humidity</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Packing List */}
                      <div>
                        <h4 className="text-lg text-gray-900 mb-3">
                          Your packing list
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm text-gray-700 mb-2 font-medium">
                              Essentials
                            </h5>
                            <div className="space-y-2">
                              {hike.packingList.essentials.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-gray-600 text-sm"
                                >
                                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm text-gray-700 mb-2 font-medium">
                              Clothing & gear
                            </h5>
                            <div className="space-y-2">
                              {hike.packingList.clothing.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-gray-600 text-sm"
                                >
                                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Hikes Section */}
        {completedHikes.length > 0 && (
          <div>
            <h2 className="text-2xl text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-gray-600" />
              Completed hikes
              <span className="text-lg text-gray-500 ml-2">
                ({completedHikes.length})
              </span>
            </h2>

            <div className="space-y-4">
              {completedHikes.map((hike) => (
                <div
                  key={hike.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-xl text-gray-900">
                          {hike.location}
                        </h3>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 ml-8">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(hike.date)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(hike.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete hike"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
