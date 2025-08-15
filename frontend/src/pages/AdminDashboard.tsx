import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserCheck, FiTrendingUp, FiClock, FiActivity, FiBarChart3 } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import FloatingShapes from '../components/3d/FloatingShapes';

const AdminDashboard = () => {
  const stats = [
    { 
      title: 'Total Voters', 
      value: '50,247', 
      change: '+12%', 
      icon: FiUsers, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      title: 'Votes Cast', 
      value: '32,891', 
      change: '+8%', 
      icon: FiUserCheck, 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      title: 'Turnout Rate', 
      value: '65.4%', 
      change: '+3.2%', 
      icon: FiTrendingUp, 
      color: 'from-purple-500 to-violet-500' 
    },
    { 
      title: 'Time Remaining', 
      value: '7 Days', 
      change: '', 
      icon: FiClock, 
      color: 'from-orange-500 to-red-500' 
    }
  ];

  const activities = [
    { user: 'John Doe', action: 'Cast vote', time: '2 mins ago', type: 'vote' },
    { user: 'Jane Smith', action: 'Registered to vote', time: '5 mins ago', type: 'register' },
    { user: 'Mike Johnson', action: 'Updated profile', time: '10 mins ago', type: 'update' },
    { user: 'Sarah Wilson', action: 'Cast vote', time: '15 mins ago', type: 'vote' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-20 pb-10"
    >
      <FloatingShapes />
      
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/70">Monitor and manage the election process</p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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
                    {stat.change && (
                      <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-white/70 text-sm">{stat.title}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Area */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <GlassCard className="p-6 h-96">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Vote Distribution</h2>
                <FiBarChart3 className="w-6 h-6 text-white/70" />
              </div>
              
              <div className="space-y-4">
                {[
                  { candidate: 'Alice Johnson', percentage: 45, votes: '14,801', color: 'bg-blue-500' },
                  { candidate: 'Bob Smith', percentage: 35, votes: '11,512', color: 'bg-purple-500' },
                  { candidate: 'Carol Davis', percentage: 20, votes: '6,578', color: 'bg-green-500' }
                ].map((candidate, index) => (
                  <motion.div
                    key={index}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{candidate.candidate}</span>
                      <span className="text-white/70 text-sm">{candidate.votes} votes</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${candidate.percentage}%` }}
                        transition={{ delay: 0.8 + index * 0.2, duration: 1 }}
                        className={`h-3 ${candidate.color} rounded-full`}
                      />
                    </div>
                    <div className="text-right text-white/70 text-sm mt-1">{candidate.percentage}%</div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <GlassCard className="p-6 h-96">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                <FiActivity className="w-6 h-6 text-white/70" />
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-80">
                {activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'vote' ? 'bg-green-500/20' : 
                      activity.type === 'register' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                    }`}>
                      {activity.type === 'vote' ? '✓' : 
                       activity.type === 'register' ? '+' : '~'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-white/50 text-xs">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8"
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300"
              >
                Manage Candidates
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300"
              >
                View All Voters
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300"
              >
                Export Results
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;