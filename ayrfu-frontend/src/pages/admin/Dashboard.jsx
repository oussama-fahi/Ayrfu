// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaUsers, FaBuilding, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasRole, logout } = useAuth();
  
  const [stats, setStats] = useState({
    positions: 0,
    services: 0,
    candidateMessages: 0,
    clientMessages: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get token for requests
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Check if user has admin or super_user role
        const isAdminOrSuperUser = hasRole('ROLE_ADMIN') || hasRole('ROLE_SUPER_USER');
        if (!isAdminOrSuperUser) {
          navigate('/');
          return;
        }

        // Fetch positions count
        let positions = [];
        try {
          const positionsResponse = await axios.get('/api/positions', {
            headers: { Authorization: `Bearer ${token}` }
          });
          positions = positionsResponse.data || [];
        } catch (err) {
          console.error('Error fetching positions:', err);
          positions = [];
        }
        
        // Fetch services count
        let services = [];
        try {
          const servicesResponse = await axios.get('/api/services', {
            headers: { Authorization: `Bearer ${token}` }
          });
          services = servicesResponse.data || [];
        } catch (err) {
          console.error('Error fetching services:', err);
          services = [];
        }
        
        // Fetch candidate messages count
        let candidateMessages = [];
        try {
          const candidateMessagesResponse = await axios.get('/api/messages/type/CANDIDATE', {
            headers: { Authorization: `Bearer ${token}` }
          });
          candidateMessages = candidateMessagesResponse.data || [];
        } catch (err) {
          console.error('Error fetching candidate messages:', err);
          candidateMessages = [];
        }
        
        // Fetch client messages count
        let clientMessages = [];
        try {
          const clientMessagesResponse = await axios.get('/api/messages/type/CLIENT', {
            headers: { Authorization: `Bearer ${token}` }
          });
          clientMessages = clientMessagesResponse.data || [];
        } catch (err) {
          console.error('Error fetching client messages:', err);
          clientMessages = [];
        }
        
        setStats({
          positions: positions.length,
          services: services.length,
          candidateMessages: candidateMessages.length,
          clientMessages: clientMessages.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [navigate, hasRole]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const isAdmin = hasRole && hasRole('ROLE_ADMIN');
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
          <div className="text-red-600 text-center mb-4">
            <svg className="h-12 w-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Error</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-purple-800 text-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AYRFU Admin Dashboard</h1>
          <div className="flex items-center">
            <button 
              onClick={handleLogout}
              className="flex items-center px-3 py-2 bg-purple-700 hover:bg-purple-900 rounded-lg transition-colors duration-300"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                <FaBriefcase className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">Open Positions</h2>
                <p className="text-3xl font-bold text-gray-800">{stats.positions}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/positions')}
              className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              Manage Positions →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <FaUsers className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">Active Services</h2>
                <p className="text-3xl font-bold text-gray-800">{stats.services}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/services')}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Manage Services →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white">
                <FaEnvelope className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">Candidate Messages</h2>
                <p className="text-3xl font-bold text-gray-800">{stats.candidateMessages}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/messages/candidates')}
              className="mt-4 text-green-600 hover:text-green-800 text-sm font-medium"
            >
              View Messages →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-600 text-white">
                <FaBuilding className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">Client Messages</h2>
                <p className="text-3xl font-bold text-gray-800">{stats.clientMessages}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/messages/clients')}
              className="mt-4 text-yellow-600 hover:text-yellow-800 text-sm font-medium"
            >
              View Messages →
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/admin/positions/create')}
                className="flex items-center justify-center p-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors duration-300"
              >
                <FaBriefcase className="mr-2" />
                Create New Position
              </button>
              
              <button
                onClick={() => navigate('/admin/services/create')}
                className="flex items-center justify-center p-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-300"
              >
                <FaUsers className="mr-2" />
                Create New Service
              </button>
              
              <button
                onClick={() => navigate('/admin/messages/candidates')}
                className="flex items-center justify-center p-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-300"
              >
                <FaEnvelope className="mr-2" />
                Check Candidate Messages
              </button>
              
              <button
                onClick={() => navigate('/admin/messages/clients')}
                className="flex items-center justify-center p-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors duration-300"
              >
                <FaBuilding className="mr-2" />
                Check Client Messages
              </button>
            </div>
          </div>
          
          {/* System Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">System Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-600">System Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operational
                </span>
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-600">Database Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-600">Last System Update</span>
                <span className="text-gray-800 text-sm">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Backend Version</span>
                <span className="text-gray-800 text-sm">1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;