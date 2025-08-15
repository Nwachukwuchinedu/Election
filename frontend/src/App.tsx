import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CandidateManagement from './pages/CandidateManagement';
import VoterVerification from './pages/VoterVerification';
import VotingPage from './pages/VotingPage';
import VoteConfirmation from './pages/VoteConfirmation';
import ResultsPage from './pages/ResultsPage';
import VotingDeadline from './pages/VotingDeadline';
import Navigation from './components/ui/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
        <Navigation />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/candidate-management" element={<CandidateManagement />} />
            <Route path="/voter-verification" element={<VoterVerification />} />
            <Route path="/voting" element={<VotingPage />} />
            <Route path="/vote-confirmation" element={<VoteConfirmation />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/voting-deadline" element={<VotingDeadline />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;