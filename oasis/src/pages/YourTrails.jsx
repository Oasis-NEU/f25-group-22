import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Mountain,
  Calendar,
  Users,
  Activity,
  Clock,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Initialize Supabase with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PlannedTrails() {
  const [plannedHikes, setPlannedHikes] = useState([]);
  const [expandedHike, setExpandedHike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Component mounted, fetching hikes...');
    fetchPlannedHikes();
  }, []);

  async function fetchPlannedHikes() {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching from Supabase...');
      console.log('URL:', supabaseUrl);
      
      const { data, error } = await supabase
        .from('planned_hikes')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully fetched hikes:', data);
      setPlannedHikes(data || []);
    } catch (err) {
      console.error('Error in fetchPlannedHikes:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this hike?')) return;
    
    try {
      const { error } = await supabase
        .from('planned_hikes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPlannedHikes(plannedHikes.filter((hike) => hike.id !== id));
    } catch (err) {
      console.error('Error deleting hike:', err);
      alert('Failed to delete hike: ' + err.message);
    }
  }

  async function handleToggleComplete(id) {
    try {
      const hike = plannedHikes.find(h => h.id === id);
      const newStatus = hike.status === 'completed' ? 'planned' : 'completed';
      const updates = {
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('planned_hikes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setPlannedHikes(
        plannedHikes.map((h) =>
          h.id === id ? { ...h, ...updates } : h
        )
      );
    } catch (err) {
      console.error('Error updating hike:', err);
      alert('Failed to update hike: ' + err.message);
    }
  }

  function toggleExpand(id) {
    setExpandedHike(expandedHike === id ? null : id);
  }

  function formatDate(dateString) {
    if (!dateString) return 'Date not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  }

  const upcomingHikes = plannedHikes.filter((hike) => hike.status !== 'completed');
  const completedHikes = plannedHikes.filter((hike) => hike.status === 'completed');

  console.log('Render state:', { loading, error, hikesCount: plannedHikes.length });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your hikes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-24">
        <div className="max-w-4xl ml-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-red-900 font-semibold mb-2">Error loading hikes</h3>
                <p className="text-red-700 mb-3">{error}</p>
                <div className="bg-red-100 rounded p-3 mb-3 text-sm text-red-800">
                  <p className="font-semibold mb-1">Troubleshooting steps:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Check that your Supabase anon key is set correctly</li>
                    <li>Verify the table name is "planned_hikes"</li>
                    <li>Check browser console (F12) for detailed errors</li>
                    <li>Ensure RLS policies allow reads on the table</li>
                  </ul>
                </div>
                <button
                  onClick={fetchPlannedHikes}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-24">
      <div className="max-w-4xl ml-8">
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Your planned trails</h1>
          <p className="text-gray-600">
            Manage your upcoming and completed hikes
          </p>
        </div>

        {/* Debug info - remove in production */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
          <p className="text-blue-900">
            Total hikes: {plannedHikes.length} | Upcoming: {upcomingHikes.length} | Completed: {completedHikes.length}
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
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleExpand(hike.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl text-gray-900">
                            Trail ID: {hike.trail_id}
                          </h3>
                          {hike.experience_level && (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full capitalize">
                              {hike.experience_level}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(hike.hike_date || hike.created_at)}</span>
                        </div>
                        {hike.notes && (
                          <p className="text-sm text-gray-600 mt-2">{hike.notes}</p>
                        )}
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
                          {hike.group_size === 1 ? "Solo" : `${hike.group_size} people`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm">
                          {hike.user_age ? `Age ${hike.user_age}` : 'Age N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {hike.user_weight_lbs ? `${hike.user_weight_lbs} lbs` : 'Weight N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {expandedHike === hike.id && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      {/* User Info */}
                      <div className="mb-6">
                        <h4 className="text-lg text-gray-900 mb-3">Hiker details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Age</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {hike.user_age || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Height</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {hike.user_height_inches ? `${Math.floor(hike.user_height_inches / 12)}'${hike.user_height_inches % 12}"` : 'N/A'}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Weight</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {hike.user_weight_lbs ? `${hike.user_weight_lbs} lbs` : 'N/A'}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Group</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {hike.group_size || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Food Recommendations */}
                      {hike.recommendations?.food && (
                        <div className="mb-6">
                          <h4 className="text-lg text-gray-900 mb-3">
                            Food recommendations
                          </h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            {hike.recommendations.food.food_calories && (
                              <div className="mb-3">
                                <p className="text-sm text-gray-500 mb-1">Recommended Calories</p>
                                <p className="text-3xl font-bold text-emerald-600">
                                  {hike.recommendations.food.food_calories} cal
                                </p>
                              </div>
                            )}
                            {hike.recommendations.food.recommendation && (
                              <p className="text-sm text-gray-600 capitalize">
                                Type: {hike.recommendations.food.recommendation}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Full Recommendations */}
                      {hike.recommendations && (
                        <div>
                          <h4 className="text-lg text-gray-900 mb-3">
                            All recommendations
                          </h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200 max-h-64 overflow-auto">
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                              {JSON.stringify(hike.recommendations, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Hikes */}
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
                          Trail ID: {hike.trail_id}
                        </h3>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 ml-8">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {formatDate(hike.completed_at || hike.hike_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {hike.group_size === 1 ? "Solo" : `${hike.group_size} people`}
                          </span>
                        </div>
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