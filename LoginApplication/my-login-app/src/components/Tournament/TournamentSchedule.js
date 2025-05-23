import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TournamentSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false
    });

    // Fetch tournament schedule from the backend
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/tournament/schedules/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Format the date for display
        const formattedSchedule = response.data.map(item => ({
          ...item,
          date: new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }));
        
        setScheduleData(formattedSchedule);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tournament schedule:', err);
        setError('Failed to load schedule. Please try again later.');
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="py-6">
      <h1 
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        data-aos="fade-down"
      >
        Tournament Schedule
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : scheduleData.length === 0 ? (
        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
          <p>No tournament schedule available at this time.</p>
        </div>
      ) : (
        <div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          data-aos="fade-up"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Round</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Court</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Players</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scheduleData.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    data-aos="fade-up"
                    data-aos-delay={(index * 50).toString()}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.round}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.court}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.players}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-indigo-50 p-6 rounded-lg shadow-sm" data-aos="fade-up" data-aos-delay="200">
        <h3 className="text-lg font-semibold text-indigo-700 mb-2">Important Notice</h3>
        <p className="text-gray-700">
          Schedule is subject to change based on weather conditions and court availability. 
          Please check back regularly for updates or sign up for notifications.
        </p>
      </div>
    </div>
  );
};

export default TournamentSchedule;
