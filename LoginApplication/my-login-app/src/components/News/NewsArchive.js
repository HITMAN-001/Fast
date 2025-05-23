import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../../MKTA tennis acedemy logo.jpg';

const NewsArchive = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false
    });
  }, []);

  // Sample archived news data
  const archivedNews = [
    {
      id: 1,
      title: "Annual Tennis Tournament Results",
      date: "March 15, 2025",
      summary: "The annual academy tournament concluded with exciting matches across all age categories. Check out the full results and highlights from this year's competition.",
      category: "Events",
      image: logo
    },
    {
      id: 2,
      title: "Academy Expansion: New Courts Added",
      date: "February 28, 2025",
      summary: "We're excited to announce the addition of three new clay courts to our facility, expanding our capacity and providing more diverse training surfaces for our players.",
      category: "Facilities",
      image: logo
    },
    {
      id: 3,
      title: "Winter Training Camp Highlights",
      date: "January 20, 2025",
      summary: "Our winter training camp was a huge success with over 50 participants. The intensive two-week program focused on technique refinement and match strategy.",
      category: "Programs",
      image: logo
    },
    {
      id: 4,
      title: "Academy Players Selected for National Camp",
      date: "December 10, 2024",
      summary: "Five of our academy players have been selected to attend the National Tennis Federation's elite training camp. This is a testament to their hard work and our coaching methods.",
      category: "Achievements",
      image: logo
    },
    {
      id: 5,
      title: "New Fitness Program Launched",
      date: "November 5, 2024",
      summary: "We've introduced a specialized fitness program designed specifically for tennis players, focusing on agility, endurance, and injury prevention.",
      category: "Programs",
      image: logo
    },
    {
      id: 6,
      title: "Coach Seminar: Modern Tennis Techniques",
      date: "October 18, 2024",
      summary: "Our coaching staff attended a seminar on modern tennis techniques and training methodologies, bringing back valuable insights to enhance our training programs.",
      category: "Staff",
      image: logo
    },
    {
      id: 7,
      title: "Community Outreach: Tennis for All Initiative",
      date: "September 25, 2024",
      summary: "Our academy launched the 'Tennis for All' initiative, providing free introductory lessons to underprivileged children in the community.",
      category: "Community",
      image: logo
    },
    {
      id: 8,
      title: "Partnership with Sports Science Institute",
      date: "August 12, 2024",
      summary: "We're proud to announce our partnership with the Sports Science Institute, which will provide our players with access to advanced performance analysis and recovery techniques.",
      category: "Partnerships",
      image: logo
    }
  ];

  // Filter categories
  const categories = ['all', 'events', 'programs', 'achievements', 'facilities', 'staff', 'community', 'partnerships'];

  // Filter news based on category and search term
  const filteredNews = archivedNews.filter(news => {
    const matchesCategory = filter === 'all' || news.category.toLowerCase() === filter;
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         news.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-6">
      <h1 
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        data-aos="fade-down"
      >
        News Archive
      </h1>
      
      {/* Search and Filter */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              id="category-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search News</label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* News Archive List */}
      {filteredNews.length > 0 ? (
        <div className="space-y-6">
          {filteredNews.map((news, index) => (
            <div 
              key={news.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay={(index * 50).toString()}
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img 
                    className="h-48 w-full object-cover md:w-48" 
                    src={news.image} 
                    alt={news.title} 
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="inline-block px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-600 rounded-full">
                        {news.category}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-gray-800">{news.title}</h3>
                    </div>
                    <span className="text-sm text-gray-500">{news.date}</span>
                  </div>
                  <p className="mt-3 text-gray-600">{news.summary}</p>
                  <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
                    Read Full Article →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
      
      {/* Pagination placeholder for future implementation */}
      <div className="mt-8 flex justify-center">
        <p className="text-sm text-gray-500">Showing all {filteredNews.length} results</p>
      </div>
    </div>
  );
};

export default NewsArchive;
