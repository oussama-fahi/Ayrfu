// src/components/client/ServicePrompt.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaLightbulb } from 'react-icons/fa';

const ServicePrompt = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const examplePrompts = [
    "I need help with digital transformation in my banking company",
    "Looking for mobile app development for my e-commerce business",
    "Need IT consulting for cloud migration",
    "Searching for custom software development for logistics management"
  ];

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() === '') return;
    
    setIsLoading(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/services', { state: { searchPrompt: prompt } });
    }, 1000);
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              How can UDDAN help your business?
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tell us what you're looking for in your own words, and we'll match you with the most relevant services.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={handlePromptChange}
                placeholder="e.g., I need IT consulting for my retail business..."
                className="w-full p-4 pr-16 border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg text-gray-700 placeholder-gray-400 outline-none transition-all duration-300"
              />
              <button
                type="submit"
                disabled={prompt.trim() === '' || isLoading}
                className={`absolute right-2 top-2 p-2 rounded-lg ${
                  prompt.trim() === '' 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white transition-colors duration-300`}
              >
                {isLoading ? (
                  <div className="h-6 w-6 border-2 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <FaSearch className="h-6 w-6" />
                )}
              </button>
            </div>
          </form>
          
          <div>
            <div className="flex items-center mb-4">
              <FaLightbulb className="text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-700">
                Try one of these examples:
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((example, index) => (
                <div 
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 cursor-pointer transition-all duration-200"
                >
                  <p className="text-gray-600">{example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Why businesses choose UDDAN
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quickly implement solutions that drive immediate business value.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Team</h3>
              <p className="text-gray-600">Skilled professionals with deep industry knowledge and experience.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Assured</h3>
              <p className="text-gray-600">Rigorous quality control to ensure reliable and robust solutions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePrompt;