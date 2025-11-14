import React, { useState, useEffect } from "react";
import supabase from "../config/supabase";
import { getWeatherByDate } from "../services/weatherService";
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
import { useNavigate } from "react-router";

export default function PlanHike() {
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    groupSize: "1",
    experienceLevel: "intermediate",
    duration: "half-day",
    weight: 170,
    age: 30,
    height: 68,
  });

  const [showWeather, setShowWeather] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popularTrails, setPopularTrails] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [successfulPlan, setSuccessfulPlan] = useState(false);
  const navigate = useNavigate();

  // Fetch popular trails on mount
  useEffect(() => {
    fetchPopularTrails();
  }, []);

  // Fetch weather when BOTH trail and date are selected
  useEffect(() => {
    if (selectedTrail?.latitude && selectedTrail?.longitude && formData.date) {
      fetchWeather();
    }
  }, [selectedTrail, formData.date]);

  const fetchWeather = async () => {
    if (
      !selectedTrail?.latitude ||
      !selectedTrail?.longitude ||
      !formData.date
    ) {
      return;
    }

    console.log(
      "Fetching weather for:",
      selectedTrail.name,
      "on",
      formData.date
    );
    setWeatherLoading(true);

    const weatherData = await getWeatherByDate(
      selectedTrail.latitude,
      selectedTrail.longitude,
      formData.date
    );

    console.log("Weather data:", weatherData);
    setWeather(weatherData);
    setWeatherLoading(false);
    setShowWeather(true);
  };

  const fetchPopularTrails = async () => {
    console.log("Fetching popular trails...");

    const { data, error } = await supabase
      .from("trails")
      .select("*")
      .order("popularity", { ascending: false })
      .order("avg_rating", { ascending: false })
      .limit(4);

    console.log("Popular trails:", data);
    console.log("Popular trails error:", error);

    if (error) {
      console.error("Error fetching popular trails:", error);
    } else {
      setPopularTrails(data || []);
    }
  };

  const searchTrails = async () => {
    if (!searchTerm || searchTerm.length < 2) {
      alert("Please enter at least 2 characters");
      return;
    }

    console.log("=== SEARCH DEBUG ===");
    console.log("Search term:", searchTerm);
    console.log("Supabase client:", supabase);

    const { data, error, status, statusText } = await supabase
      .from("trails")
      .select("*")
      .ilike("name", `%${searchTerm}%`)
      .limit(20);

    console.log("Status:", status);
    console.log("Status text:", statusText);
    console.log("Data:", data);
    console.log("Data length:", data?.length);
    console.log("Error:", error);
    console.log("===================");

    if (error) {
      console.error("Error searching trails:", error);
      alert("Search failed: " + error.message);
    } else {
      console.log("Setting search results:", data);
      setSearchResults(data || []);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTrailSelect = (trail) => {
    console.log("Selected trail:", trail);
    setSelectedTrail(trail);
    setFormData((prev) => ({
      ...prev,
      location: trail.name,
    }));
    setSearchResults([]);
    setSearchTerm("");
    // Weather will be fetched by useEffect when date is available
  };

  const handleSubmit = async () => {
    if (!selectedTrail) {
      alert("Please select a trail from the search results");
      return;
    }

    setLoading(true);

    try {
      // Prepare data for Python API
      const requestData = {
        hike: {
          name: selectedTrail.name,
          length: selectedTrail.length || 8000,
          elevation_gain: selectedTrail.elevation_gain || 500,
          difficulty_rating: selectedTrail.difficulty_rating || 3,
          features: JSON.stringify(selectedTrail.features || []),
          visitor_usage: selectedTrail.visitor_usage || 2,
          state_name: selectedTrail.state_name || "California",
          altitude_ft: selectedTrail.altitude_ft || 1000,
        },
        user: {
          weight_lbs: Number(formData.weight),
          age: Number(formData.age),
          height_inches: Number(formData.height),
          pack_weight_lbs: 15,
          experience: formData.experienceLevel,
        },
        weather: {
          temperature_f: weather?.temperature || 72,
          humidity_percent: weather?.humidity || 55,
          wind_mph: weather?.windSpeed || 8,
          forecast: getWeatherForecast(weather),
          season: getSeason(formData.date),
        },
      };

      const response = await fetch(
        "http://localhost:8080/api/recommendations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      setRecommendations(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      alert("Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSeason = (dateString) => {
    const month = new Date(dateString).getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "fall";
    return "winter";
  };

  const getWeatherForecast = (weather) => {
    if (!weather) return "clear";
    const desc = weather.description.toLowerCase();
    if (desc.includes("rain") || desc.includes("drizzle")) return "rain";
    if (desc.includes("snow")) return "snow";
    if (desc.includes("cloud")) return "cloudy";
    return "clear";
  };

  const handlePlanSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in to save your hiking plan");
      return;
    }

    const { data, error } = await supabase
      .from("planned_hikes")
      .insert({
        user_id: user.id,
        trail_id: selectedTrail.trail_id,
        hike_date: formData.date,
        group_size: parseInt(formData.groupSize),
        user_weight_lbs: formData.weight,
        user_age: formData.age,
        user_height_inches: formData.height,
        experience_level: formData.experienceLevel,
        recommendations: recommendations,
        status: "planned",
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving plan:", error);
      alert("Failed to save plan: " + error.message);
    } else {
      setSuccessfulPlan(true);
      console.log("Saved plan:", data);
      navigate("/yourtrails");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-24">
      <div className="max-w-3xl ml-8">
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Plan a hike</h1>
          <p className="text-gray-600">Tell us about your adventure</p>
        </div>

        <div className="space-y-6">
          {/* Location Input with Search */}
          <div>
            <label className="block text-gray-700 mb-3 text-lg">
              Where are you hiking?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchTrails()}
                placeholder="Search for a trail..."
                className="flex-1 px-5 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white"
              />
              <button
                onClick={searchTrails}
                className="px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {searchResults.map((trail) => (
                  <button
                    key={trail.id}
                    onClick={() => handleTrailSelect(trail)}
                    className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-gray-900 font-medium">
                        {trail.name}
                      </span>
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{trail.area_name}</span>
                      <span>•</span>
                      <span>{(trail.length * 0.000621371).toFixed(1)} mi</span>
                      {trail.difficulty_rating && (
                        <>
                          <span>•</span>
                          <span>Difficulty {trail.difficulty_rating}/7</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Show selected trail */}
            {formData.location && (
              <div className="mt-2 text-sm text-emerald-600">
                ✓ Selected: {formData.location}
              </div>
            )}
          </div>

          {/* Popular Trails */}
          {!formData.location && popularTrails.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-3">Popular trails</p>
              <div className="grid grid-cols-2 gap-3">
                {popularTrails.map((trail) => (
                  <button
                    key={trail.id}
                    onClick={() => handleTrailSelect(trail)}
                    className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-gray-900">{trail.name}</span>
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{trail.area_name}</span>
                      <span>•</span>
                      <span>{(trail.length * 0.000621371).toFixed(1)} mi</span>
                    </div>
                  </button>
                ))}
              </div>
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
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white"
            />
          </div>

          {/* Weather Banner */}
          {showWeather && (
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white my-8">
              {weatherLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="mt-2">Loading weather forecast...</p>
                </div>
              ) : weather ? (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-blue-100 mb-1">
                        {weather.isForecast
                          ? `${weather.daysAway}-day forecast for ${formData.location}`
                          : `Estimated weather for ${formData.location}`}
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                          alt={weather.description}
                          className="w-16 h-16"
                        />
                        <div>
                          <p className="text-5xl">{weather.temperature}°F</p>
                          <p className="text-blue-100 capitalize">
                            {weather.description}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4" />
                          <span>{weather.pop}% rain</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="w-4 h-4" />
                          <span>{weather.windSpeed} mph wind</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CloudRain className="w-4 h-4" />
                          <span>{weather.humidity}% humidity</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-100 mb-1">High / Low</p>
                      <p className="text-2xl">
                        {weather.tempMax}° / {weather.tempMin}°
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-400">
                    {!weather.isForecast && (
                      <p className="text-xs text-blue-200 mb-2">
                        ⚠️ Date is more than 5 days away. Showing current
                        weather as estimate.
                      </p>
                    )}
                    <p className="text-sm text-blue-50">
                      {weather.pop > 60
                        ? "⚠️ High chance of rain! Bring rain gear and waterproof bags."
                        : weather.temperature > 85
                        ? "🌡️ Hot conditions! Bring extra water and sun protection."
                        : weather.temperature < 40
                        ? "❄️ Cold weather! Dress in layers and bring warm gear."
                        : "✓ Good conditions for hiking! Check forecast again closer to your date."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p>Weather data unavailable for this location</p>
                  <p className="text-sm text-blue-100 mt-2">
                    {!selectedTrail?.latitude || !selectedTrail?.longitude
                      ? "Trail coordinates not found"
                      : "Unable to fetch weather forecast"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Additional Info Section */}
          {showWeather && (
            <div className="space-y-6 pt-4">
              <h2 className="text-2xl text-gray-900">Tell us more</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <option value="experienced">Experienced</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Height (inches)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                  />
                </div>
              </div>

              {!showResults && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg disabled:opacity-50"
                >
                  {loading ? "Calculating..." : "Get my packing list"}
                </button>
              )}
            </div>
          )}

          {/* Results Section */}
          {showResults && recommendations && (
            <div className="mt-8 space-y-6">
              <h2 className="text-2xl text-gray-900">Your hiking plan</h2>

              {/* Trail Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Trail Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Distance</p>
                    <p className="text-gray-900 font-medium">
                      {recommendations.trail_info.distance_miles.toFixed(1)}{" "}
                      miles
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Elevation Gain</p>
                    <p className="text-gray-900 font-medium">
                      {recommendations.trail_info.elevation_gain_ft.toFixed(0)}{" "}
                      ft
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Difficulty</p>
                    <p className="text-gray-900 font-medium">
                      {recommendations.trail_info.difficulty_level}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated Time</p>
                    <p className="text-gray-900 font-medium">
                      {recommendations.time.estimated_hours} hours
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  {recommendations.trail_info.description}
                </p>
              </div>

              {/* Water & Food */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Water & Nutrition
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Water needed</span>
                    <span className="text-gray-900 font-medium">
                      {recommendations.water.total_liters} L (
                      {recommendations.water.total_ounces} oz)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Bottles needed</span>
                    <span className="text-gray-900 font-medium">
                      {recommendations.water.bottles_needed} bottles
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Calories burned</span>
                    <span className="text-gray-900 font-medium">
                      {recommendations.food.calories_burned} cal
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Food to bring</span>
                    <span className="text-gray-900 font-medium">
                      {recommendations.food.food_weight_lbs} lbs
                    </span>
                  </div>
                </div>
                <p className="text-sm text-emerald-600 mt-4">
                  {recommendations.water.hydration_tip}
                </p>
              </div>

              {/* Gear List */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Recommended Gear
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pack size: {recommendations.gear.pack_size} | Estimated
                  weight: {recommendations.gear.estimated_pack_weight_lbs} lbs
                </p>

                {Object.entries(recommendations.gear.gear_by_category).map(
                  ([category, items]) =>
                    items.length > 0 && (
                      <div key={category} className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-2 capitalize">
                          {category.replace(/_/g, " ")}
                        </h4>
                        <ul className="space-y-1">
                          {items.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-600 flex items-start"
                            >
                              <span className="text-emerald-500 mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                )}
              </div>

              {/* Safety Notes */}
              <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Safety Notes
                </h3>
                <ul className="space-y-2">
                  {recommendations.safety_notes.map((note, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {showResults && (
          <button
            onClick={handlePlanSubmit}
            className="w-full bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg mt-10"
          >
            {successfulPlan
              ? "Your hike has been planned!"
              : "Save my hiking plan!"}
          </button>
        )}
      </div>
    </div>
  );
}
