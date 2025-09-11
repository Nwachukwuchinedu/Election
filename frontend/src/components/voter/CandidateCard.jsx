import React from 'react';

const CandidateCard = ({ candidate, position, disabled, onVote }) => {
  const handleVote = () => {
    if (!disabled && onVote) {
      onVote(candidate, position);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <div className="aspect-square w-full bg-gray-100">
        <img 
          src={candidate.profilePictureUrl} 
          alt={`${candidate.firstName} ${candidate.lastName}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {candidate.firstName} {candidate.lastName}
        </h3>
        <p className="text-gray-600 mb-4">{candidate.position}</p>
        
        <button 
          onClick={handleVote}
          disabled={disabled}
          className={`w-full px-4 py-2 rounded-lg transition-colors ${
            disabled 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {disabled ? 'Already Voted' : `Vote for ${candidate.firstName}`}
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;