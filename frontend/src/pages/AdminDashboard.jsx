import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Header from '../components/common/Header';
import StatCard from '../components/admin/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Simple icons as SVG components
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const VoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVoters: 0,
    votersWhoVoted: 0,
    participation: '0%',
    totalCandidates: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voteStats, setVoteStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [votersRes, statsRes] = await Promise.all([
          adminAPI.getVoters(),
          adminAPI.getVoteStats()
        ]);

        // Calculate participation rate
        const participationRate = votersRes.data.totalVoters > 0
          ? ((votersRes.data.votersWhoVoted / votersRes.data.totalVoters) * 100).toFixed(1) + '%'
          : '0%';

        // Count total candidates and stash vote stats
        let totalCandidates = 0;
        Object.values(statsRes.data).forEach(position => {
          totalCandidates += position.candidates.length;
        });
        setVoteStats(statsRes.data);

        setStats({
          totalVoters: votersRes.data.totalVoters,
          votersWhoVoted: votersRes.data.votersWhoVoted,
          participation: participationRate,
          totalCandidates: totalCandidates
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor election progress and voter statistics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Voters"
            value={stats.totalVoters}
            icon={UsersIcon}
            color="primary"
          />
          <StatCard
            title="Votes Cast"
            value={stats.votersWhoVoted}
            icon={VoteIcon}
            color="success"
          />
          <StatCard
            title="Participation"
            value={stats.participation}
            icon={ChartIcon}
            color="info"
          />
          <StatCard
            title="Candidates"
            value={stats.totalCandidates}
            icon={PersonIcon}
            color="warning"
          />
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

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vote Statistics */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Progress</h3>
            {Object.keys(voteStats).length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">No vote data available yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(voteStats).map(([position, data]) => {
                  const maxVotes = Math.max(1, data.totalVotes || 0);
                  return (
                    <div key={position}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{position}</h4>
                        <span className="text-sm text-gray-600">{data.totalVotes} total</span>
                      </div>
                      <div className="space-y-2">
                        {data.candidates.map(c => {
                          const widthPercent = Math.round(((c.votes || 0) / maxVotes) * 100);
                          return (
                            <div key={c.candidateId} className="">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-700">{c.name}</span>
                                <span className="text-gray-600">{c.votes}</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${widthPercent}%` }} />
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

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Candidates</h3>
            {Object.keys(voteStats).length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">No data to display.</p>
              </div>
            ) : (
              <div className="divide-y">
                {Object.entries(voteStats).map(([position, data]) => {
                  const sorted = [...data.candidates].sort((a, b) => b.votes - a.votes);
                  const top = sorted[0];
                  return (
                    <div key={position} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{position}</p>
                        <p className="font-medium text-gray-900">{top ? top.name : '—'}</p>
                      </div>
                      <span className="text-sm text-gray-700">{top ? `${top.votes} votes` : '0 votes'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;