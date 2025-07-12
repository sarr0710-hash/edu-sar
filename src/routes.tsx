import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import IssueCertificate from './pages/IssueCertificate';
import BulkIssue from './pages/BulkIssue';
import VerifyCertificate from './pages/VerifyCertificate';
import MyCertificates from './pages/MyCertificates';
import EduCredAgent from './pages/EduCredAgent';
import AdminDashboard from './pages/AdminDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/issue" element={<IssueCertificate />} />
          <Route path="/bulk-issue" element={<BulkIssue />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/my-certificates" element={<MyCertificates />} />
          <Route path="/voice-agent" element={<EduCredAgent />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;