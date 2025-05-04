// src/components/candidate/PositionList.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaCode, FaLanguage, FaFilter, FaTimes } from 'react-icons/fa';
import axios from '../../api/axios';

const PositionList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filterCriteria = location.state?.filterCriteria || {};
  
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    technologies: filterCriteria.technologies || [],
    languages: filterCriteria.languages || [],
    locations: filterCriteria.location ? [filterCriteria.location] : [],
    experienceLevels: filterCriteria.experienceLevel ? [filterCriteria.experienceLevel] : [],
    workModels: filterCriteria.workModel ? [filterCriteria.workModel] : [],
  });

  // Fetch positions from API
  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      try {
        // Building query parameters from filter criteria
        const params = new URLSearchParams();
        
        if (filterCriteria.technologies && filterCriteria.technologies.length > 0) {
          params.append('technology', filterCriteria.technologies[0]); // API only supports one technology
        }
        
        if (filterCriteria.location) {
          params.append('location', filterCriteria.location);
        }
        
        if (filterCriteria.experienceLevel) {
          params.append('experienceLevel', filterCriteria.experienceLevel);
        }
        
        if (filterCriteria.workModel) {
          params.append('workModel', filterCriteria.workModel);
        }
        
        if (filterCriteria.languages && filterCriteria.languages.length > 0) {
          filterCriteria.languages.forEach(lang => {
            params.append('languages', lang);
          });
        }
        
        const response = await axios.get(`/positions/search?${params.toString()}`);
        setPositions(response.data);
        setFilteredPositions(response.data);
      } catch (err) {
        setError('Failed to fetch positions. Please try again later.');
        console.error('Error fetching positions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [filterCriteria]);

  // Apply filters when filters state changes
  useEffect(() => {
    if (positions.length > 0) {
      applyFilters();
    }
  }, [filters]);

  const applyFilters = () => {
    let filtered = [...positions];
    
    // Filter by technologies
    if (filters.technologies.length > 0) {
      filtered = filtered.filter(position => 
        filters.technologies.includes(position.technology)
      );
    }
    
    // Filter by languages
    if (filters.languages.length > 0) {
      filtered = filtered.filter(position => 
        filters.languages.some(lang => position.languages.includes(lang))
      );
    }
    
    // Filter by locations
    if (filters.locations.length > 0) {
      filtered = filtered.filter(position => 
        filters.locations.includes(position.location)
      );
    }
    
    // Filter by experience levels
    if (filters.experienceLevels.length > 0) {
      filtered = filtered.filter(position => 
        filters.experienceLevels.includes(position.experienceLevel)
      );
    }
    
    // Filter by work models
    if (filters.workModels.length > 0) {
      filtered = filtered.filter(position => 
        filters.workModels.includes(position.workModel)
      );
    }
    
    setFilteredPositions(filtered);
  };

  const toggleFilterItem = (filterType, item) => {
    setFilters(prevFilters => {
      const filterArray = [...prevFilters[filterType]];
      const index = filterArray.indexOf(item);
      
      if (index >= 0) {
        filterArray.splice(index, 1);
      } else {
        filterArray.push(item);
      }
      
      return {
        ...prevFilters,
        [filterType]: filterArray
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      technologies: [],
      languages: [],
      locations: [],
      experienceLevels: [],
      workModels: [],
    });
  };

  const handlePositionClick = (positionId) => {
    navigate(`/positions/${positionId}`);
  };

  // Extract unique filter options from positions
  const getFilterOptions = () => {
    const options = {
      technologies: [...new Set(positions.map(p => p.technology))],
      languages: [...new Set(positions.flatMap(p => p.languages))],
      locations: [...new Set(positions.map(p => p.location))],
      experienceLevels: [...new Set(positions.map(p => p.experienceLevel))],
      workModels: [...new Set(positions.map(p => p.workModel))],
    };
    return options;
  };

  const filterOptions = positions.length > 0 ? getFilterOptions() : {
    technologies: [],
    languages: [],
    locations: [],
    experienceLevels: [],
    workModels: [],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Finding matching positions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops, something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/applicants')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Matching Positions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {filteredPositions.length > 0 
              ? `We found ${filteredPositions.length} position${filteredPositions.length > 1 ? 's' : ''} matching your criteria.`
              : 'No positions match your criteria. Try adjusting your filters.'}
          </p>
        </div>
        
        <div className="lg:flex gap-6">
          {/* Mobile filter button */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              {showFilters ? <FaTimes className="mr-2" /> : <FaFilter className="mr-2" />}
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {/* Filters sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
              
              {/* Technologies filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Technologies</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filterOptions.technologies.map((tech, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`tech-${index}`}
                        checked={filters.technologies.includes(tech)}
                        onChange={() => toggleFilterItem('technologies', tech)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`tech-${index}`} className="ml-2 text-gray-600">
                        {tech}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Languages filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Languages</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filterOptions.languages.map((lang, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`lang-${index}`}
                        checked={filters.languages.includes(lang)}
                        onChange={() => toggleFilterItem('languages', lang)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`lang-${index}`} className="ml-2 text-gray-600">
                        {lang}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Locations filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Locations</h3>
                <div className="space-y-2">
                  {filterOptions.locations.map((loc, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`loc-${index}`}
                        checked={filters.locations.includes(loc)}
                        onChange={() => toggleFilterItem('locations', loc)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`loc-${index}`} className="ml-2 text-gray-600">
                        {loc}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Experience Levels filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Experience Levels</h3>
                <div className="space-y-2">
                  {filterOptions.experienceLevels.map((exp, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`exp-${index}`}
                        checked={filters.experienceLevels.includes(exp)}
                        onChange={() => toggleFilterItem('experienceLevels', exp)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`exp-${index}`} className="ml-2 text-gray-600">
                        {exp}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Work Models filter */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Work Models</h3>
                <div className="space-y-2">
                  {filterOptions.workModels.map((model, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`model-${index}`}
                        checked={filters.workModels.includes(model)}
                        onChange={() => toggleFilterItem('workModels', model)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`model-${index}`} className="ml-2 text-gray-600">
                        {model}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Position list */}
          <div className="lg:w-3/4">
            {filteredPositions.length > 0 ? (
              <div className="grid gap-6">
                {filteredPositions.map(position => (
                  <div 
                    key={position.id}
                    onClick={() => handlePositionClick(position.id)}
                    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {position.title}
                      </h2>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <FaCode className="mr-1" /> {position.technology}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <FaMapMarkerAlt className="mr-1" /> {position.location}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          <FaBriefcase className="mr-1" /> {position.workModel}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">{position.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-sm font-medium text-gray-700">Experience:</span>
                        <span className="text-sm text-gray-600">{position.experienceLevel}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-6">
                        <span className="text-sm font-medium text-gray-700 mr-2">
                          <FaLanguage className="inline mr-1" /> Languages:
                        </span>
                        {position.languages.map((lang, idx) => (
                          <span key={idx} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-right">
                        <span className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-gray-400 text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching positions found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any positions matching your current filters. 
                  Try adjusting your criteria or check back later for new opportunities.
                </p>
                <button 
                  onClick={() => navigate('/applicants')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionList;