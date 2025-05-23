import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const NewsletterSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    playerCategory: '',
    interests: []
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          interests: [...prev.interests, value]
        };
      } else {
        return {
          ...prev,
          interests: prev.interests.filter(interest => interest !== value)
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Format interests as a comma-separated string
      const interestsString = formData.interests.join(',');
      
      // Send subscription data to backend
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/news/subscribe/', {
        name: formData.name,
        email: formData.email,
        player_category: formData.playerCategory,
        interests: interestsString
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Show success message
      setSubmitted(true);
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        playerCategory: '',
        interests: []
      });
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to subscribe. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <h1 
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        data-aos="fade-down"
      >
        Newsletter Signup
      </h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-10 text-white">
              <h2 className="text-2xl font-bold mb-6">Stay Connected!</h2>
              <p className="mb-6">
                Subscribe to our newsletter and stay updated with:
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Latest academy news and events
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Tournament announcements and results
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Training tips and techniques
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Special offers and promotions
                </li>
              </ul>
              <p className="text-sm opacity-80">
                We respect your privacy and will never share your information with third parties.
              </p>
            </div>
            
            <div className="md:w-1/2 p-10">
              {submitted ? (
                <div 
                  className="bg-green-50 p-6 rounded-lg border border-green-200 text-center"
                  data-aos="fade-up"
                >
                  <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Thank You for Subscribing!</h3>
                  <p className="text-green-700 mb-4">
                    You have successfully subscribed to our newsletter. You'll start receiving updates about our tournaments, programs, and special events.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Subscribe Another Email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="playerCategory" className="block text-sm font-medium text-gray-700 mb-1">Player Category</label>
                    <select
                      id="playerCategory"
                      name="playerCategory"
                      value={formData.playerCategory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select a category</option>
                      <option value="junior">Junior (Under 18)</option>
                      <option value="adult">Adult</option>
                      <option value="senior">Senior (50+)</option>
                      <option value="parent">Parent</option>
                      <option value="coach">Coach</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <span className="block text-sm font-medium text-gray-700 mb-2">Interests</span>
                    <div className="space-y-2">
                      {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                          {error}
                        </div>
                      )}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="training"
                          name="interests"
                          value="training"
                          checked={formData.interests.includes('training')}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="training" className="ml-2 text-sm text-gray-700">Training Programs</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="tournaments"
                          name="interests"
                          value="tournaments"
                          checked={formData.interests.includes('tournaments')}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="tournaments" className="ml-2 text-sm text-gray-700">Tournaments & Events</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="tips"
                          name="interests"
                          value="tips"
                          checked={formData.interests.includes('tips')}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="tips" className="ml-2 text-sm text-gray-700">Tennis Tips & Techniques</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="community"
                          name="interests"
                          value="community"
                          checked={formData.interests.includes('community')}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="community" className="ml-2 text-sm text-gray-700">Community Events</label>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-10 bg-white rounded-lg shadow-md p-6" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">How often will I receive newsletters?</h4>
              <p className="text-gray-600 mt-1">We send newsletters twice a month, with occasional special announcements.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Can I customize what information I receive?</h4>
              <p className="text-gray-600 mt-1">Yes, you can select your interests when signing up, and you can update your preferences at any time.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">How do I unsubscribe?</h4>
              <p className="text-gray-600 mt-1">Every newsletter includes an unsubscribe link at the bottom, which you can use to opt out at any time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
