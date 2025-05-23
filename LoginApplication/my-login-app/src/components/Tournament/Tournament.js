import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import TournamentImages from './TournamentImages';
import TournamentSchedule from './TournamentSchedule';
import TournamentResults from './TournamentResults';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Tournament = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('images');

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      once: false
    });

    // Set active tab based on current path
    const path = location.pathname.split('/').pop();
    if (path === 'schedule' || path === 'results' || path === 'images') {
      setActiveTab(path);
    } else {
      // Default to images
      setActiveTab('images');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/', { replace: true });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/tournament/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />
      
      {/* Tournament Navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3">
            <button
              onClick={() => handleTabChange('images')}
              className={`px-6 py-3 mx-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'images'
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => handleTabChange('schedule')}
              className={`px-6 py-3 mx-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'schedule'
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => handleTabChange('results')}
              className={`px-6 py-3 mx-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'results'
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Results
            </button>
          </div>
        </div>
      </div>

      {/* Tournament Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'images' && <TournamentImages />}
        {activeTab === 'schedule' && <TournamentSchedule />}
        {activeTab === 'results' && <TournamentResults />}
      </div>
    </div>
  );
};

export default Tournament;
