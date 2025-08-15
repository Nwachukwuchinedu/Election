import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiHome, FiBarChart } from 'react-icons/fi';
import { useLocation, Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Confetti from '../components/effects/Confetti';

const VoteConfirmation = () => {
  const location = useLocation();
  const candidate = location.state?.candidate;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti after component mounts
    setTimeout(() => setShowConfetti(true), 500);
    
    // Stop confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3500);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-20 flex items-center justify-center"
    >
      {showConfetti && <Confetti />}
      
      <div className="relative z-10 w-full max-w-2xl px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <GlassCard className="p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.3, 
                type: "spring", 
                stiffness: 200,
                damping: 10 
              }}
              className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
              >
                <FiCheckCircle className="w-16 h-16 text-white" />
              </motion.div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Vote Successfully Cast!
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Thank you for participating in the democratic process. Your vote has been securely recorded.
              </p>
            </motion.div>

            {/* Candidate Confirmation */}
            {candidate && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mb-8"
              >
                <GlassCard className="p-6 bg-white/5">
                  <h3 className="text-white/80 text-sm uppercase tracking-wider mb-3">Your Vote</h3>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <h4 className="text-xl font-bold text-white">{candidate.name}</h4>
                      <p className="text-blue-400 font-medium">{candidate.party}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Vote Details */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">✓</div>
                <div className="text-white/70 text-sm">Vote Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">🔒</div>
                <div className="text-white/70 text-sm">Securely Encrypted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">📊</div>
                <div className="text-white/70 text-sm">Anonymously Counted</div>
              </div>
            </motion.div>

            {/* Important Information */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8"
            >
              <h4 className="text-blue-400 font-semibold mb-2">Important Information</h4>
              <ul className="text-white/70 text-sm space-y-1 text-left">
                <li>• Your vote is final and cannot be changed</li>
                <li>• All votes are encrypted and anonymized</li>
                <li>• Results will be available after the voting deadline</li>
                <li>• You will receive an email confirmation shortly</li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2"
                >
                  <FiHome className="w-5 h-5" />
                  Return Home
                </motion.button>
              </Link>
              
              <Link to="/results">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 backdrop-blur-lg bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <FiBarChart className="w-5 h-5" />
                  View Results
                </motion.button>
              </Link>
            </motion.div>

            {/* Voting ID */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 text-center"
            >
              <p className="text-white/50 text-xs">
                Vote ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VoteConfirmation;