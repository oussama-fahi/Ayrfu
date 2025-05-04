import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const ApplicantJourney = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    technologies: [],
    languages: [],
    location: '',
    experienceLevel: '',
    workModel: '',
  });
  
  const technologies = [
    'Java', 'Python', 'JavaScript', 'React', 'Angular', 'Vue.js', 
    'Spring Boot', 'Node.js', 'PHP', '.NET', 'C#', 'C++',
    'AWS', 'Azure', 'DevOps', 'Docker', 'Kubernetes',
    'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'Oracle',
    'Mobile Development', 'iOS', 'Android', 'React Native',
    'Data Science', 'Machine Learning', 'AI'
  ];

  const languages = [
    'English', 'French', 'Spanish', 'German', 'Portuguese', 
    'Italian', 'Dutch', 'Chinese', 'Japanese', 'Arabic'
  ];

  const locations = [
    'Remote', 'On-site', 'Hybrid', 'Europe', 'North America', 
    'South America', 'Asia', 'Africa', 'Australia'
  ];

  const experienceLevels = [
    'Entry-level', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Principal'
  ];

  const workModels = [
    'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'
  ];

  // Questions sequence
  const steps = [
    {
      title: 'Technologies',
      description: 'Which technologies are you experienced with?',
      options: technologies,
      multiSelect: true,
      field: 'technologies'
    },
    {
      title: 'Languages',
      description: 'Which languages do you speak?',
      options: languages,
      multiSelect: true,
      field: 'languages'
    },
    {
      title: 'Location',
      description: 'What is your preferred work location?',
      options: locations,
      multiSelect: false,
      field: 'location'
    },
    {
      title: 'Experience Level',
      description: 'What is your level of experience?',
      options: experienceLevels,
      multiSelect: false,
      field: 'experienceLevel'
    },
    {
      title: 'Work Model',
      description: 'What work model are you looking for?',
      options: workModels,
      multiSelect: false,
      field: 'workModel'
    }
  ];

  const handleOptionClick = (option) => {
    const field = steps[currentStep].field;
    
    if (steps[currentStep].multiSelect) {
      if (formData[field].includes(option)) {
        setFormData({
          ...formData,
          [field]: formData[field].filter(item => item !== option)
        });
      } else {
        setFormData({
          ...formData,
          [field]: [...formData[field], option]
        });
      }
    } else {
      setFormData({
        ...formData,
        [field]: option
      });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form data and navigate to positions list
      navigate('/positions', { state: { filterCriteria: formData } });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Go back to main page
      navigate('/');
    }
  };

  const isStepComplete = () => {
    const field = steps[currentStep].field;
    if (steps[currentStep].multiSelect) {
      return formData[field].length > 0;
    } else {
      return formData[field] !== '';
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Tell us about yourself</h1>
            <p className="text-gray-600">
              Answer a few questions to help us find the perfect positions for you.
            </p>
            
            {/* Progress bar */}
            <div className="mt-6 relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div 
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {steps[currentStep].title}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {steps[currentStep].description}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {steps[currentStep].options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 
                    ${steps[currentStep].multiSelect 
                      ? formData[steps[currentStep].field].includes(option)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-400'
                      : formData[steps[currentStep].field] === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                >
                  <p className="text-center font-medium">{option}</p>
                </div>
              ))}
            </div>
            
            {steps[currentStep].multiSelect && (
              <p className="mt-4 text-sm text-gray-500">
                You can select multiple options.
              </p>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className={`flex items-center px-6 py-3 ${isStepComplete() 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-300 cursor-not-allowed text-white'} 
                font-semibold rounded-lg transition-colors duration-300`}
            >
              {currentStep < steps.length - 1 ? 'Next' : 'See Matching Positions'}
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantJourney;