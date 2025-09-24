import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  FireIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { candidatesAPI, votesAPI, electionAPI } from "../services/api";
import Header from "../components/common/Header";
import CandidateCard from "../components/voter/CandidateCard";
import VotingModal from "../components/voter/VotingModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CountdownTimer from "../components/common/CountdownTimer";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

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
  const [castingVote, setCastingVote] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [electionStatus, setElectionStatus] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Listen for election status updates
    newSocket.on("electionStatusUpdate", (updatedElection) => {
      setElectionStatus(updatedElection);
    });

    // Listen for vote cast events
    newSocket.on("voteCast", (voteData) => {
      // Refresh vote status when a vote is cast
      fetchVoteStatus();
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchVoteStatus = async () => {
    try {
      const votesRes = await votesAPI.getMyVotes();
      setVotingStatus(votesRes.data);
    } catch (err) {
      console.error("Error fetching vote status:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [candidatesRes, votesRes, electionRes] = await Promise.all([
          candidatesAPI.getAll(),
          votesAPI.getMyVotes(),
          electionAPI.getStatus()
        ]);

        setCandidates(candidatesRes.data);
        setVotingStatus(votesRes.data);
        setElectionStatus(electionRes.election);
      } catch (err) {
        setError("Failed to load data: " + (err.message || "Unknown error"));
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectCandidate = (candidateId, position) => {
    // If the candidate is already selected for this position, deselect them
    if (selectedCandidates[position] === candidateId) {
      setSelectedCandidates(prev => ({
        ...prev,
        [position]: null
      }));
    } else {
      // Select this candidate for the position
      setSelectedCandidates(prev => ({
        ...prev,
        [position]: candidateId
      }));
    }
  };

  const confirmVote = async () => {
    // Check if user has already voted
    if (votingStatus.votedPositions.length > 0) {
      setError("You have already voted. Duplicate voting is not allowed.");
      return;
    }

    // Check if election is active
    if (!electionStatus || electionStatus.status !== 'ongoing') {
      setError("Voting is not currently active.");
      return;
    }

    setCastingVote(true);
    try {
      // Prepare votes data - one vote per position for the selected candidate
      const votesForAllPositions = {};
      Object.keys(selectedCandidates).forEach(position => {
        if (selectedCandidates[position]) {
          votesForAllPositions[position] = {
            [selectedCandidates[position]]: 1 // One vote for the selected candidate
          };
        }
      });

      // Cast votes for all positions
      await votesAPI.castVote({
        votesForAllPositions
      });

      // Update voting status to show all positions as voted
      const allPositions = Object.keys(candidates);
      setVotingStatus({
        votedPositions: allPositions,
        availablePositions: []
      });

      setShowModal(false);
    } catch (err) {
      setError("Failed to cast votes: " + (err.message || "Unknown error"));
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

  // Check if all positions have a selected candidate
  const allPositionsHaveSelection = Object.values(selectedCandidates).every(
    candidateId => candidateId !== null && candidateId !== undefined
  );

  if (loading) return <LoadingSpinner />;

  // Check if election is active
  const isElectionActive = electionStatus && electionStatus.status === 'ongoing';
  const isElectionPaused = electionStatus && electionStatus.status === 'paused';
  const isElectionCompleted = electionStatus && electionStatus.status === 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Election Status Banner */}
        {electionStatus && (
          <div className="mb-8">
            <div className={`rounded-2xl p-6 shadow-card border backdrop-blur-sm ${isElectionActive ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
                isElectionPaused ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' :
                  isElectionCompleted ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
                    'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              }`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-poppins font-bold text-gray-900">
                    {electionStatus.name}
                  </h2>
                  <p className="text-gray-600 font-montserrat mt-1">
                    Status: <span className="font-semibold capitalize">{electionStatus.status.replace('_', ' ')}</span>
                  </p>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-montserrat mt-2 md:mt-0 ${isElectionActive ? 'bg-green-100 text-green-800' :
                    isElectionPaused ? 'bg-yellow-100 text-yellow-800' :
                      isElectionCompleted ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                  }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isElectionActive ? 'bg-green-500 animate-pulse' :
                      isElectionPaused ? 'bg-yellow-500' :
                        isElectionCompleted ? 'bg-gray-500' :
                          'bg-blue-500'
                    }`}></div>
                  {isElectionActive ? 'Election Active' :
                    isElectionPaused ? 'Election Paused' :
                      isElectionCompleted ? 'Election Completed' :
                        'Election Scheduled'}
                </div>
              </div>

              {electionStatus.startTime && electionStatus.endTime && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:space-x-6">
                    <div className="flex items-center text-gray-600 font-montserrat">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span>Start: {new Date(electionStatus.startTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 font-montserrat mt-2 sm:mt-0">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      <span>End: {new Date(electionStatus.endTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isElectionActive && electionStatus.endTime && (
              <div className="mt-4">
                <CountdownTimer electionStatus={electionStatus} />
              </div>
            )}
          </div>
        )}

        {/* Election Status Messages */}
        {!isElectionActive && !isElectionPaused && electionStatus && (
          <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-card border border-yellow-200">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="ml-4">
                <h3 className="font-poppins font-bold text-yellow-900">
                  {isElectionCompleted ? "Election Has Ended" : "Election Not Active"}
                </h3>
                <p className="font-montserrat text-yellow-700 mt-1">
                  {isElectionCompleted
                    ? "Thank you for participating. The election has concluded."
                    : "Voting is not currently active. Please check back later."}
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-blue-800 mb-2">
                Important Voting Instructions
              </h3>
              <ul className="text-sm font-montserrat text-blue-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>
                    You must vote for <span className="font-bold">one candidate in each position</span> before submitting your votes
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>
                    Click "Vote for [Candidate Name]" to select a candidate for each position
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>
                    Click "Remove Vote" to deselect a candidate
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>
                    Once you submit your votes, you cannot change them
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

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
                        Select one candidate for this position
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
                  {positionCandidates.map((candidate, candidateIndex) => {
                    const isSelected = selectedCandidates[positionName] === (candidate.id || candidate._id);

                    return (
                      <div
                        key={candidate.id || candidate._id}
                        className="animate-scaleIn"
                        style={{ animationDelay: `${0.1 * candidateIndex}s` }}
                      >
                        <CandidateCard
                          candidate={candidate}
                          position={positionName}
                          disabled={hasVoted(positionName) || !isElectionActive}
                          onVote={() => handleSelectCandidate(candidate.id || candidate._id, positionName)}
                          isSelected={isSelected}
                        />
                      </div>
                    );
                  })}
                </div>

              </section>
            )
          )}
        </div>

        {/* Submit All Votes Button */}
        <div className="mt-12 text-center animate-fadeIn">
          <button
            onClick={() => setShowModal(true)}
            disabled={castingVote || !allPositionsHaveSelection || votingStatus.votedPositions.length > 0 || !isElectionActive}
            className={`px-8 py-4 rounded-full font-poppins font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${castingVote || !allPositionsHaveSelection || votingStatus.votedPositions.length > 0 || !isElectionActive
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 hover:shadow-xl"
              }`}
          >
            {castingVote ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting Votes...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <TrophyIcon className="h-5 w-5" />
                <span>Submit All Votes</span>
              </div>
            )}
          </button>
          {!allPositionsHaveSelection && (
            <p className="text-sm font-montserrat text-gray-600 mt-2">
              Select one candidate for each position to enable submission
            </p>
          )}
          {votingStatus.votedPositions.length > 0 && (
            <p className="text-sm font-montserrat text-red-600 mt-2">
              You have already voted. Duplicate voting is not allowed.
            </p>
          )}
          {!isElectionActive && (
            <p className="text-sm font-montserrat text-red-600 mt-2">
              Voting is not currently active.
            </p>
          )}
        </div>
      </div>

      {/* Voting Confirmation Modal */}
      {showModal && (
        <VotingModal
          onCancel={() => setShowModal(false)}
          onConfirm={confirmVote}
          loading={castingVote}
          selectedCandidates={selectedCandidates}
          candidates={candidates}
        />
      )}
    </div>
  );
};

export default VoterDashboard;