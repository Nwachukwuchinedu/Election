import React, { useState } from "react";
import {
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

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

          {/* User Menu */}
          <div className="flex items-center space-x-4 animate-slideLeft">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
              <BellIcon className="h-5 w-5 group-hover:animate-bounce-gentle" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Info */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-8 w-8 text-gray-600 group-hover:text-primary-600 transition-colors" />
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-poppins font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs font-montserrat text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-gray-200 py-2 animate-slideDown">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-poppins font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs font-montserrat text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors font-montserrat"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <div className="h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 animate-shimmer bg-[length:200%_100%]"></div>
    </header>
  );
};

export default Header;
