import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiShield, FiTrendingUp } from 'react-icons/fi';
import ParticleBackground from '../components/3d/ParticleBackground';
import GlassCard from '../components/ui/GlassCard';

const HomePage = () => {
  const features = [
    {
      icon: FiUsers,
      title: 'Secure Voting',
      description: 'Advanced encryption and verification systems ensure your vote is safe and counted.'
    },
    {
      icon: FiShield,
      title: 'Transparent Process',
      description: 'Real-time monitoring and blockchain-based verification for complete transparency.'
    },
    {
      icon: FiTrendingUp,
      title: 'Live Results',
      description: 'Watch election results update in real-time with interactive charts and analytics.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-20"
    >
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-700 to-blue-800 bg-clip-text text-transparent">
            ElectroVote
          </h1>
          <p className="text-xl md:text-2xl text-[#222]/80 mb-8 max-w-2xl mx-auto">
            Experience the future of democratic participation with our advanced digital voting platform
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/voting">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2"
              >
                Start Voting <FiArrowRight />
              </motion.button>
            </Link>

            <Link to="/results">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 backdrop-blur-lg bg-[#222]/10 border border-[#222]/20 text-[#222] rounded-xl font-semibold hover:bg-[#222]/20 transition-all duration-300"
              >
                View Results
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Election Details */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-16"
        >
          <GlassCard className="p-8 text-center">
            <h2 className="text-3xl font-bold text-[#222] mb-4">2024 General Election</h2>
            <p className="text-[#222]/80 text-lg mb-6">
              Participate in shaping the future. Your voice matters, your vote counts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">50,247</div>
                <div className="text-[#222]/70">Registered Voters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">12</div>
                <div className="text-[#222]/70">Candidates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">7 Days</div>
                <div className="text-[#222]/70">Until Deadline</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center h-full">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#222] mb-3">{feature.title}</h3>
                  <p className="text-[#222]/80">{feature.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;