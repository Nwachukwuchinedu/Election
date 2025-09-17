import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { candidatesAPI, votesAPI } from "../services/api";
import Header from "../components/common/Header";
import CandidateCard from "../components/voter/CandidateCard";
import VotingModal from "../components/voter/VotingModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const VoterDashboard = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState({});
  const [votingStatus, setVotingStatus] = useState({
    votedPositions: [],
    availablePositions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [castingVote, setCastingVote] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesRes, votesRes] = await Promise.all([
          candidatesAPI.getAll(),
          votesAPI.getMyVotes(),
        ]);

        setCandidates(candidatesRes.data);
        setVotingStatus(votesRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVote = (candidate, position) => {
    setSelectedCandidate(candidate);
    setSelectedPosition(position);
    setShowModal(true);
  };

  const confirmVote = async () => {
    if (!selectedCandidate || !selectedPosition) return;

    setCastingVote(true);
    try {
      await votesAPI.castVote({
        position: selectedPosition,
        candidateId: selectedCandidate.id || selectedCandidate._id,
      });

      // Update voting status
      const updatedVotedPositions = [
        ...votingStatus.votedPositions,
        selectedPosition,
      ];
      const updatedAvailablePositions = votingStatus.availablePositions.filter(
        (pos) => pos !== selectedPosition
      );

      setVotingStatus({
        votedPositions: updatedVotedPositions,
        availablePositions: updatedAvailablePositions,
      });

      setShowModal(false);
    } catch (err) {
      setError("Failed to cast vote");
    } finally {
      setCastingVote(false);
    }
  };

  const hasVoted = (position) => {
    return votingStatus.votedPositions.includes(position);
  };

  const totalPositions = Object.keys(candidates).length;
  const votedPositions = votingStatus.votedPositions.length;
  const remainingVotes = votingStatus.availablePositions.length;
  const completionPercentage =
    totalPositions > 0 ? (votedPositions / totalPositions) * 100 : 0;

  if (loading)
    return <LoadingSpinner message="Loading your voting dashboard..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <Header />

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-10 animate-float"></div>
        <div
          className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-tr from-secondary-200 to-secondary-300 rounded-full opacity-10 animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Hero Section */}
        <div className="relative bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/50 rounded-3xl shadow-card border border-white/60 backdrop-blur-sm p-8 mb-8 overflow-hidden animate-slideUp">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full -translate-y-20 translate-x-20"></div>
          <SparklesIcon className="absolute top-4 right-4 h-6 w-6 text-yellow-500 animate-pulse" />

          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-glow">
                <TrophyIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-poppins font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-secondary-700 bg-clip-text text-transparent">
                  Welcome, {user?.firstName}!
                </h1>
                <p className="text-lg font-montserrat text-gray-600 mt-1">
                  Your voice matters. Make it count in this election.
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-poppins font-medium text-gray-700">
                  Voting Progress
                </span>
                <span className="text-sm font-montserrat text-gray-600">
                  {Math.round(completionPercentage)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${completionPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Positions */}
          <div
            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 p-6 hover:shadow-card-hover transition-all duration-300 animate-slideUp"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-poppins font-medium text-gray-600 mb-1">
                  Total Positions
                </h3>
                <p className="text-3xl font-poppins font-bold text-gray-900">
                  {totalPositions}
                </p>
                <p className="text-xs font-montserrat text-gray-500 mt-1">
                  Available to vote
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <TrophyIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Votes Cast */}
          <div
            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 p-6 hover:shadow-card-hover transition-all duration-300 animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-poppins font-medium text-gray-600 mb-1">
                  Votes Cast
                </h3>
                <p className="text-3xl font-poppins font-bold text-success-600">
                  {votedPositions}
                </p>
                <p className="text-xs font-montserrat text-success-700 mt-1">
                  Successfully submitted
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Remaining Votes */}
          <div
            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 p-6 hover:shadow-card-hover transition-all duration-300 animate-slideUp"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-poppins font-medium text-gray-600 mb-1">
                  Remaining
                </h3>
                <p className="text-3xl font-poppins font-bold text-warning-600">
                  {remainingVotes}
                </p>
                <p className="text-xs font-montserrat text-warning-700 mt-1">
                  {remainingVotes > 0 ? "Pending votes" : "All votes cast!"}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {remainingVotes > 0 ? (
                  <ClockIcon className="h-8 w-8 text-orange-600" />
                ) : (
                  <FireIcon className="h-8 w-8 text-orange-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 mb-8 animate-slideDown">
            <div className="flex items-center space-x-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-poppins font-semibold text-red-800">
                  Something went wrong
                </p>
                <p className="text-sm font-montserrat text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {completionPercentage === 100 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8 animate-slideDown">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-xl">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-poppins font-semibold text-green-800">
                  Congratulations! 🎉
                </p>
                <p className="text-sm font-montserrat text-green-700">
                  You have successfully cast all your votes. Thank you for
                  participating!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Positions & Candidates */}
        <div className="space-y-8">
          {Object.entries(candidates).map(
            ([positionName, positionCandidates], index) => (
              <section
                key={positionName}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-card border border-white/60 p-8 animate-slideUp"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-glow">
                      <TrophyIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-poppins font-bold text-gray-900">
                        {positionName}
                      </h2>
                      <p className="text-sm font-montserrat text-gray-600 mt-1">
                        Choose your preferred candidate
                      </p>
                    </div>
                  </div>
                  {hasVoted(positionName) && (
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-full animate-pulse">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-poppins font-medium text-green-800">
                        Vote Cast
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {positionCandidates.map((candidate, candidateIndex) => (
                    <div
                      key={candidate.id || candidate._id}
                      className="animate-scaleIn"
                      style={{ animationDelay: `${0.1 * candidateIndex}s` }}
                    >
                      <CandidateCard
                        candidate={candidate}
                        position={positionName}
                        disabled={hasVoted(positionName)}
                        onVote={handleVote}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )
          )}
        </div>

        {/* Call to Action */}
        {remainingVotes > 0 && (
          <div className="mt-12 text-center animate-fadeIn">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full shadow-glow animate-bounce-gentle">
              <SparklesIcon className="h-5 w-5" />
              <span className="font-poppins font-medium">
                {remainingVotes} vote{remainingVotes !== 1 ? "s" : ""} remaining
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Voting Confirmation Modal */}
      {showModal && (
        <VotingModal
          candidate={selectedCandidate}
          position={selectedPosition}
          onCancel={() => setShowModal(false)}
          onConfirm={confirmVote}
          loading={castingVote}
        />
      )}
    </div>
  );
};

export default VoterDashboard;
