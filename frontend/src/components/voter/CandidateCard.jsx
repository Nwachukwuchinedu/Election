import React, { useState } from "react";
import {
  UserIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const CandidateCard = ({ candidate, position, disabled, onVote, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleVote = () => {
    if (!disabled && onVote) {
      onVote(candidate, position);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div
      className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-card border border-white/60 
                 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 
                 ${
                   disabled
                     ? "opacity-75"
                     : "hover:shadow-card-hover cursor-pointer"
                 }
                 ${isHovered && !disabled ? "scale-[1.02]" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full -translate-y-10 translate-x-10"></div>

      {/* Status Badge */}
      {disabled && (
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 px-3 py-1 bg-green-100 border border-green-200 rounded-full animate-pulse">
          <CheckCircleIcon className="h-4 w-4 text-green-600" />
          <span className="text-xs font-poppins font-medium text-green-800">
            Voted
          </span>
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={toggleLike}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-200 group/like"
      >
        {isLiked ? (
          <HeartSolidIcon className="h-5 w-5 text-red-500 animate-pulse" />
        ) : (
          <HeartIcon className="h-5 w-5 text-gray-400 group-hover/like:text-red-400 transition-colors" />
        )}
      </button>

      {/* Image Section */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {!imageError && candidate.profilePictureUrl ? (
          <img
            src={candidate.profilePictureUrl}
            alt={`${candidate.firstName} ${candidate.lastName}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
            <UserIcon className="h-20 w-20 text-primary-400" />
          </div>
        )}

        {/* Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                        transition-opacity duration-300 ${
                          isHovered && !disabled ? "opacity-100" : "opacity-0"
                        }`}
        >
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm font-montserrat opacity-90">
              {candidate.bio ||
                "Dedicated to serving the community with integrity and vision."}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Name and Title */}
        <div className="space-y-2">
          <h3 className="text-xl font-poppins font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
            {candidate.firstName} {candidate.lastName}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <p className="text-sm font-montserrat text-gray-600 capitalize">
              {candidate.position || position}
            </p>
          </div>
        </div>

        {/* Candidate Info */}
        {candidate.department && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg font-montserrat font-medium">
              {candidate.department}
            </span>
            {candidate.level && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-lg font-montserrat font-medium">
                Level {candidate.level}
              </span>
            )}
          </div>
        )}

        {/* Vote Button */}
        <button
          onClick={handleVote}
          disabled={disabled}
          className={`group/btn relative w-full px-6 py-4 rounded-2xl font-poppins font-semibold 
                     transition-all duration-300 overflow-hidden ${
                       disabled
                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                         : isSelected
                         ? "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl"
                         : `bg-gradient-to-r from-primary-600 to-primary-700 text-white 
                 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl
                 transform hover:-translate-y-0.5 active:translate-y-0`
                     }`}
        >
          {/* Button Background Animation */}
          {!disabled && !isSelected && (
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
          )}

          <div className="relative flex items-center justify-center space-x-2">
            {disabled ? (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                <span>Vote Cast</span>
              </>
            ) : isSelected ? (
              <>
                <XMarkIcon className="h-5 w-5" />
                <span>Remove Vote</span>
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5 group-hover/btn:animate-pulse" />
                <span>Vote for {candidate.firstName}</span>
                <ArrowRightIcon className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </div>
        </button>

        {/* Additional Info */}
        {candidate.slogan && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm font-raleway italic text-gray-600 text-center">
              "{candidate.slogan}"
            </p>
          </div>
        )}
      </div>

      {/* Glow Effect on Hover */}
      <div
        className={`absolute inset-0 rounded-3xl transition-opacity duration-300 pointer-events-none
                      ${isHovered && !disabled ? "opacity-100" : "opacity-0"}`}
      >
        <div className="absolute inset-0 rounded-3xl shadow-glow"></div>
      </div>
    </div>
  );
};

export default CandidateCard;