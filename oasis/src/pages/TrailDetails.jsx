import React, { useState, useEffect } from "react";
import {
  MapPin,
  TrendingUp,
  Clock,
  Mountain,
  Star,
  Droplet,
  Flame,
  Backpack,
  AlertTriangle,
  Calendar,
  Thermometer,
  Wind,
  Cloud,
  CloudRain,
  Sun,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabase";

export default function TrailDetails({ trail: rawTrail, onBack }) {
  const navigate = useNavigate();
  const [savingPlan, setSavingPlan] = useState(false);
  const [showingRecs, setShowingRecs] = useState(false);

  const mockTrail = {
    id: 1,
    name: "Angel's Landing",
    location: "Zion National Park, Utah",
    difficulty: "Hard",
    difficulty_rating: 6,
    length: 5.4,
    elevation_gain: 1488,
    elevation: 1488,
    duration: "4-5 hours",
    rating: 4.8,
    reviews: 1247,
    image: "https://source.unsplash.com/800x600/?zion,angels-landing,hiking",
    description:
      "A strenuous hike with spectacular views and narrow ridges. Features chains for safety on exposed sections.",
    features: ["scenic-views", "wildlife", "rocky", "partially-paved"],
    area_name: "Zion National Park",
    state_name: "Utah",
    visitor_usage: 4,
    altitude_ft: 5790,
  };

  // Normalize trail data with defaults to prevent NaN
  const trail = {
    ...(rawTrail || mockTrail),
    difficulty_rating:
      rawTrail?.difficulty_rating || mockTrail.difficulty_rating,
    elevation_gain:
      rawTrail?.elevation_gain ||
      rawTrail?.elevation ||
      mockTrail.elevation_gain,
    elevation:
      rawTrail?.elevation_gain || rawTrail?.elevation || mockTrail.elevation,
    length: parseFloat(rawTrail?.length || mockTrail.length),
    altitude_ft:
      rawTrail?.altitude_ft ||
      rawTrail?.elevation_gain ||
      mockTrail.altitude_ft,
    visitor_usage: rawTrail?.visitor_usage || mockTrail.visitor_usage,
    state_name:
      rawTrail?.state_name ||
      rawTrail?.location?.split(",")[1]?.trim() ||
      mockTrail.state_name,
    area_name:
      rawTrail?.area_name ||
      rawTrail?.location?.split(",")[0]?.trim() ||
      mockTrail.area_name,
    features: rawTrail?.features || mockTrail.features,
  };

  const [showRecommendations, setShowRecommendations] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // User inputs
  const [userInputs, setUserInputs] = useState({
    weight_lbs: 150,
    age: 30,
    height_inches: 68,
    pack_weight_lbs: 10,
    experience: "intermediate",
    hike_date: new Date().toISOString().split("T")[0], // Today's date as default
  });

  // Weather inputs - will be fetched based on location
  const [weatherInputs, setWeatherInputs] = useState({
    temperature_f: 70,
    humidity_percent: 50,
    wind_mph: 5,
    forecast: "clear",
    season: "summer",
  });

  const [recommendations, setRecommendations] = useState(null);

  // Fetch weather data based on trail location and date
  useEffect(() => {
    if ((trail.state_name || trail.area_name) && userInputs.hike_date) {
      fetchWeatherData();
    }
  }, [trail.state_name, trail.area_name, userInputs.hike_date]);

  const fetchWeatherData = () => {
    setWeatherLoading(true);
    // Mock weather data based on location and date
    setTimeout(() => {
      const mockWeather = generateMockWeather(
        trail.state_name,
        trail.area_name,
        userInputs.hike_date
      );
      setWeatherInputs(mockWeather);
      setWeatherLoading(false);
    }, 500);
  };

  const handlePlanHike = async () => {
    // Check if user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in to save your hiking plan");
      navigate("/login"); // Adjust to your login route
      return;
    }

    // Check if recommendations have been calculated
    if (!recommendations) {
      alert("Please calculate recommendations first");
      return;
    }

    setSavingPlan(true);

    try {
      const { data, error } = await supabase
        .from("planned_hikes")
        .insert({
          user_id: user.id,
          trail_id: trail.trail_id || trail.id,
          hike_date: userInputs.hike_date,
          group_size: 1, // Default to solo, you can add a field for this
          user_weight_lbs: userInputs.weight_lbs,
          user_age: userInputs.age,
          user_height_inches: userInputs.height_inches,
          experience_level: userInputs.experience,
          recommendations: recommendations,
          status: "planned",
        })
        .select()
        .single();

      if (error) throw error;

      alert("Hike planned successfully!");
      navigate("/yourtrails"); // Navigate to planned hikes page
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("Failed to save plan: " + error.message);
    } finally {
      setSavingPlan(false);
    }
  };

  const generateMockWeather = (state, area, dateString) => {
    // Parse the selected date
    const selectedDate = new Date(dateString);
    const month = selectedDate.getMonth();

    // Determine season based on selected date
    let season = "summer";
    if (month >= 2 && month <= 4) season = "spring";
    else if (month >= 5 && month <= 8) season = "summer";
    else if (month >= 9 && month <= 10) season = "fall";
    else season = "winter";

    // Base temperature by season
    let temp = 70;
    if (season === "winter") temp = 35;
    else if (season === "spring") temp = 55;
    else if (season === "summer") temp = 75;
    else temp = 50;

    // Adjust for specific states
    const coldStates = [
      "Alaska",
      "Montana",
      "Wyoming",
      "Vermont",
      "Maine",
      "New Hampshire",
    ];
    const hotStates = ["Arizona", "Nevada", "New Mexico", "Texas", "Florida"];

    if (coldStates.includes(state)) temp -= 20;
    if (hotStates.includes(state)) temp += 20;

    // Add some randomness for realism
    temp += Math.floor(Math.random() * 10) - 5;

    // Precipitation likelihood by season
    let forecast = "clear";
    if (season === "winter") {
      forecast = Math.random() > 0.6 ? "snow" : "cloudy";
    } else if (season === "spring") {
      forecast = Math.random() > 0.5 ? "rain" : "cloudy";
    } else if (season === "fall") {
      forecast = Math.random() > 0.6 ? "rain" : "clear";
    }

    return {
      temperature_f: Math.max(temp, 0), // Don't go below 0
      humidity_percent:
        season === "summer" ? 65 : season === "spring" ? 70 : 45,
      wind_mph: 5 + Math.floor(Math.random() * 10),
      forecast: forecast,
      season: season,
    };
  };

  const getTerrainCoefficient = (terrainType) => {
    const coefficients = {
      paved: 1.0,
      maintained_trail: 1.2,
      grass: 1.08,
      rocky: 1.4,
      off_trail: 1.5,
      sand: 1.8,
      snow: 1.7,
      swamp: 3.5,
    };
    return coefficients[terrainType] || 1.2;
  };

  const parseTrailCharacteristics = (trailData) => {
    const features = trailData.features || [];

    const hasPaved =
      features.includes("paved") || features.includes("partially-paved");
    const hasForest = features.includes("forest");
    const hasRiver =
      features.includes("river") || features.includes("waterfall");
    const hasSnow = features.some((f) => ["snow", "ice"].includes(f));

    let terrainType = "maintained_trail";
    if (hasPaved) terrainType = "paved";
    else if (features.includes("sand")) terrainType = "sand";
    else if (features.includes("rocky")) terrainType = "rocky";

    const elevGain =
      parseFloat(trailData.elevation_gain) ||
      parseFloat(trailData.elevation) ||
      0;
    const diffRating = parseInt(trailData.difficulty_rating) || 3;
    const hasScrambling = diffRating >= 5 && elevGain > 2000;

    let remoteness = "moderate";
    const usage = parseInt(trailData.visitor_usage) || 2;
    if (usage >= 3) remoteness = "low";
    else if (usage >= 2) remoteness = "moderate";
    else remoteness = "high";

    const bearStates = [
      "Alaska",
      "Montana",
      "Wyoming",
      "Idaho",
      "Colorado",
      "Washington",
      "California",
      "Oregon",
      "Arizona",
      "New Mexico",
      "Utah",
      "Vermont",
      "New Hampshire",
      "Maine",
      "Minnesota",
      "Wisconsin",
      "Michigan",
      "New York",
      "Pennsylvania",
    ];
    const bearCountry = bearStates.includes(trailData.state_name);

    return {
      distanceMiles: parseFloat(trailData.length) || 0,
      elevationGainFt: elevGain,
      difficultyRating: diffRating,
      terrainType,
      hasRiverCrossing: hasRiver,
      hasSnowIce: hasSnow,
      hasScrambling,
      remoteness,
      bearCountry,
      features,
    };
  };

  const estimateHikeTime = (
    distance,
    elevationGain,
    difficulty,
    experience,
    packWeight = 10
  ) => {
    const naismithHours = distance / 3 + elevationGain / 2000;
    const bookTimeHours = distance / 2 + elevationGain / 2000;

    let baseTime;
    if (experience === "elite") baseTime = naismithHours;
    else if (experience === "experienced") baseTime = naismithHours * 1.1;
    else if (experience === "intermediate") baseTime = bookTimeHours;
    else baseTime = bookTimeHours * 1.3;

    let finalTime = baseTime;
    if (packWeight > 25) finalTime *= 1.5;
    else if (packWeight > 15) finalTime *= 1.1;

    return finalTime;
  };

  const calculateWaterAmount = () => {
    const trailChar = parseTrailCharacteristics(trail);
    const timeHours = estimateHikeTime(
      trailChar.distanceMiles,
      trailChar.elevationGainFt,
      trailChar.difficultyRating,
      userInputs.experience,
      userInputs.pack_weight_lbs
    );

    if (!timeHours || timeHours <= 0)
      return {
        totalLiters: 2,
        totalOunces: 67.6,
        estimatedHours: 2,
        ratePerHour: 1,
        bottlesNeeded: 3,
      };

    let baseRate = 0.5;
    if (trailChar.difficultyRating <= 2) baseRate = 0.5;
    else if (trailChar.difficultyRating <= 4) baseRate = 0.65;
    else if (trailChar.difficultyRating <= 5) baseRate = 0.8;
    else baseRate = 1.0;

    const baseWater = timeHours * baseRate;
    const elevationWater = (trailChar.elevationGainFt / 1000) * 0.5;
    let waterLiters = baseWater + elevationWater;

    let multiplier = 1.0;

    if (weatherInputs.temperature_f > 80) {
      const tempFactor = 1 + ((weatherInputs.temperature_f - 80) / 20) * 0.5;
      multiplier *= tempFactor;
    }

    const altFt = parseFloat(trail.altitude_ft) || 0;
    if (altFt > 8000) multiplier *= 1.25;
    if (weatherInputs.humidity_percent > 70) multiplier *= 1.2;
    if (weatherInputs.wind_mph > 15) multiplier *= 1.15;
    if (["sand", "desert"].includes(trailChar.terrainType)) multiplier *= 1.8;

    waterLiters *= multiplier;

    if (userInputs.experience === "beginner") waterLiters *= 1.15;

    const safetyMargin =
      weatherInputs.temperature_f > 90 ||
      trailChar.distanceMiles > 10 ||
      altFt > 10000
        ? 1.0
        : 0.5;
    waterLiters += safetyMargin;
    waterLiters = Math.ceil(waterLiters * 2) / 2;

    return {
      totalLiters: Math.max(waterLiters, 1),
      totalOunces: Math.round(Math.max(waterLiters, 1) * 33.8 * 10) / 10,
      estimatedHours: Math.round(timeHours * 10) / 10,
      ratePerHour:
        Math.round((Math.max(waterLiters, 1) / timeHours) * 100) / 100,
      bottlesNeeded: Math.ceil(Math.max(waterLiters, 1) / 0.7),
    };
  };

  const calculateCalories = () => {
    const trailChar = parseTrailCharacteristics(trail);
    const timeHours = estimateHikeTime(
      trailChar.distanceMiles,
      trailChar.elevationGainFt,
      trailChar.difficultyRating,
      userInputs.experience,
      userInputs.pack_weight_lbs
    );

    const ageFactor =
      userInputs.age > 45
        ? 1 - 0.004 * (userInputs.age - 45)
        : 1 + 0.004 * (45 - userInputs.age);
    const heightFactor = 1 + 0.01 * (userInputs.height_inches - 70);
    const weightFactor = userInputs.weight_lbs / 150;

    const distanceCalories = 270 * trailChar.distanceMiles * weightFactor;
    const elevationCalories = (trailChar.elevationGainFt / 1000) * 260;
    let caloriesBurned =
      (distanceCalories + elevationCalories) * ageFactor * heightFactor;

    const terrainMultiplier = getTerrainCoefficient(trailChar.terrainType);
    caloriesBurned *= terrainMultiplier / 1.2;

    const packPenalty = (userInputs.pack_weight_lbs / 10) * 60 * timeHours;
    caloriesBurned += packPenalty;

    const bmrCalories = timeHours * 110;
    caloriesBurned += bmrCalories;

    let foodCalories, foodWeightOz, recommendation;
    if (timeHours < 3) {
      foodCalories = caloriesBurned + 200;
      foodWeightOz = foodCalories / 125;
      recommendation = "trail_snacks";
    } else if (timeHours < 8) {
      foodCalories = caloriesBurned * 0.6 + 400;
      foodWeightOz = foodCalories / 125;
      recommendation = "lunch_and_snacks";
    } else {
      const days = Math.ceil(timeHours / 10);
      let dailyCalories = 3200;
      let foodLbsPerDay = 2.0;

      if (trailChar.difficultyRating <= 4) {
        dailyCalories = 3200;
        foodLbsPerDay = 2.0;
      } else if (trailChar.difficultyRating <= 5) {
        dailyCalories = 3600;
        foodLbsPerDay = 2.2;
      } else {
        dailyCalories = 4200;
        foodLbsPerDay = 2.5;
      }

      foodCalories = dailyCalories * (days + 1);
      foodWeightOz = foodLbsPerDay * (days + 1) * 16;
      recommendation = "multi_day_backpacking";
    }

    return {
      caloriesBurned: Math.round(caloriesBurned),
      foodCaloriesNeeded: Math.round(foodCalories),
      foodWeightOz: Math.round(foodWeightOz * 10) / 10,
      foodWeightLbs: Math.round((foodWeightOz / 16) * 100) / 100,
      caloriesPerHour: 250,
      snackFrequencyMin: 60,
      recommendationType: recommendation,
      estimatedTimeHours: Math.round(timeHours * 10) / 10,
    };
  };

  const generateGearRecommendations = () => {
    const trailChar = parseTrailCharacteristics(trail);
    const timeHours = estimateHikeTime(
      trailChar.distanceMiles,
      trailChar.elevationGainFt,
      trailChar.difficultyRating,
      userInputs.experience,
      userInputs.pack_weight_lbs
    );

    const gear = {
      tenEssentials: [
        "Map (paper topographic)",
        "Compass",
        "GPS device or smartphone with offline maps",
        "LED headlamp with extra batteries",
        "Sunglasses (100% UV protection)",
        "Sunscreen (SPF 30+)",
        "First aid kit",
        "Multi-tool or knife",
        "Waterproof matches and lighter",
        "Emergency shelter",
        "Extra food (one day minimum)",
        "Water bottles (2+ quarts capacity)",
        "Water treatment (filter or tablets)",
        "Rain jacket",
      ],
      clothing: [],
      footwear: [],
      safety: [],
      terrainSpecific: [],
      environmental: [],
    };

    let packSize;
    if (timeHours < 2) packSize = "10-20L waist pack";
    else if (timeHours < 8) packSize = "20-30L daypack";
    else if (timeHours < 16) packSize = "40-50L backpack";
    else packSize = "50-70L backpack";

    if (trailChar.difficultyRating >= 5) {
      gear.terrainSpecific.push(
        "Trekking poles (essential)",
        "Technical hiking boots",
        "Emergency bivvy"
      );
      gear.safety.push(
        "GPS with preloaded route",
        "Personal Locator Beacon (recommended)"
      );
    } else if (trailChar.difficultyRating >= 3) {
      gear.terrainSpecific.push(
        "Trekking poles (recommended)",
        "Hiking boots with ankle support"
      );
    }

    if (trailChar.difficultyRating <= 2) {
      gear.footwear.push("Trail runners or light hiking shoes");
    } else if (trailChar.difficultyRating <= 4) {
      gear.footwear.push("Mid-cut hiking boots with ankle support");
    } else {
      gear.footwear.push("High-cut hiking boots (stiff sole)");
    }

    if (weatherInputs.temperature_f > 80) {
      gear.environmental.push(
        "Long-sleeve lightweight shirt (UPF 35-50+)",
        "Wide-brimmed hat",
        "SPF 50+ sunscreen",
        "Extra water capacity"
      );
    }

    if (weatherInputs.forecast === "rain") {
      gear.environmental.push(
        "Waterproof rain jacket",
        "Rain pants",
        "Pack cover or waterproof liner"
      );
    }

    if (weatherInputs.season === "winter" || trailChar.hasSnowIce) {
      gear.environmental.push(
        "Microspikes or traction devices",
        "Gaiters (waterproof)",
        "Insulated gloves and warm hat",
        "Extra warm layers"
      );
    }

    const altFt = parseFloat(trail.altitude_ft) || 0;
    if (altFt > 8000) {
      gear.environmental.push(
        "Extra sun protection (SPF 50+)",
        "Altitude sickness medication (consult doctor)",
        "Warmer layers"
      );
    }

    if (trailChar.bearCountry) {
      gear.safety.push(
        "Bear spray (EPA-approved, chest holster)",
        "Bear canister or Ursack",
        "Whistle for noise making"
      );
    }

    if (trailChar.remoteness === "high") {
      gear.safety.push(
        "Satellite messenger (mandatory)",
        "Comprehensive first aid kit",
        "Two extra days food minimum"
      );
    }

    return {
      packSize,
      gearByCategory: gear,
      totalItems: Object.values(gear).reduce(
        (sum, items) => sum + items.length,
        0
      ),
    };
  };

  const generateSafetyNotes = () => {
    const trailChar = parseTrailCharacteristics(trail);
    const notes = [];

    const altFt = parseFloat(trail.altitude_ft) || 0;

    if (altFt > 10000) {
      notes.push("⚠️ HIGH ALTITUDE: Acclimatize for 1-2 days before ascending");
    } else if (altFt > 8000) {
      notes.push("⚠️ Altitude effects possible. Increase water intake by 25%");
    }

    if (weatherInputs.temperature_f > 95) {
      notes.push("⚠️ EXTREME HEAT: Start before dawn. Triple water estimates");
    } else if (weatherInputs.temperature_f > 85) {
      notes.push("⚠️ Hot conditions: Double water supply");
    }

    if (trailChar.difficultyRating >= 6) {
      notes.push(
        "⚠️ VERY STRENUOUS: Only attempt if in excellent physical condition"
      );
    }

    if (trailChar.remoteness === "high") {
      notes.push("⚠️ REMOTE AREA: Carry satellite communication device");
    }

    if (trailChar.bearCountry) {
      notes.push(
        "🐻 BEAR COUNTRY: Carry bear spray. Make noise. Hike in groups"
      );
    }

    notes.push("✓ Always carry the Ten Essentials");
    notes.push("✓ Check weather forecast before departure");
    notes.push("✓ Tell someone your plans and expected return time");

    return notes;
  };

  const calculateRecommendations = () => {
    const water = calculateWaterAmount();
    const calories = calculateCalories();
    const gear = generateGearRecommendations();
    const safety = generateSafetyNotes();

    setRecommendations({
      water,
      calories,
      gear,
      safety,
    });
    setShowRecommendations(true);
    setShowRecommendations(true);
  };

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Moderate: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-4 left-60 z-50 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 font-semibold text-gray-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trails
        </button>
      )}

      {/* Hero Section */}
      <div className="relative h-64 ml-60">
        <img
          src={trail.image}
          alt={trail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  difficultyColors[trail.difficulty]
                }`}
              >
                {trail.difficulty}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{trail.rating}</span>
                <span className="text-gray-300 text-sm">
                  ({trail.reviews} reviews)
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-3">{trail.name}</h1>
            <div className="flex items-center text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{trail.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-8 ml-60">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <Mountain className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Distance</div>
              <div className="text-2xl font-bold text-gray-900">
                {parseFloat(trail.length).toFixed(1)} mi
              </div>
            </div>
            <div>
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Elevation Gain</div>
              <div className="text-2xl font-bold text-gray-900">
                {(parseFloat(trail.elevation_gain) || 0).toLocaleString()} ft
              </div>
            </div>
            <div>
              <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Duration</div>
              <div className="text-2xl font-bold text-gray-900">
                {trail.duration}
              </div>
            </div>
            <div>
              <Mountain className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Altitude</div>
              <div className="text-2xl font-bold text-gray-900">
                {(parseFloat(trail.altitude_ft) || 0).toLocaleString()} ft
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About This Trail
          </h2>
          <p className="text-gray-700 leading-relaxed">{trail.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {trail.features.map((feature, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                {feature
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            ))}
          </div>
        </div>

        {/* Weather Section */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-blue-100 mb-1">
                Weather forecast for{" "}
                {new Date(userInputs.hike_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-blue-200 mb-3">
                {trail.area_name || trail.location}
              </p>
              <div className="flex items-center gap-4 mb-4">
                {weatherInputs.forecast === "clear" && (
                  <Sun className="w-16 h-16" />
                )}
                {weatherInputs.forecast === "cloudy" && (
                  <Cloud className="w-16 h-16" />
                )}
                {weatherInputs.forecast === "rain" && (
                  <CloudRain className="w-16 h-16" />
                )}
                {weatherInputs.forecast === "snow" && (
                  <Cloud className="w-16 h-16" />
                )}
                <div>
                  <p className="text-5xl">{weatherInputs.temperature_f}°</p>
                  <p className="text-blue-100 capitalize">
                    {weatherInputs.forecast === "clear"
                      ? "Mostly sunny"
                      : weatherInputs.forecast}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4" />
                  <span>
                    {weatherInputs.forecast === "rain" ? "70%" : "10%"} rain
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  <span>{weatherInputs.wind_mph} mph wind</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4" />
                  <span>{weatherInputs.humidity_percent}% humidity</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100 mb-1">Season</p>
              <p className="text-2xl capitalize">{weatherInputs.season}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <p className="text-sm text-blue-50">
              {weatherInputs.temperature_f > 85
                ? "⚠️ Hot conditions - bring extra water and sun protection!"
                : weatherInputs.temperature_f < 45
                ? "⚠️ Cold conditions - bring warm layers and insulation!"
                : "✓ Good hiking conditions! Stay hydrated and prepared."}
            </p>
          </div>
        </div>

        {/* Input Forms */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Get Personalized Recommendations
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* User Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Your Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Hike Date
                  </label>
                  <input
                    type="date"
                    value={userInputs.hike_date}
                    onChange={(e) =>
                      setUserInputs({
                        ...userInputs,
                        hike_date: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={userInputs.weight_lbs}
                    onChange={(e) =>
                      setUserInputs({
                        ...userInputs,
                        weight_lbs: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={userInputs.age}
                    onChange={(e) =>
                      setUserInputs({
                        ...userInputs,
                        age: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (inches)
                  </label>
                  <input
                    type="number"
                    value={userInputs.height_inches}
                    onChange={(e) =>
                      setUserInputs({
                        ...userInputs,
                        height_inches: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pack Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={userInputs.pack_weight_lbs}
                    onChange={(e) =>
                      setUserInputs({
                        ...userInputs,
                        pack_weight_lbs: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={userInputs.experience}
                    onChange={(e) =>
                      setUserInputs({
                        ...userInputs,
                        experience: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="experienced">Experienced</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Weather Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Weather Conditions
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Thermometer className="w-4 h-4 inline mr-1" />
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    value={weatherInputs.temperature_f}
                    onChange={(e) =>
                      setWeatherInputs({
                        ...weatherInputs,
                        temperature_f: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Droplet className="w-4 h-4 inline mr-1" />
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    value={weatherInputs.humidity_percent}
                    onChange={(e) =>
                      setWeatherInputs({
                        ...weatherInputs,
                        humidity_percent: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Wind className="w-4 h-4 inline mr-1" />
                    Wind Speed (mph)
                  </label>
                  <input
                    type="number"
                    value={weatherInputs.wind_mph}
                    onChange={(e) =>
                      setWeatherInputs({
                        ...weatherInputs,
                        wind_mph: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Cloud className="w-4 h-4 inline mr-1" />
                    Forecast
                  </label>
                  <select
                    value={weatherInputs.forecast}
                    onChange={(e) =>
                      setWeatherInputs({
                        ...weatherInputs,
                        forecast: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="clear">Clear</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="rain">Rain</option>
                    <option value="snow">Snow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Season
                  </label>
                  <select
                    value={weatherInputs.season}
                    onChange={(e) =>
                      setWeatherInputs({
                        ...weatherInputs,
                        season: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={calculateRecommendations}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors"
          >
            Calculate Recommendations
          </button>
        </div>

        {/* Recommendations Display */}
        {showRecommendations && recommendations && (
          <>
            {/* Safety Notes */}
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-3">
                    Safety Notes
                  </h3>
                  <ul className="space-y-2">
                    {recommendations.safety.map((note, idx) => (
                      <li key={idx} className="text-red-800">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Water */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Droplet className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Water</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Total Needed</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {recommendations.water.totalLiters}L
                    </div>
                    <div className="text-sm text-gray-500">
                      ({recommendations.water.totalOunces} oz)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Bottles Needed</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {recommendations.water.bottlesNeeded} × 24oz bottles
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">
                      Consumption Rate
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {recommendations.water.ratePerHour}L/hour
                    </div>
                  </div>
                </div>
              </div>

              {/* Calories */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Flame className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Nutrition</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Calories Burned</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {recommendations.calories.caloriesBurned}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Food to Carry</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {recommendations.calories.foodWeightLbs} lbs
                    </div>
                    <div className="text-sm text-gray-500">
                      ({recommendations.calories.foodCaloriesNeeded} calories)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Snack Frequency</div>
                    <div className="text-lg font-semibold text-gray-900">
                      Every {recommendations.calories.snackFrequencyMin} min
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      💡 Eat {recommendations.calories.caloriesPerHour}{" "}
                      cal/hour. Include protein, carbs, and electrolytes
                    </p>
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Time</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">
                      Estimated Duration
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {recommendations.water.estimatedHours} hours
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Recommendation</div>
                    <div className="text-lg font-semibold text-gray-900">
                      Start early (6-8am)
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      💡 Add 30% buffer time. Turn back if behind schedule by
                      midday
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gear Recommendations */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <Backpack className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Gear Recommendations
                  </h3>
                  <p className="text-sm text-gray-600">
                    Recommended pack: {recommendations.gear.packSize}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Ten Essentials */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                    Ten Essentials
                  </h4>
                  <ul className="space-y-2">
                    {recommendations.gear.gearByCategory.tenEssentials
                      .slice(0, 8)
                      .map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="text-green-600 mr-2">✓</span>
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Other Categories */}
                <div className="space-y-4">
                  {recommendations.gear.gearByCategory.footwear.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Footwear
                      </h4>
                      <ul className="space-y-1">
                        {recommendations.gear.gearByCategory.footwear.map(
                          (item, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-700 flex items-start"
                            >
                              <span className="text-green-600 mr-2">✓</span>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {recommendations.gear.gearByCategory.terrainSpecific.length >
                    0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Terrain Specific
                      </h4>
                      <ul className="space-y-1">
                        {recommendations.gear.gearByCategory.terrainSpecific.map(
                          (item, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-700 flex items-start"
                            >
                              <span className="text-green-600 mr-2">✓</span>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {recommendations.gear.gearByCategory.environmental.length >
                    0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Environmental
                      </h4>
                      <ul className="space-y-1">
                        {recommendations.gear.gearByCategory.environmental.map(
                          (item, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-700 flex items-start"
                            >
                              <span className="text-green-600 mr-2">✓</span>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {recommendations.gear.gearByCategory.safety.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Safety & Navigation
                      </h4>
                      <ul className="space-y-1">
                        {recommendations.gear.gearByCategory.safety.map(
                          (item, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-700 flex items-start"
                            >
                              <span className="text-red-600 mr-2">⚠</span>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}