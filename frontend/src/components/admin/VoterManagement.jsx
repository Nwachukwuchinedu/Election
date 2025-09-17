import React, { useState, useEffect, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChevronDownIcon,
  UsersIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { adminAPI } from "../../services/api";
import { mockAdminAPI } from "../../data/mockVoters";
import LoadingSpinner from "../common/LoadingSpinner";

const VoterManagement = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const levels = ["100", "200", "300", "400"];

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      setLoading(true);
      // Use mock data for now - replace with real API call when backend is ready
      const response = await mockAdminAPI.getAllVoters();
      setVoters(response.data || []);
    } catch (err) {
      setError("Failed to fetch voters");
      console.error("Error fetching voters:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredVoters = useMemo(() => {
    let filtered = voters.filter((voter) => {
      const matchesSearch =
        searchTerm === "" ||
        `${voter.firstName} ${voter.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        voter.matriculationNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        voter.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel =
        selectedLevel === "" || voter.level === selectedLevel;

      const matchesStatus =
        selectedStatus === "" ||
        selectedStatus === "all" ||
        (selectedStatus === "voted" && voter.hasVoted) ||
        (selectedStatus === "not-voted" && !voter.hasVoted);

      return matchesSearch && matchesLevel && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case "level":
          aValue = parseInt(a.level) || 0;
          bValue = parseInt(b.level) || 0;
          break;
        case "matriculation":
          aValue = a.matriculationNumber || "";
          bValue = b.matriculationNumber || "";
          break;
        case "status":
          aValue = a.hasVoted ? 1 : 0;
          bValue = b.hasVoted ? 1 : 0;
          break;
        default:
          aValue = a[sortBy] || "";
          bValue = b[sortBy] || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [voters, searchTerm, selectedLevel, selectedStatus, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = filteredVoters.length;
    const voted = filteredVoters.filter((v) => v.hasVoted).length;
    const notVoted = total - voted;
    const participationRate =
      total > 0 ? ((voted / total) * 100).toFixed(1) : 0;

    return { total, voted, notVoted, participationRate };
  }, [filteredVoters]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLevel("");
    setSelectedStatus("");
    setSortBy("name");
    setSortOrder("asc");
  };

  if (loading) return <LoadingSpinner message="Loading voters..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/50 rounded-3xl shadow-card border border-white/60 backdrop-blur-sm p-8 overflow-hidden animate-slideUp">
        <div className="relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <SparklesIcon className="absolute top-4 right-4 h-6 w-6 text-yellow-500 animate-pulse" />

          <div className="relative flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-glow">
              <UsersIcon className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-poppins font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
                Voter Management
              </h2>
              <p className="text-lg font-montserrat text-gray-600 mt-1">
                Search, filter, and manage registered voters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 p-6 animate-slideUp"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-poppins font-medium text-gray-600">
                Total Voters
              </p>
              <p className="text-2xl font-poppins font-bold text-gray-900">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 p-6 animate-slideUp"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-poppins font-medium text-gray-600">
                Voted
              </p>
              <p className="text-2xl font-poppins font-bold text-green-600">
                {stats.voted}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 p-6 animate-slideUp"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-poppins font-medium text-gray-600">
                Not Voted
              </p>
              <p className="text-2xl font-poppins font-bold text-orange-600">
                {stats.notVoted}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <XCircleIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 p-6 animate-slideUp"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-poppins font-medium text-gray-600">
                Participation
              </p>
              <p className="text-2xl font-poppins font-bold text-purple-600">
                {stats.participationRate}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <AcademicCapIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-card border border-white/60 p-6 animate-slideUp"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, matriculation number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl font-montserrat
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                       transition-all duration-200 bg-gray-50 focus:bg-white
                       hover:border-gray-400 text-lg"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-montserrat"
            >
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Filters</span>
              <ChevronDownIcon
                className={`h-4 w-4 text-gray-600 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {(searchTerm || selectedLevel || selectedStatus) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors font-montserrat text-sm"
              >
                Clear Filters
              </button>
            )}

            <div className="flex items-center space-x-2 text-sm font-montserrat text-gray-600">
              <span>
                Showing {filteredVoters.length} of {voters.length} voters
              </span>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl animate-slideDown">
              {/* Level Filter */}
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-montserrat"
                >
                  <option value="">All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      Level {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Voting Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-montserrat"
                >
                  <option value="">All Status</option>
                  <option value="voted">Voted</option>
                  <option value="not-voted">Not Voted</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-montserrat"
                >
                  <option value="name">Name</option>
                  <option value="level">Level</option>
                  <option value="matriculation">Matriculation No.</option>
                  <option value="status">Voting Status</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-montserrat"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 animate-slideDown">
          <div className="flex items-center space-x-4">
            <XCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-poppins font-semibold text-red-800">
                Error Loading Voters
              </p>
              <p className="text-sm font-montserrat text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Voters List */}
      <div
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-card border border-white/60 overflow-hidden animate-slideUp"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-poppins font-bold text-gray-900">
            Voters List
          </h3>
          <p className="text-sm font-montserrat text-gray-600 mt-1">
            {filteredVoters.length} voter
            {filteredVoters.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredVoters.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="font-poppins font-medium text-gray-700 mb-2">
              No voters found
            </p>
            <p className="text-sm font-montserrat text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredVoters.map((voter, index) => (
              <VoterCard key={voter.id || voter._id || index} voter={voter} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterManagement;

// Individual Voter Card Component
const VoterCard = ({ voter }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="group p-6 hover:bg-gray-50/50 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-primary-600" />
          </div>

          {/* Voter Info */}
          <div>
            <h4 className="font-poppins font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
              {voter.firstName} {voter.lastName}
            </h4>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm font-montserrat text-gray-600">
                {voter.matriculationNumber || "No Matric No."}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-montserrat font-medium">
                Level {voter.level || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center space-x-4">
          {/* Voting Status */}
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              voter.hasVoted
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {voter.hasVoted ? (
              <CheckCircleIcon className="h-4 w-4" />
            ) : (
              <XCircleIcon className="h-4 w-4" />
            )}
            <span className="text-sm font-montserrat font-medium">
              {voter.hasVoted ? "Voted" : "Not Voted"}
            </span>
          </div>

          {/* View Details Button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded-2xl animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-poppins font-medium text-gray-700">Email</p>
              <p className="font-montserrat text-gray-600">
                {voter.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-poppins font-medium text-gray-700">
                Department
              </p>
              <p className="font-montserrat text-gray-600">
                {voter.department || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-poppins font-medium text-gray-700">
                Registration Date
              </p>
              <p className="font-montserrat text-gray-600">
                {voter.createdAt
                  ? new Date(voter.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
