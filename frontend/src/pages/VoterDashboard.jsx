import React, { useState, useEffect } from 'react';
import { candidatesAPI, votesAPI } from '../services/api';
import Header from '../components/common/Header';
import CandidateCard from '../components/voter/CandidateCard';
import VotingModal from '../components/voter/VotingModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const VoterDashboard = () => {
  const [candidates, setCandidates] = useState({});
  const [votingStatus, setVotingStatus] = useState({ votedPositions: [], availablePositions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [castingVote, setCastingVote] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesRes, votesRes] = await Promise.all([
          candidatesAPI.getAll(),
          votesAPI.getMyVotes()
        ]);
        
        setCandidates(candidatesRes.data);
        setVotingStatus(votesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
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
        candidateId: selectedCandidate.id || selectedCandidate._id
      });

      // Update voting status
      const updatedVotedPositions = [...votingStatus.votedPositions, selectedPosition];
      const updatedAvailablePositions = votingStatus.availablePositions.filter(
        pos => pos !== selectedPosition
      );

      setVotingStatus({
        votedPositions: updatedVotedPositions,
        availablePositions: updatedAvailablePositions
      });

      setShowModal(false);
    } catch (err) {
      setError('Failed to cast vote');
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to the Election Dashboard!
          </h1>
          <p className="text-gray-600">
            Cast your vote for the following positions. You can vote once per position.
          </p>
        </div>
        
        {/* Voting Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-600">Positions Available</h3>
            <p className="text-2xl font-bold text-gray-900">{totalPositions}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-600">Votes Cast</h3>
            <p className="text-2xl font-bold text-success-600">{votedPositions}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-600">Remaining</h3>
            <p className="text-2xl font-bold text-warning-600">{remainingVotes}</p>
          </div>
        </div>
        
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-error-800">Error</p>
                <p className="text-sm text-error-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Positions & Candidates */}
        <div className="space-y-8">
          {Object.entries(candidates).map(([positionName, positionCandidates]) => (
            <section key={positionName} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{positionName}</h2>
                {hasVoted(positionName) && (
                  <span className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium">
                    ✓ Vote Cast
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {positionCandidates.map(candidate => (
                  <CandidateCard 
                    key={candidate.id || candidate._id} 
                    candidate={candidate}
                    position={positionName}
                    disabled={hasVoted(positionName)}
                    onVote={handleVote}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
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