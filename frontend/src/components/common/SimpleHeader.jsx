import React from "react";
import {
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const SimpleHeader = () => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 animate-slideRight">
            <div className="relative p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-glow group hover:shadow-glow-lg transition-all duration-300">
              <ShieldCheckIcon className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
              <SparklesIcon className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse opacity-80" />
            </div>
            <div>
              <h1 className="text-xl font-poppins font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Election Portal
              </h1>
              <p className="text-xs font-montserrat text-gray-500 -mt-1">
                Secure Voting System
              </p>
            </div>
          </div>

          {/* Center Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200 animate-fadeIn">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-montserrat font-medium text-green-700">
              System Online
            </span>
          </div>

          {/* Empty space for alignment */}
          <div className="w-10"></div>
        </div>
      </div>

      {/* Animated Border */}
      <div className="h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 animate-shimmer bg-[length:200%_100%]"></div>
    </header>
  );
};

export default SimpleHeader;