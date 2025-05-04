import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaBriefcase, FaLock } from 'react-icons/fa';

const MainPage = () => {
  const navigate = useNavigate();

  const handleCandidateClick = () => {
    navigate('/applicants');
  };

  const handleClientClick = () => {
    navigate('/clients');
  };

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">AYRFU - Are You Ready For UDDAN</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to UDDAN's portal. Choose how you'd like to interact with us today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Candidate Card */}
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={handleCandidateClick}
          >
            <div className="bg-blue-600 p-6 flex justify-center">
              <FaUserTie className="text-white text-6xl" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Candidates</h2>
              <p className="text-gray-600 mb-6">
                Looking for an exciting career opportunity? Explore our open positions and join our team of professionals.
              </p>
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Enter as a Candidate
              </button>
            </div>
          </div>

          {/* Client Card */}
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={handleClientClick}
          >
            <div className="bg-green-600 p-6 flex justify-center">
              <FaBriefcase className="text-white text-6xl" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Clients</h2>
              <p className="text-gray-600 mb-6">
                Discover how UDDAN can help your business grow with our specialized services and solutions.
              </p>
              <button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Enter as a Client
              </button>
            </div>
          </div>

          {/* UDDAN Super User Card */}
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={handleAdminClick}
          >
            <div className="bg-purple-600 p-6 flex justify-center">
              <FaLock className="text-white text-6xl" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">UDDAN Team</h2>
              <p className="text-gray-600 mb-6">
                Authorized personnel only. Access the back office to manage positions, services, and communications.
              </p>
              <button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Team Login
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Why Choose UDDAN?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Expertise in the genes</h3>
              <p className="text-gray-600">
                With +50 consultants and +10 experts with over 13 years of experience in the field.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Certifications are a must</h3>
              <p className="text-gray-600">
                100% certified professionals, continuous learning is present in our daily activities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality as motto</h3>
              <p className="text-gray-600">
                Projects delivered on-time, on-budget and complying with expected requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white mt-20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">UDDAN</h3>
              <p className="text-gray-400">New age IT Consulting</p>
            </div>
            <div className="flex space-x-4">
              <a href="/about" className="hover:text-blue-400 transition-colors duration-300">About</a>
              <a href="/contact" className="hover:text-blue-400 transition-colors duration-300">Contact</a>
              <a href="/privacy" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} UDDAN. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;