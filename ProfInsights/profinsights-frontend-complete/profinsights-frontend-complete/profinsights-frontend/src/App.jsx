// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginSelection from './pages/LoginSelection';
import StudentLogin from './pages/StudentLogin';
import FacultyLogin from './pages/FacultyLogin';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import ProfessorRatingForm from './pages/ProfessorRatingForm';
import authService from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ element, requiredRole }) => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user && user.role !== requiredRole) {
    return <Navigate to={`/${user.role}-dashboard`} replace />;
  }
  
  return element;
};

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Check if token exists and is valid on app startup
  useEffect(() => {
    // Initialize app authentication state
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // You can add token validation logic here if needed
          // For example, make an API call to validate the token
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear any invalid tokens
        authService.logout();
      } finally {
        setIsInitialized(true);
      }
    };
    
    checkAuth();
  }, []);
  
  // Show loading while checking authentication
  if (!isInitialized) {
    return <div className="flex h-screen items-center justify-center">Initializing application...</div>;
  }
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginSelection />} />
        <Route path="/login-selection" element={<LoginSelection />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />
        
        {/* Protected Routes */}
        <Route 
          path="/student-dashboard" 
          element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />} 
        />
        <Route 
          path="/faculty-dashboard" 
          element={<ProtectedRoute element={<FacultyDashboard />} requiredRole="faculty" />} 
        />
        <Route 
          path="/rate/:id" 
          element={<ProtectedRoute element={<ProfessorRatingForm />} requiredRole="student" />} 
        />
        
        {/* ✅ Fallback route */}
        <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;