import React, { useState, useEffect } from "react";
import {
  UsersIcon,
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  FireIcon,
  EyeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { adminAPI } from "../services/api";
import Header from "../components/common/Header";
import StatCard from "../components/admin/StatCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVoters: 0,
    votersWhoVoted: 0,
    participation: "0%",
    totalCandidates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voteStats, setVoteStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);

    try {
      const [votersRes, statsRes] = await Promise.all([
        adminAPI.getVoters(),
        adminAPI.getVoteStats(),
      ]);

      // Calculate participation rate
      const participationRate =
        votersRes.data.totalVoters > 0
          ? (
              (votersRes.data.votersWhoVoted / votersRes.data.totalVoters) *
              100
            ).toFixed(1) + "%"
          : "0%";

      // Count total candidates and stash vote stats
      let totalCandidates = 0;
      Object.values(statsRes.data).forEach((position) => {
        totalCandidates += position.candidates.length;
      });
      setVoteStats(statsRes.data);

      setStats({
        totalVoters: votersRes.data.totalVoters,
        votersWhoVoted: votersRes.data.votersWhoVoted,
        participation: participationRate,
        totalCandidates: totalCandidates,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    } finally {
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  const participationNum = parseFloat(stats.participation);
  const isHighParticipation = participationNum >= 70;
  const isMediumParticipation = participationNum >= 40;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <Header />

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-10 animate-float"></div>
        <div
          className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-tr from-secondary-200 to-secondary-300 rounded-full opacity-10 animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/50 rounded-3xl shadow-card border border-white/60 backdrop-blur-sm p-8 mb-8 overflow-hidden animate-slideUp">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <SparklesIcon className="absolute top-4 right-4 h-6 w-6 text-yellow-500 animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl shadow-glow">
                <ChartBarIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-poppins font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-secondary-700 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-lg font-montserrat text-gray-600 mt-1">
                  Welcome back, {user?.firstName}! Monitor election progress in
                  real-time.
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <EyeIcon
                className={`h-5 w-5 text-gray-600 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              <span className="font-montserrat text-sm text-gray-700">
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>

          {/* Live Status Indicator */}
          <div className="mt-6 flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-montserrat font-medium text-green-700">
                Live Data
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-montserrat text-gray-600">
              <ClockIcon className="h-4 w-4" />
              <span>Auto-refresh every 30s</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="animate-slideUp" style={{ animationDelay: "0.1s" }}>
            <StatCard
              title="Total Voters"
              value={stats.totalVoters}
              icon={UsersIcon}
              color="primary"
              trend="+12% from last election"
            />
          </div>
          <div className="animate-slideUp" style={{ animationDelay: "0.2s" }}>
            <StatCard
              title="Votes Cast"
              value={stats.votersWhoVoted}
              icon={TrophyIcon}
              color="success"
              trend={`${stats.participation} participation`}
            />
          </div>
          <div className="animate-slideUp" style={{ animationDelay: "0.3s" }}>
            <StatCard
              title="Participation Rate"
              value={stats.participation}
              icon={ChartBarIcon}
              color={
                isHighParticipation
                  ? "success"
                  : isMediumParticipation
                  ? "warning"
                  : "error"
              }
              trend={
                isHighParticipation
                  ? "Excellent turnout!"
                  : isMediumParticipation
                  ? "Good progress"
                  : "Needs improvement"
              }
            />
          </div>
          <div className="animate-slideUp" style={{ animationDelay: "0.4s" }}>
            <StatCard
              title="Total Candidates"
              value={stats.totalCandidates}
              icon={UserGroupIcon}
              color="info"
              trend="Across all positions"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 mb-8 animate-slideDown">
            <div className="flex items-center space-x-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-poppins font-semibold text-red-800">
                  Dashboard Error
                </p>
                <p className="text-sm font-montserrat text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vote Statistics */}
          <div
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-card border border-white/60 p-8 animate-slideUp"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-glow">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-poppins font-bold text-gray-900">
                  Live Vote Progress
                </h3>
                <p className="text-sm font-montserrat text-gray-600">
                  Real-time voting statistics
                </p>
              </div>
            </div>

            {Object.keys(voteStats).length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ChartBarIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="font-poppins font-medium text-gray-700 mb-2">
                  No Vote Data Yet
                </p>
                <p className="text-sm font-montserrat text-gray-500">
                  Votes will appear here as they are cast
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(voteStats).map(([position, data], index) => {
                  const maxVotes = Math.max(1, data.totalVotes || 0);
                  return (
                    <div
                      key={position}
                      className="animate-fadeIn"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-poppins font-semibold text-gray-900">
                          {position}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <FireIcon className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-montserrat font-medium text-gray-600">
                            {data.totalVotes} votes
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {data.candidates.map((c) => {
                          const widthPercent = Math.round(
                            ((c.votes || 0) / maxVotes) * 100
                          );
                          const isLeading =
                            c.votes ===
                            Math.max(
                              ...data.candidates.map(
                                (candidate) => candidate.votes || 0
                              )
                            );
                          return (
                            <div key={c.candidateId} className="group">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`font-montserrat font-medium ${
                                      isLeading
                                        ? "text-primary-700"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {c.name}
                                  </span>
                                  {isLeading && c.votes > 0 && (
                                    <TrophyIcon className="h-4 w-4 text-yellow-500 animate-bounce" />
                                  )}
                                </div>
                                <span
                                  className={`font-poppins font-semibold ${
                                    isLeading
                                      ? "text-primary-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {c.votes}
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                                    isLeading
                                      ? "bg-gradient-to-r from-primary-500 to-secondary-500"
                                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                                  }`}
                                  style={{ width: `${widthPercent}%` }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Candidates Leaderboard */}
          <div
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-card border border-white/60 p-8 animate-slideUp"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-glow">
                <TrophyIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-poppins font-bold text-gray-900">
                  Leaderboard
                </h3>
                <p className="text-sm font-montserrat text-gray-600">
                  Current leading candidates
                </p>
              </div>
            </div>

            {Object.keys(voteStats).length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrophyIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="font-poppins font-medium text-gray-700 mb-2">
                  No Leaders Yet
                </p>
                <p className="text-sm font-montserrat text-gray-500">
                  Leaderboard will update as votes come in
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(voteStats).map(([position, data], index) => {
                  const sorted = [...data.candidates].sort(
                    (a, b) => (b.votes || 0) - (a.votes || 0)
                  );
                  const leader = sorted[0];
                  const hasVotes = leader && leader.votes > 0;

                  return (
                    <div
                      key={position}
                      className="group p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200 animate-fadeIn"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              hasVotes
                                ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                                : "bg-gray-200"
                            }`}
                          >
                            {hasVotes ? (
                              <TrophyIcon className="h-5 w-5 text-white" />
                            ) : (
                              <span className="text-xs font-bold text-gray-500">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wide">
                              {position}
                            </p>
                            <p className="font-poppins font-semibold text-gray-900">
                              {hasVotes ? leader.name : "No votes yet"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-poppins font-bold ${
                              hasVotes ? "text-primary-600" : "text-gray-400"
                            }`}
                          >
                            {hasVotes ? leader.votes : "0"}
                          </p>
                          <p className="text-xs font-montserrat text-gray-500">
                            votes
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 hover:shadow-card-hover transition-all duration-300 text-left animate-slideUp"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                  Manage Voters
                </h4>
                <p className="text-sm font-montserrat text-gray-600">
                  View and manage registered voters
                </p>
              </div>
            </div>
          </button>

          <button
            className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 hover:shadow-card-hover transition-all duration-300 text-left animate-slideUp"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <TrophyIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                  View Results
                </h4>
                <p className="text-sm font-montserrat text-gray-600">
                  Detailed election results and analytics
                </p>
              </div>
            </div>
          </button>

          <button
            className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 hover:shadow-card-hover transition-all duration-300 text-left animate-slideUp"
            style={{ animationDelay: "0.9s" }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                  Export Data
                </h4>
                <p className="text-sm font-montserrat text-gray-600">
                  Download reports and statistics
                </p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
