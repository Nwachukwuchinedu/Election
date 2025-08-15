import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiUser, FiArrowRight } from 'react-icons/fi';
import ParticleBackground from '../components/3d/ParticleBackground';
import GlassCard from '../components/ui/GlassCard';
import { useNavigate } from 'react-router-dom';

const VotingPage = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const candidates = [
    {
      id: 1,
      name: 'Alice Johnson',
      party: 'Progressive Party',
      image: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Experienced leader focused on education and healthcare reform.',
      policies: ['Education Reform', 'Healthcare Access', 'Climate Action']
    },
    {
      id: 2,
      name: 'Bob Smith',
      party: 'Unity Coalition',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Business executive advocating for economic growth and innovation.',
      policies: ['Economic Growth', 'Innovation Hub', 'Job Creation']
    },
    {
      id: 3,
      name: 'Carol Davis',
      party: 'Green Alliance',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Environmental advocate working for sustainable future policies.',
      policies: ['Green Energy', 'Environmental Protection', 'Sustainable Development']
    }
  ];

  const handleVote = async () => {
    if (!selectedCandidate) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      navigate('/vote-confirmation', { 
        state: { 
          candidate: candidates.find(c => c.id === selectedCandidate) 
        } 
      });
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-20 pb-10"
    >
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cast Your Vote</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Select your preferred candidate for the 2024 General Election. Your vote matters and will be securely recorded.
          </p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-block mt-4 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm"
          >
            ✓ Identity Verified
          </motion.div>
        </motion.div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {candidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ y: 100, opacity: 0, rotateY: -15 }}
              animate={{ y: 0, opacity: 1, rotateY: 0 }}
              transition={{ 
                delay: index * 0.2, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -20,
                rotateY: 5,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              onClick={() => setSelectedCandidate(candidate.id)}
              className="cursor-pointer"
            >
              <GlassCard 
                className={`p-6 relative overflow-hidden transition-all duration-500 ${
                  selectedCandidate === candidate.id
                    ? 'ring-4 ring-blue-500/50 bg-blue-500/10 border-blue-400/40'
                    : ''
                }`}
              >
                {/* Selection Indicator */}
                <AnimatePresence>
                  {selectedCandidate === candidate.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10"
                    >
                      <FiCheck className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Candidate Image */}
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1"
                  >
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Floating Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs rounded-full font-semibold"
                  >
                    Candidate
                  </motion.div>
                </div>

                {/* Candidate Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{candidate.name}</h3>
                  <p className="text-blue-400 font-semibold mb-3">{candidate.party}</p>
                  <p className="text-white/80 text-sm leading-relaxed">{candidate.description}</p>
                </div>

                {/* Policy Tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {candidate.policies.map((policy, policyIndex) => (
                    <motion.span
                      key={policyIndex}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 + policyIndex * 0.05 }}
                      className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs"
                    >
                      {policy}
                    </motion.span>
                  ))}
                </div>

                {/* Vote Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCandidate(candidate.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCandidate === candidate.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {selectedCandidate === candidate.id ? 'Selected' : 'Select Candidate'}
                </motion.button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Submit Vote Button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <GlassCard className="inline-block p-6">
            <motion.button
              whileHover={{ scale: selectedCandidate ? 1.05 : 1 }}
              whileTap={{ scale: selectedCandidate ? 0.95 : 1 }}
              onClick={handleVote}
              disabled={!selectedCandidate || isSubmitting}
              className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
                selectedCandidate
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  Submitting Vote...
                </>
              ) : (
                <>
                  Cast Your Vote
                  <FiArrowRight className="w-6 h-6" />
                </>
              )}
            </motion.button>
            
            {!selectedCandidate && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-white/60 text-sm mt-3"
              >
                Please select a candidate to continue
              </motion.p>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VotingPage;