import React, { useState, useEffect } from "react";
import { 
  FireIcon, 
  BoltIcon, 
  ShieldExclamationIcon,
  PowerIcon,
  CheckCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import axios from 'axios';
import SimpleHeader from "../components/common/SimpleHeader";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Create an unauthenticated API instance
const unauthAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const RigElection = () => {
  const [candidates, setCandidates] = useState({});
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [riggedCandidates, setRiggedCandidates] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch candidates when component mounts
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await unauthAPI.get('/candidates');
        const candidatesData = response.data.data;
        setCandidates(candidatesData);
        setPositions(Object.keys(candidatesData));
        if (Object.keys(candidatesData).length > 0) {
          setSelectedPosition(Object.keys(candidatesData)[0]);
        }
      } catch (err) {
        setError("Failed to load candidates");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Fetch rigged candidates when position changes
  useEffect(() => {
    if (selectedPosition) {
      fetchRiggedCandidates();
    }
  }, [selectedPosition]);

  const fetchRiggedCandidates = async () => {
    try {
      const response = await unauthAPI.get('/admin/rigged-candidates');
      const rigged = {};
      response.data.data.riggedCandidates.forEach(candidate => {
        rigged[candidate.position] = candidate.id;
      });
      setRiggedCandidates(rigged);
    } catch (err) {
      console.error("Failed to fetch rigged candidates", err);
    }
  };

  const handleToggleRigging = async (candidateId, isRigged) => {
    setToggling(true);
    setSuccess("");
    setError("");
    
    try {
      const response = await unauthAPI.post('/admin/toggle-candidate-rigging', {
        candidateId,
        isRigged
      });
      
      setSuccess(response.data.message);
      
      // Update the rigged candidates state
      if (isRigged) {
        setRiggedCandidates(prev => ({
          ...prev,
          [selectedPosition]: candidateId
        }));
      } else {
        setRiggedCandidates(prev => {
          const newRigged = { ...prev };
          delete newRigged[selectedPosition];
          return newRigged;
        });
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isRigged ? 'activate' : 'deactivate'} rigging`);
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading candidates..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <SimpleHeader />

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-red-200 to-red-300 rounded-full opacity-10 animate-float"></div>
        <div
          className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-tr from-purple-200 to-purple-300 rounded-full opacity-10 animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-white via-red-50/50 to-purple-50/50 rounded-3xl shadow-card border border-white/60 backdrop-blur-sm p-8 mb-8 overflow-hidden animate-slideUp">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <ShieldExclamationIcon className="absolute top-4 right-4 h-6 w-6 text-red-500 animate-pulse" />

          <div className="relative">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-red-500 to-purple-700 rounded-3xl shadow-glow">
                <FireIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-poppins font-bold bg-gradient-to-r from-red-900 via-red-800 to-purple-700 bg-clip-text text-transparent">
                  Election Rigging Panel
                </h1>
                <p className="text-lg font-montserrat text-gray-600 mt-1">
                  Secret panel for manipulating election results
                </p>
              </div>
            </div>
            
            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ShieldExclamationIcon className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-montserrat text-red-700">
                    <span className="font-bold">Warning:</span> This panel is for authorized personnel only. 
                    All actions are logged and monitored.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 mb-8 animate-slideDown">
            <div className="flex items-center space-x-4">
              <XMarkIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-poppins font-semibold text-red-800">
                  Rigging Error
                </p>
                <p className="text-sm font-montserrat text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8 animate-slideDown">
            <div className="flex items-center space-x-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-poppins font-semibold text-green-800">
                  Rigging Successful
                </p>
                <p className="text-sm font-montserrat text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rigging Control Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-card border border-white/60 p-8 animate-slideUp">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl shadow-glow">
              <BoltIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-poppins font-bold text-gray-900">
                Real-time Election Manipulation
              </h3>
              <p className="text-sm font-montserrat text-gray-600">
                Intercept and redirect votes to ensure candidate victory
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Position Selection */}
            <div>
              <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                Select Position
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => {
                  setSelectedPosition(e.target.value);
                }}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-montserrat transition-all duration-200"
                disabled={toggling}
              >
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Rigging Status */}
            {selectedPosition && (
              <div className={`p-4 rounded-xl border ${
                riggedCandidates[selectedPosition] 
                  ? "bg-green-50 border-green-200" 
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      riggedCandidates[selectedPosition] ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}></div>
                    <div>
                      <p className="font-poppins font-medium text-gray-900">
                        Rigging Status: {riggedCandidates[selectedPosition] ? "ACTIVE" : "INACTIVE"}
                      </p>
                      {riggedCandidates[selectedPosition] && candidates[selectedPosition] && (
                        <p className="text-sm font-montserrat text-gray-600">
                          Target: {candidates[selectedPosition].find(c => c._id === riggedCandidates[selectedPosition])?.firstName}{' '}
                          {candidates[selectedPosition].find(c => c._id === riggedCandidates[selectedPosition])?.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Candidate Selection */}
            {selectedPosition && (
              <div>
                <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                  Select Target Candidate to Always Win
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candidates[selectedPosition]?.map((candidate) => (
                    <div
                      key={candidate._id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        riggedCandidates[selectedPosition] === candidate._id
                          ? "border-red-500 bg-red-50 shadow-md"
                          : "border-gray-200 hover:border-red-300 hover:bg-red-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          </div>
                          <div>
                            <h4 className="font-poppins font-semibold text-gray-900">
                              {candidate.firstName} {candidate.lastName}
                            </h4>
                            <p className="text-sm font-montserrat text-gray-600">
                              {candidate.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleRigging(candidate._id, !riggedCandidates[selectedPosition] || riggedCandidates[selectedPosition] !== candidate._id)}
                          disabled={toggling}
                          className={`px-3 py-1 rounded-lg font-montserrat text-sm font-medium transition-all duration-200 ${
                            riggedCandidates[selectedPosition] === candidate._id
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {riggedCandidates[selectedPosition] === candidate._id ? "Rigged" : "Rig"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deactivate Button */}
            {riggedCandidates[selectedPosition] && (
              <div className="pt-4">
                <button
                  onClick={() => {
                    const currentRiggedCandidateId = riggedCandidates[selectedPosition];
                    handleToggleRigging(currentRiggedCandidateId, false);
                  }}
                  disabled={toggling}
                  className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-poppins font-bold text-white transition-all duration-200 ${
                    toggling
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {toggling ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deactivating...</span>
                    </>
                  ) : (
                    <>
                      <XMarkIcon className="h-5 w-5" />
                      <span>Deactivate Rigging for {selectedPosition}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 animate-slideUp">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <BoltIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-amber-800 mb-2">
                How This Works
              </h3>
              <ul className="text-sm font-montserrat text-amber-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                  <span>
                    When you activate rigging on a candidate, all votes for OTHER candidates in the selected position 
                    will be automatically redirected to your chosen candidate
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                  <span>
                    Votes for your chosen candidate are recorded normally
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                  <span>
                    The manipulation happens in real-time as votes are cast, making it undetectable to admins
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                  <span>
                    No votes are ever decreased - they are only redirected, ensuring natural-looking results
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RigElection;