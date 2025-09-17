import React, { useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

const StatCard = ({ title, value, icon: Icon, color, trend, change }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    primary: {
      bg: "from-blue-500 to-blue-700",
      icon: "bg-blue-100 text-blue-600",
      text: "text-blue-600",
      glow: "shadow-blue-200",
    },
    success: {
      bg: "from-green-500 to-green-700",
      icon: "bg-green-100 text-green-600",
      text: "text-green-600",
      glow: "shadow-green-200",
    },
    info: {
      bg: "from-indigo-500 to-indigo-700",
      icon: "bg-indigo-100 text-indigo-600",
      text: "text-indigo-600",
      glow: "shadow-indigo-200",
    },
    warning: {
      bg: "from-orange-500 to-orange-700",
      icon: "bg-orange-100 text-orange-600",
      text: "text-orange-600",
      glow: "shadow-orange-200",
    },
    error: {
      bg: "from-red-500 to-red-700",
      icon: "bg-red-100 text-red-600",
      text: "text-red-600",
      glow: "shadow-red-200",
    },
  };

  const currentColor = colorClasses[color] || colorClasses.primary;
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;

  return (
    <div
      className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 p-6 
                 transition-all duration-300 hover:shadow-card-hover transform hover:-translate-y-1 
                 ${isHovered ? "scale-[1.02]" : ""} overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentColor.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
      ></div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-20 -translate-y-10 translate-x-10"></div>

      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <p className="text-sm font-poppins font-medium text-gray-600">
              {title}
            </p>
            {change !== undefined && (
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-montserrat font-medium ${
                  isPositiveChange
                    ? "bg-green-100 text-green-700"
                    : isNegativeChange
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {isPositiveChange && <ArrowUpIcon className="h-3 w-3" />}
                {isNegativeChange && <ArrowDownIcon className="h-3 w-3" />}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>

          <p className="text-3xl font-poppins font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
            {value}
          </p>

          {trend && (
            <p className="text-xs font-montserrat text-gray-500 group-hover:text-gray-600 transition-colors">
              {trend}
            </p>
          )}
        </div>

        <div className="relative">
          {/* Icon Container */}
          <div
            className={`p-4 rounded-2xl ${currentColor.icon} group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md`}
          >
            {Icon && <Icon className="h-8 w-8 group-hover:animate-pulse" />}
          </div>

          {/* Glow Effect */}
          <div
            className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            } ${currentColor.glow} shadow-lg`}
          ></div>
        </div>
      </div>

      {/* Progress Bar (if applicable) */}
      {title.toLowerCase().includes("participation") && (
        <div className="mt-4 relative">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${currentColor.bg} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
              style={{ width: `${Math.min(parseFloat(value) || 0, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Hover Indicator */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
          currentColor.bg
        } 
                      transform transition-transform duration-300 ${
                        isHovered ? "translate-y-0" : "translate-y-full"
                      }`}
      ></div>
    </div>
  );
};

export default StatCard;
