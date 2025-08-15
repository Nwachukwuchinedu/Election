import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import ParticleBackground from '../components/3d/ParticleBackground';

const VotingDeadline = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        } else {
          setIsExpired(true);
          return prev;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, color: 'from-blue-500 to-cyan-500' },
    { label: 'Hours', value: timeLeft.hours, color: 'from-purple-500 to-violet-500' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'from-green-500 to-emerald-500' },
    { label: 'Seconds', value: timeLeft.seconds, color: 'from-orange-500 to-red-500' }
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
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiClock className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {isExpired ? 'Voting Has Ended' : 'Voting Deadline'}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {isExpired 
              ? 'Thank you for your participation. Results are being tabulated.'
              : 'Make sure to cast your vote before the deadline. Every vote counts!'
            }
          </p>
        </motion.div>

        {!isExpired ? (
          <>
            {/* Countdown Timer */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {timeUnits.map((unit, index) => (
                <motion.div
                  key={unit.label}
                  initial={{ y: 100, opacity: 0, rotateY: -90 }}
                  animate={{ y: 0, opacity: 1, rotateY: 0 }}
                  transition={{ 
                    delay: index * 0.2, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <GlassCard className="p-6 text-center">
                    <motion.div
                      key={unit.value}
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${unit.color} bg-clip-text text-transparent mb-3`}
                    >
                      {unit.value.toString().padStart(2, '0')}
                    </motion.div>
                    <div className="text-white/80 text-lg font-medium">{unit.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Important Information */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FiCalendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Election Details</h3>
                </div>
                
                <div className="space-y-3 text-white/80">
                  <div className="flex justify-between">
                    <span>Election Date:</span>
                    <span className="font-semibold">December 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deadline:</span>
                    <span className="font-semibold text-red-400">11:59 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Candidates:</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eligible Voters:</span>
                    <span className="font-semibold">50,247</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <FiAlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Important Reminders</h3>
                </div>
                
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Ensure you have completed voter verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Each voter can cast only one ballot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Votes cannot be changed after submission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Results will be available immediately after deadline</span>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-center mt-12"
            >
              <GlassCard className="inline-block p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Haven't voted yet?</h2>
                <p className="text-white/80 mb-6">
                  Time is running out. Make your voice heard in this historic election.
                </p>
                <motion.a
                  href="/voter-verification"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                >
                  Vote Now
                </motion.a>
              </GlassCard>
            </motion.div>
          </>
        ) : (
          /* Expired State */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <GlassCard className="p-12 max-w-2xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FiClock className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Voting Period Has Ended</h2>
              <p className="text-white/80 text-lg mb-8">
                Thank you to everyone who participated in this election. 
                The votes are now being counted and results will be available shortly.
              </p>
              
              <motion.a
                href="/results"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                View Results
              </motion.a>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VotingDeadline;