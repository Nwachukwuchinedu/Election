import React from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

const LoadingSpinner = ({ size = "default", message = "Loading..." }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    default: "h-12 w-12",
    large: "h-16 w-16",
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-secondary-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6 animate-fadeIn">
        {/* Logo with Spinner */}
        <div className="relative">
          {/* Outer Spinning Ring */}
          <div
            className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-600 border-r-secondary-500 rounded-full animate-spin`}
          ></div>

          {/* Inner Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-glow animate-pulse">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-poppins font-semibold text-gray-800 animate-pulse">
            {message}
          </h3>
          <p className="text-sm font-montserrat text-gray-600">
            Securing your connection...
          </p>

          {/* Progress Dots */}
          <div className="flex space-x-1 justify-center mt-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
