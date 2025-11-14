import React from 'react';
import {
  Mountain,
  Map,
  Calendar,
  Compass,
  CheckCircle,
  TrendingUp,
  Users,
  Cloud,
  Backpack,
  Shield,
  Zap,
  Heart,
} from "lucide-react";

export default function InformationPage() {
  const features = [
    {
      icon: Map,
      title: "Discover Trails",
      description: "Browse thousands of hiking trails with detailed information, difficulty ratings, and user reviews.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Calendar,
      title: "Plan Your Hikes",
      description: "Schedule your hiking adventures with our intelligent planning tools that consider weather, difficulty, and your fitness level.",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: CheckCircle,
      title: "Track Progress",
      description: "Record completed hikes, track your achievements, and build your hiking portfolio over time.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Cloud,
      title: "Weather Forecasts",
      description: "Get accurate weather predictions for your planned hikes to ensure safe and enjoyable trips.",
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      icon: Backpack,
      title: "Packing Lists",
      description: "Receive personalized packing recommendations based on trail difficulty, weather, and trip duration.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Users,
      title: "Group Planning",
      description: "Coordinate hikes with friends and family, share plans, and ensure everyone is prepared.",
      color: "bg-pink-100 text-pink-600"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Browse Trails",
      description: "Explore our extensive database of hiking trails filtered by location, difficulty, and length."
    },
    {
      step: "2",
      title: "Plan Your Trip",
      description: "Select a trail, choose your date, and let RouteReady generate personalized recommendations."
    },
    {
      step: "3",
      title: "Prepare & Pack",
      description: "Follow your custom packing list and check weather conditions before you go."
    },
    {
      step: "4",
      title: "Hit the Trail",
      description: "Enjoy your hike with confidence knowing you're fully prepared."
    },
    {
      step: "5",
      title: "Record & Share",
      description: "Mark your hike as complete and build your personal hiking achievement log."
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Our recommendations prioritize your safety with weather alerts and difficulty assessments."
    },
    {
      icon: Zap,
      title: "Smart Planning",
      description: "AI-powered suggestions help you plan the perfect hike based on your preferences and fitness level."
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "Benefit from reviews and insights shared by thousands of fellow hikers."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-24">
      <div className="max-w-5xl ml-8">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Mountain className="w-12 h-12 text-emerald-600" />
            <h1 className="text-5xl font-bold text-gray-900">RouteReady</h1>
          </div>
          <p className="text-2xl text-gray-600 mb-6">
            Your complete hiking companion for discovering, planning, and tracking amazing outdoor adventures
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Discover trails</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Plan trips</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Track progress</span>
            </div>
          </div>
        </div>

        {/* What is RouteReady */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is RouteReady?</h2>
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              RouteReady is a comprehensive hiking platform designed to make outdoor adventures accessible, 
              safe, and enjoyable for everyone. Whether you're a seasoned mountaineer or just starting your 
              hiking journey, RouteReady provides the tools and information you need to explore nature with confidence.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our intelligent planning system considers your fitness level, experience, group size, and current 
              weather conditions to provide personalized recommendations that ensure every hike is a success.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
            <div className="space-y-6">
              {howItWorks.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose RouteReady */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose RouteReady?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200"
              >
                <benefit.icon className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-700">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}