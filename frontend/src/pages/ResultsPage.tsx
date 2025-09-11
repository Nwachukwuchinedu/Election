import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiRefreshCw, FiAward } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import FloatingShapes from '../components/3d/FloatingShapes';

const ResultsPage = () => {
  const [results, setResults] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      party: 'Progressive Party',
      votes: 14801,
      percentage: 45.0,
      color: '#3B82F6',
      image: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 2,
      name: 'Bob Smith',
      party: 'Unity Coalition',
      votes: 11512,
      percentage: 35.0,
      color: '#8B5CF6',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 3,
      name: 'Carol Davis',
      party: 'Green Alliance',
      votes: 6578,
      percentage: 20.0,
      color: '#10B981',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ]);

  const [totalVotes] = useState(32891);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setResults(prev => {
        const updatedResults = prev.map(candidate => {
          const randomChange = Math.floor(Math.random() * 10) - 5;
          const newVotes = Math.max(0, candidate.votes + randomChange);
          return { ...candidate, votes: newVotes };
        });

        // Calculate percentages within the same update
        const total = updatedResults.reduce((sum, candidate) => sum + candidate.votes, 0);
        return updatedResults.map(candidate => ({
          ...candidate,
          percentage: total > 0 ? (candidate.votes / total) * 100 : 0
        }));
      });
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const winner = results.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-20 pb-10"
    >
      <FloatingShapes />

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#222] mb-2">Election Results</h1>
              <p className="text-[#222]/70">Real-time vote counting and analytics</p>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <motion.div
                animate={{ scale: isLive ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 2, repeat: isLive ? Infinity : 0 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isLive ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-500/20 border border-gray-500/30'
                  }`}
              >
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className={`text-sm font-medium ${isLive ? 'text-green-400' : 'text-gray-400'}`}>
                  {isLive ? 'LIVE' : 'OFFLINE'}
                </span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLive(!isLive)}
                className="px-4 py-2 bg-[#222]/10 border border-[#222]/20 rounded-lg text-[#222] hover:bg-[#222]/20 transition-all duration-300"
              >
                <FiRefreshCw className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Total Votes', value: totalVotes.toLocaleString(), icon: FiUsers, color: 'from-blue-500 to-cyan-500' },
              { title: 'Turnout Rate', value: '65.4%', icon: FiTrendingUp, color: 'from-green-500 to-emerald-500' },
              { title: 'Leading Candidate', value: winner.name.split(' ')[0], icon: FiAward, color: 'from-purple-500 to-violet-500' },
              { title: 'Vote Margin', value: `${Math.abs(results[0].votes - results[1].votes).toLocaleString()}`, icon: FiTrendingUp, color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#222] mb-1">{stat.value}</h3>
                    <p className="text-[#222]/70 text-sm">{stat.title}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Results Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-[#222] mb-6">Vote Distribution</h2>

              <div className="space-y-6">
                {results.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-[#222] font-medium text-sm">{candidate.name}</span>
                          <div className="text-[#222]/60 text-xs">{candidate.party}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#222] font-bold">{candidate.votes.toLocaleString()}</div>
                        <div className="text-[#222]/60 text-xs">{candidate.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-[#222]/10 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${candidate.percentage}%` }}
                        transition={{ delay: 0.8 + index * 0.2, duration: 1, type: "spring" }}
                        className="h-3 rounded-full"
                        style={{ backgroundColor: candidate.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Winner Card */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <GlassCard className="p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAward className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-[#222]">Current Leader</h2>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mb-6"
              >
                <img
                  src={winner.image}
                  alt={winner.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-yellow-500/50"
                />
                <h3 className="text-2xl font-bold text-[#222] mb-2">{winner.name}</h3>
                <p className="text-yellow-400 font-medium mb-2">{winner.party}</p>
                <div className="text-3xl font-bold text-[#222] mb-1">{winner.votes.toLocaleString()}</div>
                <div className="text-[#222]/70">votes ({winner.percentage.toFixed(1)}%)</div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4"
              >
                <div className="text-yellow-400 font-semibold mb-1">Lead Margin</div>
                <div className="text-2xl font-bold text-[#222]">
                  {(winner.votes - (results.find(c => c.id !== winner.id)?.votes || 0)).toLocaleString()}
                </div>
                <div className="text-[#222]/60 text-sm">votes ahead</div>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Live Updates */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#222]">Live Updates</h2>
              <div className="text-[#222]/60 text-sm">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-[#222] font-medium">{candidate.name}</div>
                      <div className="text-[#222]/60 text-sm">{candidate.party}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#222]">{candidate.votes.toLocaleString()}</div>
                  <div className="text-[#222]/70 text-sm">{candidate.percentage.toFixed(1)}% of total votes</div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsPage;