import React, { useState, useEffect } from "react";
import { MapPin, TrendingUp, Clock, Mountain, Star } from "lucide-react";
import supabase from "../config/supabase";

export default function RecommendedTrails() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLength, setSelectedLength] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedPopularity, setSelectedPopularity] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [states, setStates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const itemsPerPage = 100;

  const carouselImages = [
    "https://www.travelandleisure.com/thmb/O9be9O1akR-H0wsuGJW64p6fVbs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/19-mount-rainier-national-park-washington-BESTHIKE0407-1b2ae69a788f49a996e64ff38f05275a.jpg",
    "https://www.thprd.org/imagelibrary/images/parks/fctrail.jpg",
    "https://magazine.northeast.aaa.com/wp-content/uploads/2020/05/walking-trails-near-me-4.jpg?w=640",
    "https://www.travelandleisure.com/thmb/75m6J3ZRnAMaUacNC_XqN3Vxu8I=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/20-shenandoah-national-park-virginia-BESTHIKE0407-99fb4086ffe44441928bb28a33583dca.jpg",
    "https://www.travelandleisure.com/thmb/jQN6RAIXdc28jQQcH4ysE2RpSpY=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/TAL-bryce-canyon-BESTHIKE0524-e61d5a062d9040a9bf137c955522b10a.jpg",
    "https://www.travelandleisure.com/thmb/wPueYjtO7j5q3ED5vMdYQTxVbLw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/4-zion-national-park-utah-BESTHIKE0407-59e2046c784b4c4b9ff7da56a01361bc.jpg",

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchTrails();
  }, []);

  const getDifficultyLabel = (rating) => {
    if (rating <= 2) return "Easy";
    if (rating <= 3.5) return "Moderate";
    return "Hard";
  };

  const metersToMiles = (meters) => {
    return (meters * 0.000621371).toFixed(1);
  };

  const fetchTrails = async () => {
    try {
      setLoading(true);
      let allTrails = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const start = page * pageSize;
        const end = start + pageSize - 1;

        const { data, error } = await supabase
          .from("trails")
          .select("*")
          .range(start, end);

        if (error) throw error;

        if (!data || data.length === 0) {
          hasMore = false;
          break;
        }

        allTrails = [...allTrails, ...data];
        page++;
      }

      const transformedTrails = allTrails.map((trail) => {
        // Parse activities if it's a string
        let parsedActivities = [];
        if (typeof trail.activities === 'string') {
          try {
            // Remove single quotes and parse as JSON
            const jsonString = trail.activities.replace(/'/g, '"');
            parsedActivities = JSON.parse(jsonString);
          } catch (e) {
            parsedActivities = [];
          }
        } else if (Array.isArray(trail.activities)) {
          parsedActivities = trail.activities;
        }

        return {
          id: trail.trail_id,
          name: trail.name,
          location: `${trail.area_name}, ${trail.state_name}`,
          state: trail.state_name,
          popularity: trail.popularity || 0,
          activities: parsedActivities,
          difficulty: getDifficultyLabel(trail.difficulty_rating),
          length: parseFloat(metersToMiles(trail.length)),
          elevation: trail.elevation_gain || 0,
          duration: trail.route_type || "Unknown",
          rating: trail.avg_rating || 0,
          reviews: trail.num_reviews || 0,
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          description: `${trail.popularity ? "Popular " : ""}${trail.route_type || "trail"} in ${trail.area_name}`,
          features: parsedActivities.length > 0 
            ? parsedActivities 
            : (trail.features && Array.isArray(trail.features) ? trail.features : [trail.route_type || "Trail"]),
        };
      });

      console.log("First trail:", allTrails[0]);
      console.log("First transformed trail:", transformedTrails[0]);

      setTrails(transformedTrails);

      const uniqueStates = [...new Set(transformedTrails.map(t => t.state))].sort();
      setStates(uniqueStates);

      // Extract unique activities
      const allActivities = new Set();
      transformedTrails.forEach(trail => {
        if (trail.activities && Array.isArray(trail.activities)) {
          trail.activities.forEach(activity => allActivities.add(activity));
        }
      });
      const uniqueActivities = [...allActivities].sort();
      console.log("Activities found:", uniqueActivities);
      setActivities(uniqueActivities);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching trails:", err);
    } finally {
      setLoading(false);
    }
  };

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Moderate: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  };

  const filteredTrails = trails.filter((trail) => {
    const difficultyMatch =
      selectedDifficulty === "all" || trail.difficulty === selectedDifficulty;
    const lengthMatch =
      selectedLength === "all" ||
      (selectedLength === "short" && trail.length < 4) ||
      (selectedLength === "medium" && trail.length >= 4 && trail.length <= 7) ||
      (selectedLength === "long" && trail.length > 7);
    const stateMatch = selectedState === "all" || trail.state === selectedState;
    const popularityMatch =
      selectedPopularity === "all" ||
      (selectedPopularity === "high" && trail.popularity > 20) ||
      (selectedPopularity === "medium" && trail.popularity >= 10 && trail.popularity <= 20) ||
      (selectedPopularity === "low" && trail.popularity < 10);
    const activityMatch =
      selectedActivity === "all" ||
      (trail.activities && trail.activities.includes(selectedActivity));
    return difficultyMatch && lengthMatch && stateMatch && popularityMatch && activityMatch;
  });

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTrails = filteredTrails.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTrails.length / itemsPerPage);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pl-16 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading trails...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pl-16 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pl-16">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16 px-4 pl-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-4xl">Recommended Trails</h1>
          </div>
          <p className="text-green-100 text-lg max-w-2xl">
            Discover the best hiking trails curated based on popularity, scenic
            beauty, and trail conditions. Find your next adventure!
          </p>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="w-full h-110 bg-gray-300 overflow-hidden shadow-lg border-4 border-green-600">
        <img
          src={carouselImages[currentImageIndex]}
          alt="Trail carousel"
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter Trails</h2>
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trail Length
              </label>
              <select
                value={selectedLength}
                onChange={(e) => setSelectedLength(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Lengths</option>
                <option value="short">Short (Under 4 mi)</option>
                <option value="medium">Medium (4-7 mi)</option>
                <option value="long">Long (Over 7 mi)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popularity
              </label>
              <select
                value={selectedPopularity}
                onChange={(e) => setSelectedPopularity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Popularities</option>
                <option value="high">High (&gt; 20)</option>
                <option value="medium">Medium (10-20)</option>
                <option value="low">Low (&lt; 10)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity
              </label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Activities ({activities.length})</option>
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <option key={activity} value={activity}>
                      {activity.charAt(0).toUpperCase() + activity.slice(1).replace('-', ' ')}
                    </option>
                  ))
                ) : (
                  <option disabled>No activities found</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {startIndex + 1}-{Math.min(endIndex, filteredTrails.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {filteredTrails.length}
            </span>{" "}
            trails (Page {currentPage + 1} of {totalPages})
          </p>
        </div>

        {/* Trail Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {paginatedTrails.map((trail) => (
            <div
              key={trail.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-12 bg-gray-200 flex items-center px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    difficultyColors[trail.difficulty]
                  }`}
                >
                  {trail.difficulty}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {trail.name}
                </h3>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{trail.location}</span>
                </div>

                {trail.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {trail.rating}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({trail.reviews} reviews)
                    </span>
                  </div>
                )}

                {trail.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {trail.description}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Mountain className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-xs text-gray-500">Distance</div>
                    <div className="font-semibold text-gray-900">
                      {trail.length} mi
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-xs text-gray-500">Elevation</div>
                    <div className="font-semibold text-gray-900">
                      {trail.elevation} ft
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-xs text-gray-500">Duration</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {trail.duration}
                    </div>
                  </div>
                </div>

                {trail.features && (
                  <div className="flex flex-wrap gap-2">
                    {trail.features
                      .filter(feature => 
                        feature && 
                        feature.toLowerCase() !== "loop" && 
                        feature.toLowerCase() !== "out and back"
                      )
                      .map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {filteredTrails.length > displayLimit && (
          <div className="text-center mt-8">
           <button
             onClick={() => setDisplayLimit(prev => prev + 20)}
             className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
              Load More Trails ({filteredTrails.length - displayLimit} remaining)
            </button>
          </div>
)}

        {/* Empty State */}
        {filteredTrails.length === 0 && (
          <div className="text-center py-12">
            <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No trails found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredTrails.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <span className="text-gray-600 font-semibold">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}