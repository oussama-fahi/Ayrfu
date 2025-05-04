// src/components/client/ServiceList.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import axios from '../../api/axios';

const ServiceList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchPrompt = location.state?.searchPrompt || '';
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        let response;
        if (searchPrompt) {
          // Search services by prompt
          response = await axios.get(`/services/prompt/search?prompt=${encodeURIComponent(searchPrompt)}`);
        } else {
          // Get all active services
          response = await axios.get('/services/active');
        }
        setServices(response.data);
      } catch (err) {
        setError('Failed to fetch services. Please try again later.');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [searchPrompt]);

  const handleServiceClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Finding services for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex justify-center items-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops, something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/clients')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            {searchPrompt 
              ? `Services matching: "${searchPrompt}"`
              : 'Our Services'
            }
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {services.length > 0 
              ? `We found ${services.length} service${services.length > 1 ? 's' : ''} that may help your business.`
              : 'We couldn\'t find any services matching your criteria. Please try a different search or contact us directly.'}
          </p>
          
          {searchPrompt && (
            <button 
              onClick={() => navigate('/clients')}
              className="mt-4 inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-300"
            >
              <FaArrowRight className="mr-2 rotate-180" /> Back to Search
            </button>
          )}
        </div>
        
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div 
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {service.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Key Benefits:</h3>
                    <ul className="space-y-2">
                      {service.benefits.split(',').map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{benefit.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {service.availability && (
                    <div className="flex items-center text-gray-600 mb-6">
                      <FaCalendarAlt className="mr-2 text-green-500" />
                      <span>Availability: {service.availability}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.keywords.map((keyword, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-right">
                    <span className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300">
                      Learn More
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-2xl mx-auto">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching services found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any services matching your search. Try using different keywords or contact us directly to discuss your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/clients')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300"
              >
                New Search
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-300"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Not sure which service is right for you?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our team of experts is ready to help you find the perfect solution for your business needs.
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceList;