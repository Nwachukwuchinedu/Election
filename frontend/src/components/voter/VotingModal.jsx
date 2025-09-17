import React, { useEffect, useState } from "react";
import {
  ShieldCheckIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const VotingModal = ({ candidate, position, onCancel, onConfirm, loading }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1); // 1: confirm, 2: processing, 3: success

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(onCancel, 300);
  };

  const handleConfirm = async () => {
    setStep(2);
    await onConfirm();
    setStep(3);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onCancel, 300);
    }, 2000);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-lg w-full border border-white/20 overflow-hidden transform transition-all duration-500 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-poppins font-bold">
                  Confirm Your Vote
                </h3>
                <p className="text-white/80 font-montserrat text-sm">
                  Secure & Anonymous
                </p>
              </div>
            </div>

            <button
              onClick={handleCancel}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              disabled={loading}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Candidate Info */}
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
                  {candidate.profilePictureUrl ? (
                    <img
                      src={candidate.profilePictureUrl}
                      alt={`${candidate.firstName} ${candidate.lastName}`}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <UserIcon className="h-8 w-8 text-primary-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-poppins font-bold text-gray-900">
                    {candidate.firstName} {candidate.lastName}
                  </h4>
                  <p className="text-sm font-montserrat text-gray-600 capitalize">
                    Candidate for {position}
                  </p>
                </div>
              </div>

              {/* Warning Message */}
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-poppins font-medium text-amber-900 mb-1">
                    Important Notice
                  </p>
                  <p className="text-sm font-montserrat text-amber-800">
                    Once confirmed, your vote cannot be changed or undone.
                    Please ensure this is your final choice.
                  </p>
                </div>
              </div>

              {/* Security Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-xs font-poppins font-medium text-green-900">
                    Encrypted
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  </div>
                  <p className="text-xs font-poppins font-medium text-blue-900">
                    Anonymous
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <SparklesIcon className="absolute -top-2 -right-2 h-8 w-8 text-yellow-500 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xl font-poppins font-bold text-gray-900 mb-2">
                  Casting Your Vote
                </h4>
                <p className="text-gray-600 font-montserrat">
                  Securely processing your vote...
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircleIcon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto bg-green-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <div>
                <h4 className="text-xl font-poppins font-bold text-green-900 mb-2">
                  Vote Cast Successfully! 🎉
                </h4>
                <p className="text-green-700 font-montserrat">
                  Thank you for participating in the election.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {step === 1 && (
          <div className="px-8 pb-8">
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-poppins font-medium hover:bg-gray-200 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl font-poppins font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>Cast My Vote</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingModal;
