import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Use logo as placeholder image for fallback
import placeholderImage from '../../MKTA tennis acedemy logo.jpg';

const NewsLatest = () => {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false
    });

    // Fetch news articles from the backend
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/news/articles/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Format the data and separate featured from recent articles
        const articles = response.data;
        
        // Find the featured article
        const featured = articles.find(article => article.is_featured) || articles[0];
        
        // Format the featured article
        if (featured) {
          setFeaturedArticle({
            ...featured,
            image: featured.image_path ? 
              `http://localhost:8000/static/${featured.image_path}` : 
              placeholderImage,
            date: new Date(featured.publication_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          });
        }
        
        // Get recent articles (excluding the featured one)
        const recent = articles
          .filter(article => article.id !== (featured ? featured.id : -1))
          .slice(0, 4)
          .map(article => ({
            ...article,
            date: new Date(article.publication_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }));
        
        setRecentArticles(recent);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news articles:', err);
        setError('Failed to load news articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="py-6">
      <h1 
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        data-aos="fade-down"
      >
        Latest News & Updates
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
      ) : (
        <>
          {/* Featured Article */}
          {featuredArticle && (
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden mb-10"
              data-aos="fade-up"
            >
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title} 
                    className="w-full h-64 md:h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage;
                    }}
                  />
                </div>
                <div className="md:w-1/2 p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {featuredArticle.category}
                    </span>
                    <span className="text-gray-500 text-sm ml-4">{featuredArticle.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{featuredArticle.title}</h2>
                  <p className="text-gray-600 mb-6">{featuredArticle.content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">By {featuredArticle.author}</span>
                    <Link 
                      to={`/news/article/${featuredArticle.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Recent Articles */}
          {recentArticles.length > 0 && (
            <>
              <h2 
                className="text-2xl font-bold text-gray-800 mb-6"
                data-aos="fade-up"
              >
                Recent Updates
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentArticles.map((article, index) => (
                  <div 
                    key={article.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                    data-aos="fade-up"
                    data-aos-delay={(index * 100).toString()}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-sm ml-4">{article.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.summary}</p>
                      <Link 
                        to={`/news/article/${article.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* View All News Button */}
          <div className="text-center mt-10" data-aos="fade-up">
            <Link 
              to="/news/archive" 
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              View All News
            </Link>
          </div>
        </>
      )}
      
      {/* Call to Action */}
      <div 
        className="mt-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <h3 className="text-2xl font-bold mb-4">Stay Updated!</h3>
        <p className="mb-6">Subscribe to our newsletter to receive the latest news and updates from Manoj Kusalkar Tennis Academy.</p>
        <button 
          onClick={() => window.location.href = '/news/newsletter'}
          className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default NewsLatest;
