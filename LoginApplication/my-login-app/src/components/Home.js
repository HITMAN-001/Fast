import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import logo from '../MKTA tennis acedemy logo.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/', { replace: true });
  };

  const handleDelete = () => {
    // Implement delete functionality if needed
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} onDelete={handleDelete} />
      
      <div className="relative h-screen">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${logo})`,
            filter: 'brightness(0.4)'
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div 
            className="text-center mb-16"
            data-aos="fade-down"
          >
            <h1 className="text-5xl font-bold text-white mb-4 tracking-wider drop-shadow-lg">
              MKTA Tennis Academy
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 bg-black bg-opacity-40 p-8 rounded-lg backdrop-blur-sm">
            <p 
              className="text-lg text-white leading-relaxed font-medium drop-shadow-md"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Manoj Kusalkar Tennis Academy has been shaping champions and fostering a love for tennis for 25 years. 
              Founded with a vision to provide world-class training, the academy has grown into a premier institution 
              where aspiring players refine their skills under expert guidance.
            </p>

            <p 
              className="text-lg text-white leading-relaxed font-medium drop-shadow-md"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Led by Manoj Kusalkar, a former ATP professional, the academy offers intensive training programs, 
              competitive coaching, and a supportive environment for players of all levels. Whether it's juniors 
              aiming for professional careers or adults looking to enhance their game, MKTA ensures top-tier coaching, 
              fitness training, and tournament preparation.
            </p>

            <p 
              className="text-lg text-white leading-relaxed font-medium drop-shadow-md"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              Beyond technical excellence, the academy is a place where passion meets discipline, creating a strong 
              community of tennis enthusiasts. With its state-of-the-art facilities and experienced coaching staff, 
              the academy continues to inspire and develop the next generation of tennis stars.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
