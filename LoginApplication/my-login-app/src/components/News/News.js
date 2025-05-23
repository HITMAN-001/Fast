import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import NewsLatest from './NewsLatest';
import NewsArchive from './NewsArchive';
import NewsletterSignup from './NewsletterSignup';
import AOS from 'aos';
import 'aos/dist/aos.css';

const News = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('latest');

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      once: false
    });

    // Set active tab based on current path
    const path = location.pathname.split('/').pop();
    if (path === 'archive' || path === 'newsletter' || path === 'latest') {
      setActiveTab(path);
    } else {
      // Default to latest
      setActiveTab('latest');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/', { replace: true });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/news/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />
      
      {/* News Navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3">
            <button
              onClick={() => handleTabChange('latest')}
              className={`px-6 py-3 mx-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'latest'
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Latest News
            </button>
            <button
              onClick={() => handleTabChange('archive')}
              className={`px-6 py-3 mx-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'archive'
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              News Archive
            </button>
            <button
              onClick={() => handleTabChange('newsletter')}
              className={`px-6 py-3 mx-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'newsletter'
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Newsletter Signup
            </button>
          </div>
        </div>
      </div>

      {/* News Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'latest' && <NewsLatest />}
        {activeTab === 'archive' && <NewsArchive />}
        {activeTab === 'newsletter' && <NewsletterSignup />}
      </div>
    </div>
  );
};

export default News;
