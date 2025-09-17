import React, { useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData);
      if (!result.success) {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 animate-slideDown">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-poppins font-medium text-red-800">
                Authentication Failed
              </p>
              <p className="text-sm font-montserrat text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-poppins font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <EnvelopeIcon
              className={`h-5 w-5 transition-colors duration-200 ${
                focusedField === "email" ? "text-primary-500" : "text-gray-400"
              }`}
            />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField("")}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl font-montserrat
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                     transition-all duration-200 bg-gray-50 focus:bg-white
                     hover:border-gray-400 group-hover:shadow-sm"
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-poppins font-medium text-gray-700">
          Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <LockClosedIcon
              className={`h-5 w-5 transition-colors duration-200 ${
                focusedField === "password"
                  ? "text-primary-500"
                  : "text-gray-400"
              }`}
            />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField("")}
            className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl font-montserrat
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                     transition-all duration-200 bg-gray-50 focus:bg-white
                     hover:border-gray-400 group-hover:shadow-sm"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !formData.email || !formData.password}
        className="group relative w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 
                 text-white font-poppins font-semibold rounded-xl 
                 hover:from-primary-700 hover:to-primary-800 
                 focus:ring-4 focus:ring-primary-200 
                 transition-all duration-300 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                 overflow-hidden"
      >
        {/* Button Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

        <div className="relative flex items-center justify-center space-x-2">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Vote</span>
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </div>
      </button>

      {/* Additional Features */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center space-x-2 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="font-montserrat text-gray-600 group-hover:text-gray-800 transition-colors">
            Remember me
          </span>
        </label>
        <button
          type="button"
          className="font-montserrat text-primary-600 hover:text-primary-800 transition-colors hover:underline"
        >
          Forgot password?
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white font-montserrat text-gray-500">
            Secure & Encrypted
          </span>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <LockClosedIcon className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-xs font-poppins font-medium text-blue-900">
            256-bit Encryption
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg
              className="h-4 w-4 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-xs font-poppins font-medium text-green-900">
            Anonymous Voting
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
