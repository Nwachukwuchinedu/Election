import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CalendarIcon,
  UserGroupIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  FireIcon,
  EyeIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  KeyIcon,
  UserIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { adminAPI, electionAPI, authAPI } from "../services/api";
import Header from "../components/common/Header";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CountdownTimer from "../components/common/CountdownTimer";
import VoterManagement from "../components/admin/VoterManagement";
import StatCard from "../components/admin/StatCard";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalVoters: 0,
    votersWhoVoted: 0,
    participation: "0%",
    totalCandidates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voteStats, setVoteStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [electionStatus, setElectionStatus] = useState(null);
  const [showElectionModal, setShowElectionModal] = useState(false);
  const [electionForm, setElectionForm] = useState({
    startTime: "",
    endTime: ""
  });
  const [electionLogs, setElectionLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [showAdmins, setShowAdmins] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Listen for election status updates
    newSocket.on("electionStatusUpdate", (updatedElection) => {
      setElectionStatus(updatedElection);
      // Refresh logs when election status changes
      fetchElectionLogs();
    });

    // Listen for vote cast events
    newSocket.on("voteCast", (voteData) => {
      // Refresh data when a vote is cast
      fetchData(true);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);

    try {
      const [votersRes, statsRes] = await Promise.all([
        adminAPI.getVoters(),
        adminAPI.getVoteStats(),
      ]);

      // Calculate participation rate
      const participationRate =
        votersRes.data.totalVoters > 0
          ? (
              (votersRes.data.votersWhoVoted / votersRes.data.totalVoters) *
              100
            ).toFixed(1) + "%"
          : "0%";

      // Count total candidates and stash vote stats
      let totalCandidates = 0;
      Object.values(statsRes.data).forEach((position) => {
        totalCandidates += position.candidates.length;
      });
      setVoteStats(statsRes.data);

      setStats({
        totalVoters: votersRes.data.totalVoters,
        votersWhoVoted: votersRes.data.votersWhoVoted,
        participation: participationRate,
        totalCandidates: totalCandidates,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    } finally {
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchElectionStatus();
  }, []);

  const fetchElectionStatus = async () => {
    try {
      const response = await electionAPI.getStatus();
      setElectionStatus(response.data.election);
      
      // Fetch logs when election status changes
      fetchElectionLogs();
    } catch (err) {
      console.error("Error fetching election status:", err);
    }
  };

  const fetchElectionLogs = async () => {
    try {
      const response = await electionAPI.getLogs(); // Get all logs
      setElectionLogs(response.data.logs || []);
    } catch (err) {
      console.error("Error fetching election logs:", err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await adminAPI.getAllAdmins();
      setAdmins(response.data.admins || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const handleStartElection = async () => {
    try {
      await electionAPI.startElection(electionForm);
      await fetchElectionStatus();
      setShowElectionModal(false);
      setElectionForm({ startTime: "", endTime: "" });
    } catch (err) {
      console.error("Error starting election:", err);
    }
  };

  const handleUpdateElectionStatus = async (status) => {
    try {
      await electionAPI.updateStatus({ status });
      await fetchElectionStatus();
    } catch (err) {
      console.error("Error updating election status:", err);
    }
  };

  const handleStartNewElection = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    setElectionForm({
      startTime: now.toISOString().slice(0, 16),
      endTime: oneHourLater.toISOString().slice(0, 16)
    });
    setShowElectionModal(true);
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    
    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordSuccess("Password changed successfully");
      setPasswordError("");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess("");
        setShowChangePassword(false);
      }, 3000);
    } catch (err) {
      setPasswordError(err.message || "Error changing password");
    }
  };

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  const participationNum = parseFloat(stats.participation);
  const isHighParticipation = participationNum >= 70;
  const isMediumParticipation = participationNum >= 40;

  // Check if election is active
  const isElectionActive = electionStatus && electionStatus.status === 'ongoing';
  const isElectionPaused = electionStatus && electionStatus.status === 'paused';
  const isElectionCompleted = electionStatus && electionStatus.status === 'completed';

  // Function to manually generate and send election results
  const generateElectionResults = async () => {
    try {
      setIsLoading(true);
      await electionAPI.generateResults();
      alert('Election results generated and sent successfully!');
    } catch (error) {
      console.error('Error generating election results:', error);
      alert('Failed to generate and send election results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Header user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Election Status Banner */}
        {electionStatus && (
          <div className="mb-8">
            <div className={`rounded-2xl p-6 shadow-card border backdrop-blur-sm ${
              isElectionActive ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
              isElectionPaused ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' :
              isElectionCompleted ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
              'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-poppins font-bold text-gray-900">
                    {electionStatus.name}
                  </h2>
                  <p className="text-gray-600 font-montserrat mt-1">
                    Status: <span className="font-semibold capitalize">{electionStatus.status.replace('_', ' ')}</span>
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 flex space-x-3">
                  {electionStatus.status === 'not_started' && (
                    <button
                      onClick={() => setShowElectionModal(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-montserrat font-medium"
                    >
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Schedule Election
                    </button>
                  )}
                  
                  {electionStatus.status === 'not_started' && (
                    <button
                      onClick={() => handleUpdateElectionStatus('ongoing')}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-montserrat font-medium"
                    >
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Start Now
                    </button>
                  )}
                  
                  {isElectionActive && (
                    <button
                      onClick={() => handleUpdateElectionStatus('paused')}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-montserrat font-medium"
                    >
                      <PauseIcon className="h-5 w-5 mr-2" />
                      Pause
                    </button>
                  )}
                  
                  {isElectionPaused && (
                    <button
                      onClick={() => handleUpdateElectionStatus('ongoing')}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-montserrat font-medium"
                    >
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Resume
                    </button>
                  )}
                  
                  {(isElectionActive || isElectionPaused) && (
                    <button
                      onClick={() => handleUpdateElectionStatus('completed')}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-montserrat font-medium"
                    >
                      <StopIcon className="h-5 w-5 mr-2" />
                      End Election
                    </button>
                  )}
                  
                  {isElectionCompleted && (
                    <button
                      onClick={handleStartNewElection}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-montserrat font-medium"
                    >
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Start New Election
                    </button>
                  )}
                  
                  {/* Add button to view logs */}
                  <button
                    onClick={() => {
                      setShowLogs(!showLogs);
                      if (!showLogs) fetchElectionLogs();
                    }}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-montserrat font-medium"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    {showLogs ? 'Hide Logs' : 'View Logs'}
                  </button>
                  
                  {/* Add button to view admins */}
                  <button
                    onClick={() => {
                      setShowAdmins(!showAdmins);
                      if (!showAdmins) fetchAdmins();
                    }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-montserrat font-medium"
                  >
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    {showAdmins ? 'Hide Admins' : 'View Admins'}
                  </button>
                  
                  {/* Add button to change password */}
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-montserrat font-medium"
                  >
                    <KeyIcon className="h-5 w-5 mr-2" />
                    Change Password
                  </button>
                </div>
              </div>
              
              {electionStatus.startTime && electionStatus.endTime && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:space-x-6">
                    <div className="flex items-center text-gray-600 font-montserrat">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span>Start: {new Date(electionStatus.startTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 font-montserrat mt-2 sm:mt-0">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      <span>End: {new Date(electionStatus.endTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Election Logs Section */}
            {showLogs && (
              <div className="mt-4 bg-white rounded-2xl shadow-card border border-gray-200 p-6">
                <h3 className="text-lg font-poppins font-bold text-gray-900 mb-4">Election Activity Logs</h3>
                {electionLogs.length === 0 ? (
                  <p className="text-gray-500 font-montserrat">No activity logs available.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                            Timestamp
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                            Action
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                            Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                            Device
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {electionLogs.map((log, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-montserrat">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-montserrat capitalize">
                              {log.action}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-montserrat">
                              {log.details}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-montserrat">
                              {log.userName || 'System'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-montserrat">
                              {log.deviceInfo ? `${log.deviceInfo.platform || ''} ${log.deviceInfo.browser || ''}` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Admins Section */}
            {showAdmins && (
              <div className="mt-4 bg-white rounded-2xl shadow-card border border-gray-200 p-6">
                <h3 className="text-lg font-poppins font-bold text-gray-900 mb-4">Administrators</h3>
                {admins.length === 0 ? (
                  <p className="text-gray-500 font-montserrat">No administrators found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                            Last Login
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {admins.map((admin, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-montserrat">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-poppins font-bold">
                                    {admin.firstName?.charAt(0) || ''}{admin.lastName?.charAt(0) || ''}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {admin.firstName} {admin.lastName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-montserrat">
                              {admin.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-montserrat">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {admin.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-montserrat">
                              {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Change Password Modal */}
            {showChangePassword && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                  <h3 className="text-xl font-poppins font-bold text-gray-900 mb-4">
                    Change Password
                  </h3>
                  
                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                      <p className="text-green-700 font-montserrat text-sm">{passwordSuccess}</p>
                    </div>
                  )}
                  
                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                      <p className="text-red-700 font-montserrat text-sm">{passwordError}</p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-montserrat"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-montserrat"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-montserrat"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: ""
                        });
                        setPasswordError("");
                        setPasswordSuccess("");
                      }}
                      className="px-4 py-2 text-gray-700 font-montserrat font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-primary-600 text-white font-montserrat font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isElectionActive && electionStatus.endTime && (
              <div className="mt-4">
                <CountdownTimer electionStatus={electionStatus} />
              </div>
            )}
          </div>
        )}
        
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/50 rounded-3xl shadow-card border border-white/60 backdrop-blur-sm p-8 mb-8 overflow-hidden animate-slideUp">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <SparklesIcon className="absolute top-4 right-4 h-6 w-6 text-yellow-500 animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl shadow-glow">
                <ChartBarIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-poppins font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-secondary-700 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-lg font-montserrat text-gray-600 mt-1">
                  Welcome back, {user?.firstName}! Monitor election progress in
                  real-time.
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <EyeIcon
                className={`h-5 w-5 text-gray-600 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              <span className="font-montserrat text-sm text-gray-700">
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>

          {/* Live Status Indicator */}
          <div className="mt-6 flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-montserrat font-medium text-green-700">
                Live Data
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-montserrat text-gray-600">
              <ClockIcon className="h-4 w-4" />
              <span>Auto-refresh every 30s</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="animate-slideUp" style={{ animationDelay: "0.1s" }}>
            <StatCard
              title="Total Voters"
              value={stats.totalVoters}
              icon={UsersIcon}
              color="primary"
              trend="+12% from last election"
            />
          </div>
          <div className="animate-slideUp" style={{ animationDelay: "0.2s" }}>
            <StatCard
              title="Votes Cast"
              value={stats.votersWhoVoted}
              icon={TrophyIcon}
              color="success"
              trend={`${stats.participation} participation rate`}
            />
          </div>
          <div className="animate-slideUp" style={{ animationDelay: "0.3s" }}>
            <StatCard
              title="Participation"
              value={stats.participation}
              icon={UserGroupIcon}
              color={isHighParticipation ? "success" : isMediumParticipation ? "warning" : "danger"}
              trend={isHighParticipation ? "High engagement!" : isMediumParticipation ? "Good participation" : "Needs improvement"}
            />
          </div>
          <div className="animate-slideUp" style={{ animationDelay: "0.4s" }}>
            <StatCard
              title="Candidates"
              value={stats.totalCandidates}
              icon={ChartBarIcon}
              color="secondary"
              trend="Across all positions"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/60 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm font-montserrat transition-colors duration-200 ${
                  activeTab === "dashboard"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("voters")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm font-montserrat transition-colors duration-200 ${
                  activeTab === "voters"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <UsersIcon className="h-5 w-5" />
                  <span>Voter Management</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* Vote Statistics */}
                <div>
                  <h3 className="text-xl font-poppins font-bold text-gray-900 mb-6">
                    Vote Statistics
                  </h3>
                  {Object.keys(voteStats).length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                        <ChartBarIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-montserrat">
                        No vote statistics available yet
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(voteStats).map(([position, data]) => (
                        <div
                          key={position}
                          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                          <h4 className="font-poppins font-bold text-gray-900 mb-4">
                            {position}
                          </h4>
                          <div className="space-y-3">
                            {data.candidates.map((candidate) => (
                              <div key={candidate._id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {/* Profile Image or Initials */}
                                  {candidate.profilePictureUrl ? (
                                    <img 
                                      src={candidate.profilePictureUrl} 
                                      alt={`${candidate.firstName || ''} ${candidate.lastName || ''}`} 
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-poppins font-bold text-sm">
                                      {candidate.firstName?.charAt(0) || ''}
                                      {candidate.lastName?.charAt(0) || ''}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-poppins font-medium text-gray-900">
                                      {candidate.firstName || ''} {candidate.lastName || ''}
                                    </p>
                                    <p className="text-xs font-montserrat text-gray-500">
                                      {candidate.position || ''}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-poppins font-bold text-gray-900">
                                    {candidate.voteCount || 0}
                                  </span>
                                  <span className="text-xs font-montserrat text-gray-500">
                                    votes
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "voters" && <VoterManagement />}
          </div>
        </div>
      </div>
      
      {/* Election Modal */}
      {showElectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-poppins font-bold text-gray-900 mb-4">
              Schedule Election
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={electionForm.startTime}
                  onChange={(e) => setElectionForm({...electionForm, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-montserrat"
                />
              </div>
              
              <div>
                <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={electionForm.endTime}
                  onChange={(e) => setElectionForm({...electionForm, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-montserrat"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowElectionModal(false)}
                className="px-4 py-2 text-gray-700 font-montserrat font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartElection}
                className="px-4 py-2 bg-primary-600 text-white font-montserrat font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Start Election
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;