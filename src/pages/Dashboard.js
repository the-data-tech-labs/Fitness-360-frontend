import React, { useRef, useState, useEffect } from "react";
import Services from "./Services";
import Footer from './footer';
import WhatWeOffer from "./WhatWeOffer";

const Dashboard = () => {
  const servicesRef = useRef(null);
  const whatWeOfferRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Smooth scroll behavior for the entire page
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  // Scroll event listener for smooth transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate scroll progress (0 to 1)
      const progress = scrollY / (documentHeight - windowHeight);
      setScrollProgress(progress);

      // Trigger animations based on scroll position
      if (servicesRef.current) {
        const servicesTop = servicesRef.current.getBoundingClientRect().top;
        const servicesProgress = Math.max(0, Math.min(1, (windowHeight - servicesTop) / windowHeight));
        servicesRef.current.style.transform = `scale(${0.9 + servicesProgress * 0.1})`;
        servicesRef.current.style.opacity = servicesProgress;
      }

      if (whatWeOfferRef.current) {

        
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-r from-purple-900 to-black shadow-lg snap-start">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="fitnessworkout.mp4" type="video/mp4" />
          Video Not supported
        </video>

        {/* Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-900/80 to-black/50 z-10" />

        {/* Hero Content */}
        <div className="absolute top-1/2 left-[10%] transform -translate-y-1/2 text-left text-white z-20 max-w-2xl">
          <h1 className="font-bold text-4xl md:text-6xl animate-slide-in-left">
            Welcome to FitFlow
          </h1>

          <h2 className="mt-4 text-xl md:text-2xl animate-slide-in-right animation-delay-500">
            Your journey to fitness and nutrition starts here!
          </h2>

          <button
            onClick={() => servicesRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 bg-purple-800 hover:bg-purple-700 text-white font-semibold text-xl px-8 py-3 rounded-lg transition-all duration-300 hover:scale-110"
          >
            Explore Our Services
          </button>

        </div>

        {/* Attractive Divider at the End of Hero Section */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-purple-900 to-transparent z-20" />
      </div>






      {/* Services Section */}
      <div
        id="services-section"
        ref={servicesRef}
        className="relative w-full min-h-screen bg-white rounded-t-[40px] scale-90 origin-top shadow-xl transition-all duration-500 z-20 overflow-hidden -mt-[20vh] opacity-0 snap-start"
      >
        <Services />

        {/* Attractive Divider at the End of Services Section */}
        <div className="absolute bottom-0 left-0 w-full h-25 bg-gradient-to-t from-gray-100 to-transparent z-20" />
      </div>



      <WhatWeOffer/>

      {/* Footer Section */}
      <Footer />
      
      

      {/* Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-purple-800 z-50"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-left {
          animation: slideInLeft 2s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 2s ease-out;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #7c3aed;
          border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
      `}</style>
    </>
  );
};

export default Dashboard;
