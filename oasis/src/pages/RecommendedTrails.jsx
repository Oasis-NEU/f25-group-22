import React, { useState, useEffect } from "react";
import { MapPin, TrendingUp, Clock, Mountain, Star } from "lucide-react";
import Papa from "papaparse";
import TrailDetails from './TrailDetails';

export default function RecommendedTrails() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLength, setSelectedLength] = useState("all");
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [displayLimit, setDisplayLimit] = useState(20);
  

  useEffect(() => {
     fetch('/alltrails-data.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const transformedTrails = results.data.map((row, index) => ({
              id: index + 1,
              name: row.name || 'Unknown Trail',
              location: `${row.area_name || ''}, ${row.state_name || ''}`.trim(),
              difficulty: getDifficultyFromRating(row.difficulty_rating),
              difficulty_rating: row.difficulty_rating || 3,
              length: row.length ? (row.length / 1609.34).toFixed(1) : 0, // Convert meters to miles
              elevation: row.elevation_gain ? Math.round(row.elevation_gain * 3.28084) : 0, // Convert meters to feet
              duration: estimateDuration(row.length, row.elevation_gain),
              rating: row.avg_rating || 0,
              reviews: row.num_reviews || 0,
              image: getTrailImagePath(row.name) || row.profile_photo_url || `https://source.unsplash.com/800x600/?${encodeURIComponent(row.area_name || 'mountain,hiking')},trail,nature`,
              features: parseFeatures(row.features),
              area_name: row.area_name || '',
              state_name: row.state_name || '',
              visitor_usage: row.visitor_usage || 2,
              altitude_ft: row.elevation_gain ? Math.round(row.elevation_gain * 3.28084) : 0
            }));
            setTrails(transformedTrails);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error loading CSV:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 300);
  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  setDisplayLimit(20);
}, [selectedDifficulty, selectedLength, debouncedSearchTerm]);

  // Helper function to convert difficulty rating (1-7) to Easy/Moderate/Hard
  const getDifficultyFromRating = (rating) => {
    if (rating <= 2) return "Easy";
    if (rating <= 5) return "Moderate";
    return "Hard";
  };

  // Helper function to estimate duration based on length and elevation
  const estimateDuration = (lengthMeters, elevationMeters) => {
    if (!lengthMeters) return "Unknown";
    const miles = lengthMeters / 1609.34;
    const elevFeet = elevationMeters ? elevationMeters * 3.28084 : 0;
    const hours = Math.round((miles / 2) + (elevFeet / 1000));
    if (hours < 2) return "1-2 hours";
    if (hours < 4) return `${hours}-${hours + 1} hours`;
    return `${hours}+ hours`;
  };

  // Helper function to parse features from the CSV format
  const parseFeatures = (featuresStr) => {
    if (!featuresStr) return [];
    try {
      // Remove brackets and quotes, split by comma
      const cleaned = featuresStr.replace(/[\[\]']/g, '');
      return cleaned.split(',').slice(0, 3).map(f => 
        f.trim().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      );
    } catch {
      return [];
    }
  };

  const getTrailImagePath = (trailName) => {
    if (!trailName) return null;
    return `/images/trails/${trailName}.jpg`;
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
  const searchMatch = 
    debouncedSearchTerm === "" || 
    (trail.name || "").toLowerCase().includes(debouncedSearchTerm.toLowerCase());
  
  return difficultyMatch && lengthMatch && searchMatch;
  });
  const displayedTrails = filteredTrails.slice(0, displayLimit);

    if (selectedTrail) {
    return <TrailDetails trail={selectedTrail} onBack={() => setSelectedTrail(null)} />;
    }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pl-16 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading trails...</div>
      </div>
    );
  }

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
             Search by Name
            </label>
            <input
              type="text"
              placeholder="Search trails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
</div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredTrails.length}
            </span>{" "}
            recommended trails
          </p>
        </div>

        {/* Trail Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {displayedTrails.map((trail) => (
            <div
              key={trail.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={trail.image}
                  alt={trail.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      difficultyColors[trail.difficulty]
                    }`}
                  >
                    {trail.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {trail.name}
                </h3>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{trail.location}</span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {trail.rating}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({trail.reviews} reviews)
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {trail.description}
                </p>

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

                <div className="flex flex-wrap gap-2 mb-4">
                  {trail.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => setSelectedTrail(trail)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                  >
                    View Trail Details
                </button>
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
      </div>
    </div>
  );
}
