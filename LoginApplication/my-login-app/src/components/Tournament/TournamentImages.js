import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TournamentImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true
    });

    // Static images directly from the known files
    const staticImages = [
      { 
        id: 1, 
        title: 'Tournament Image 1', 
        description: 'Tennis tournament action shot',
        path: 'tournament_images/TennisCourt_Background.jpg'
      },
      { 
        id: 2, 
        title: 'Tournament Image 2', 
        description: 'Tennis player in action',
        path: 'tournament_images/WhatsApp Image 2025-04-27 at 7.49.47 AM.jpeg'
      },
      { 
        id: 3, 
        title: 'Tournament Image 3', 
        description: 'Tennis match highlights',
        path: 'tournament_images/WhatsApp Image 2025-05-01 at 8.53.52 PM.jpeg'
      },
      { 
        id: 4, 
        title: 'Tournament Image 4', 
        description: 'Tennis court view',
        path: 'tournament_images/WhatsApp Image 2025-05-05 at 10.29.20 AM.jpeg'
      },
      { 
        id: 5, 
        title: 'Tournament Image 5', 
        description: 'Tournament celebration',
        path: 'tournament_images/WhatsApp Image 2025-05-03 at 6.56.33 AM.jpeg'
      },
      {
        id: 6,
        title: 'Tournament Image 6',
        description: 'Tennis awards ceremony',
        path: 'tournament_images/WhatsApp Image 2025-05-04 at 7.16.59.jpeg'
      }
    ];

    // Format images for display
    const formattedImages = staticImages.map((image, index) => ({
      id: image.id,
      src: `http://localhost:8000/static/${image.path}`,
      title: image.title,
      description: image.description,
      delay: (index * 100).toString()
    }));
    
    // Set images after a short delay to allow component to mount
    setTimeout(() => {
      setImages(formattedImages);
      setLoading(false);
    }, 500);
  }, []);

  const handleImageError = (e, id) => {
    console.error(`Image with id ${id} failed to load`);
    // Replace with placeholder image
    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
    e.target.classList.add('error-image');
  };

  return (
    <div className="py-6">
      <h1 
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        data-aos="fade-down"
      >
        Tournament Gallery
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="ml-3 text-gray-600">Loading tournament images...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => {
              setLoading(true);
              setError("");
              window.location.reload();
            }} 
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
          <p className="text-lg">No tournament images available at this time.</p>
          <p className="mt-2">Please check back later for updates.</p>
        </div>
      ) : (
        <>
          <p className="text-center text-gray-600 mb-8">Browse our tournament photo gallery showcasing our events and activities.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div 
                key={image.id}
                className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={image.delay}
              >
                <div className="aspect-w-4 aspect-h-3 bg-gray-100">
                  <img 
                    src={image.src} 
                    alt={image.title} 
                    className="w-full h-64 object-cover transition-all duration-500 group-hover:brightness-90"
                    onError={(e) => handleImageError(e, image.id)}
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-white font-medium text-lg">{image.title}</h3>
                    {image.description && (
                      <p className="text-gray-200 text-sm mt-1">{image.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">Showing {images.length} tournament images</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TournamentImages;
