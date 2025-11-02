import React, { useState } from "react";
import {
  Mountain,
  Calendar,
  Users,
  Activity,
  Sun,
  Droplets,
  Wind,
  CloudRain,
  TrendingUp,
  MapPin,
} from "lucide-react";

export default function PlanHike() {
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    groupSize: "1",
    experienceLevel: "beginner",
    duration: "half-day",
  });

  const [showWeather, setShowWeather] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "location" && value && formData.date) {
      setShowWeather(true);
    }
    if (name === "date" && value && formData.location) {
      setShowWeather(true);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const popularTrails = [
    { name: "Yosemite Falls", difficulty: "Moderate", distance: "7.2 mi" },
    { name: "Mount Tamalpais", difficulty: "Easy", distance: "4.5 mi" },
    { name: "Half Dome", difficulty: "Hard", distance: "14.2 mi" },
    { name: "Muir Woods", difficulty: "Easy", distance: "2.1 mi" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-18">
      <div className="max-w-3xl ml-8">
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Plan a hike</h1>
          <p className="text-gray-600">Tell us about your adventure</p>
        </div>

        <div className="space-y-6">
          {/* Location Input */}
          <div>
            <label className="block text-gray-700 mb-3 text-lg">
              Where are you hiking?
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Yosemite Valley, Mount Tamalpais, etc."
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white"
            />
          </div>

          {/* Popular Trails - Only show when location is empty */}
          {!formData.location && (
            <div className="grid grid-cols-2 gap-3">
              {popularTrails.map((trail, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    handleInputChange({
                      target: { name: "location", value: trail.name },
                    })
                  }
                  className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-gray-900">{trail.name}</span>
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{trail.difficulty}</span>
                    <span>•</span>
                    <span>{trail.distance}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Date Input */}
          <div>
            <label className="block text-gray-700 mb-3 text-lg">When?</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white"
            />
          </div>

          {/* Weather Banner */}
          {showWeather && (
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white my-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-blue-100 mb-1">
                    Weather forecast for {formData.location}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <Sun className="w-16 h-16" />
                    <div>
                      <p className="text-5xl">72°</p>
                      <p className="text-blue-100">Mostly sunny</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4" />
                      <span>10% rain</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4" />
                      <span>8 mph wind</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4" />
                      <span>55% humidity</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100 mb-1">High / Low</p>
                  <p className="text-2xl">75° / 58°</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-400">
                <p className="text-sm text-blue-50">
                  Perfect conditions for hiking! Remember sunscreen and plenty
                  of water.
                </p>
              </div>
            </div>
          )}

          {/* Additional Info Section */}
          {showWeather && (
            <div className="space-y-6 pt-4">
              <h2 className="text-2xl text-gray-900">Tell us more</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    <Users className="w-5 h-5 inline mr-2 text-gray-500" />
                    Group size
                  </label>
                  <select
                    name="groupSize"
                    value={formData.groupSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                  >
                    <option value="1">Solo</option>
                    <option value="2">2 people</option>
                    <option value="3-4">3-4 people</option>
                    <option value="5+">5+ people</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    <Activity className="w-5 h-5 inline mr-2 text-gray-500" />
                    Experience level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Mountain className="w-5 h-5 inline mr-2 text-gray-500" />
                  Trip duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                >
                  <option value="half-day">Half day (2-4 hours)</option>
                  <option value="full-day">Full day (4-8 hours)</option>
                  <option value="overnight">Overnight</option>
                  <option value="multi-day">Multi-day</option>
                </select>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg"
              >
                Get my packing list
              </button>
            </div>
          )}

          {/* Results Section */}
          {showResults && (
            <div className="mt-8 space-y-6">
              <h2 className="text-2xl text-gray-900">Your packing list</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg text-gray-800 mb-3">Essentials</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-700">Water</span>
                      <span className="text-gray-900">2-3 liters</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-700">Energy snacks</span>
                      <span className="text-gray-900">3-4 items</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-700">First aid kit</span>
                      <span className="text-gray-900">1</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-700">Map or GPS device</span>
                      <span className="text-gray-900">1</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-gray-800 mb-3">
                    Clothing & gear
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-700">Rain jacket</span>
                      <span className="text-gray-900">1</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-700">Extra layers</span>
                      <span className="text-gray-900">2-3 pieces</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-700">Sunscreen SPF 30+</span>
                      <span className="text-gray-900">1 bottle</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-700">Headlamp</span>
                      <span className="text-gray-900">1</span>
                    </div>
                  </div>
                </div>

                {formData.duration === "overnight" ||
                formData.duration === "multi-day" ? (
                  <div>
                    <h3 className="text-lg text-gray-800 mb-3">Camping gear</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                        <span className="text-gray-700">Tent</span>
                        <span className="text-gray-900">1</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                        <span className="text-gray-700">Sleeping bag</span>
                        <span className="text-gray-900">1 per person</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                        <span className="text-gray-700">Sleeping pad</span>
                        <span className="text-gray-900">1 per person</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                        <span className="text-gray-700">Camp stove & fuel</span>
                        <span className="text-gray-900">1 set</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
