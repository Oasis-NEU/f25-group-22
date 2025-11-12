import React, { useState } from "react";
import { MapPin, TrendingUp, Clock, Mountain, Star } from "lucide-react";

export default function RecommendedTrails() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLength, setSelectedLength] = useState("all");

  // Placeholder trail data
  const trails = [
    {
      id: 1,
      name: "Eagle Peak Trail",
      location: "White Mountains, NH",
      difficulty: "Moderate",
      length: 6.2,
      elevation: 1450,
      duration: "3-4 hours",
      rating: 4.7,
      reviews: 342,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      description:
        "A scenic mountain trail with panoramic views at the summit. Perfect for intermediate hikers.",
      features: ["Waterfall", "Wildlife", "Photo spots"],
    },
    {
      id: 2,
      name: "Riverside Loop",
      location: "Green Valley Park, MA",
      difficulty: "Easy",
      length: 2.8,
      elevation: 250,
      duration: "1-2 hours",
      rating: 4.5,
      reviews: 567,
      image:
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800",
      description:
        "A gentle path following the scenic river with multiple rest areas and picnic spots.",
      features: ["Family friendly", "Dogs allowed", "Paved"],
    },
    {
      id: 3,
      name: "Summit Ridge Challenge",
      location: "Mount Washington, NH",
      difficulty: "Hard",
      length: 11.5,
      elevation: 3200,
      duration: "6-8 hours",
      rating: 4.9,
      reviews: 189,
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
      description:
        "An intense alpine experience with rocky terrain and breathtaking summit views.",
      features: ["Peak bagging", "Alpine zone", "Challenging"],
    },
    {
      id: 4,
      name: "Forest Haven Trail",
      location: "Acadia National Park, ME",
      difficulty: "Easy",
      length: 3.5,
      elevation: 420,
      duration: "1.5-2 hours",
      rating: 4.6,
      reviews: 423,
      image:
        "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800",
      description:
        "A peaceful woodland walk through dense forest with occasional ocean glimpses.",
      features: ["Shade", "Nature sounds", "Beginner friendly"],
    },
    {
      id: 5,
      name: "Cascade Falls Adventure",
      location: "Berkshires, MA",
      difficulty: "Moderate",
      length: 5.3,
      elevation: 890,
      duration: "2.5-3 hours",
      rating: 4.8,
      reviews: 298,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      description:
        "Follow cascading streams through lush terrain to a spectacular 60-foot waterfall.",
      features: ["Waterfall", "Swimming hole", "Photography"],
    },
    {
      id: 6,
      name: "Coastal Bluffs Path",
      location: "Cape Cod, MA",
      difficulty: "Easy",
      length: 4.1,
      elevation: 180,
      duration: "2 hours",
      rating: 4.4,
      reviews: 512,
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
      description:
        "Stunning ocean vistas along dramatic coastal cliffs with beach access points.",
      features: ["Ocean views", "Beach access", "Sunset spot"],
    },
  ];

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
    return difficultyMatch && lengthMatch;
  });

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
          {filteredTrails.map((trail) => (
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

                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
                  View Trail Details
                </button>
              </div>
            </div>
          ))}
        </div>

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
