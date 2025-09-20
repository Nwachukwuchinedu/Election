import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const CountdownTimer = ({ electionStatus }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (!electionStatus || !electionStatus.endTime) {
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(electionStatus.endTime);
      
      // Adjust for paused duration
      const pausedDuration = electionStatus.pausedDuration || 0;
      const adjustedEndTime = new Date(endTime.getTime() + pausedDuration);
      
      const difference = adjustedEndTime - now;
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return null;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Set up interval to update countdown
    const timer = setInterval(() => {
      if (electionStatus.status === 'ongoing') {
        setTimeLeft(calculateTimeLeft());
      }
    }, 1000);

    // Clean up interval
    return () => {
      clearInterval(timer);
      setIsMounted(false);
    };
  }, [electionStatus]);

  if (!isMounted || !timeLeft) {
    return null;
  }

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-card border border-white/60 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-poppins font-bold text-gray-900">Election Ends In</h3>
        <ClockIcon className="h-6 w-6 text-blue-600" />
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-poppins font-bold text-gray-900">{days}</div>
          <div className="text-xs font-montserrat text-gray-500 uppercase">Days</div>
        </div>
        
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-poppins font-bold text-gray-900">{hours}</div>
          <div className="text-xs font-montserrat text-gray-500 uppercase">Hours</div>
        </div>
        
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-poppins font-bold text-gray-900">{minutes}</div>
          <div className="text-xs font-montserrat text-gray-500 uppercase">Minutes</div>
        </div>
        
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-poppins font-bold text-gray-900">{seconds}</div>
          <div className="text-xs font-montserrat text-gray-500 uppercase">Seconds</div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-montserrat ${
          electionStatus.status === 'ongoing' ? 'bg-green-100 text-green-800' : 
          electionStatus.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            electionStatus.status === 'ongoing' ? 'bg-green-500 animate-pulse' : 
            electionStatus.status === 'paused' ? 'bg-yellow-500' : 
            'bg-gray-500'
          }`}></div>
          {electionStatus.status === 'ongoing' ? 'Election Active' : 
           electionStatus.status === 'paused' ? 'Election Paused' : 
           'Election Status'}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;