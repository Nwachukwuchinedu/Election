import React from "react";
import { ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary-200 to-secondary-300 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-10 animate-pulse-slow"></div>
      </div>

      {/* Main Login Card */}
      <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 animate-slideUp">
        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-10 animate-bounce-gentle"></div>
        <div
          className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-secondary-400 to-secondary-600 rounded-full opacity-10 animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-6 shadow-glow animate-glow">
            <ShieldCheckIcon className="h-10 w-10 text-white" />
            <SparklesIcon className="absolute -top-1 -right-1 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Election Portal
          </h1>
          <p className="text-gray-600 font-montserrat text-lg">
            Secure • Transparent • Democratic
          </p>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
        </div>

        {/* Login Form */}
        <div className="animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <LoginForm />
        </div>

        {/* Security Notice */}
        <div
          className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 animate-slideUp"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-start space-x-3">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-poppins font-medium text-blue-900 mb-1">
                Secure Voting System
              </p>
              <p className="text-blue-700 font-montserrat">
                Your vote is encrypted, anonymous, and protected by advanced
                security measures.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Element */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

export default Login;
