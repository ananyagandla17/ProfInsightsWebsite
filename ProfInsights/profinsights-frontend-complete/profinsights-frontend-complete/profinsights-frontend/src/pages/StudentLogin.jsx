import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Student email format validation
    const emailPattern = /^se22u(cse|ari|nan|mec|mee|ece|ecm|cam|cab|bit)([0-9]{3})@mahindrauniversity\.edu\.in$/i;
    if (!emailPattern.test(email)) {
      setError('Please use your Mahindra University email in the format: se22uXXXYYY@mahindrauniversity.edu.in, where XXX is your branch code and YYY is your roll number');
      setLoading(false);
      return;
    }
    
    // Extract roll number from email for additional validation
    const match = email.match(/^se22u(?:cse|ari|nan|mec|mee|ece|ecm|cam|cab|bit)(\d{3})@mahindrauniversity\.edu\.in$/i);
    const rollNumber = match ? parseInt(match[1]) : 0;
    
    if (rollNumber < 1 || rollNumber > 325) {
      setError('Invalid roll number in email. Roll number must be between 001 and 325.');
      setLoading(false);
      return;
    }
    
    // Password validation
    if (password !== 'student123') {
      setError('Authentication failed. Please check your credentials.');
      setLoading(false);
      return;
    }
    
    // Extract student information from email
    const emailLower = email.toLowerCase();
    const branchMatch = emailLower.match(/se22u(cse|ari|nan|mec|mee|ece|ecm|cam|cab|bit)/);
    const branch = branchMatch ? branchMatch[1].toUpperCase() : '';
    
    let department = '';
    switch(branch) {
      case 'CSE': department = 'Computer Science and Engineering'; break;
      case 'ARI': department = 'Artificial Intelligence'; break;
      case 'NAN': department = 'Nanotechnology'; break;
      case 'MEC': department = 'Mechanical Engineering'; break;
      case 'MEE': department = 'Mechatronics Engineering'; break;
      case 'ECE': department = 'Electronics and Communication Engineering'; break;
      case 'ECM': department = 'Electronics and Computer Engineering'; break;
      case 'CAM': department = 'Computer-Aided Manufacturing'; break;
      case 'CAB': department = 'Computer-Aided Design'; break;
      case 'BIT': department = 'Biotechnology'; break;
      default: department = 'Engineering';
    }
    
    // Create student data
    const studentData = {
      _id: `student_${Date.now()}`,
      name: `Student ${branch}${rollNumber}`,
      email: emailLower,
      rollNumber: `${branch}${rollNumber.toString().padStart(3, '0')}`,
      department: department,
      year: 2,
      role: 'student'
    };
    
    // Store data in localStorage
    localStorage.setItem('token', 'fake-jwt-token-for-student');
    localStorage.setItem('user', JSON.stringify(studentData));
    
    // Navigate to student dashboard
    navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-700">
      <div className="bg-white/20 p-8 rounded-2xl shadow-lg backdrop-blur-lg border border-white/20 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Student Login</h2>
        
        {error && (
          <div className="bg-red-500/30 border border-red-500 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-blue-500/30 border border-blue-500 text-white px-4 py-3 rounded mb-6">
          <p className="font-medium">Student Access Only</p>
          <p className="text-sm mt-1">
            Use your <span className="font-semibold">se22uXXXYYY@mahindrauniversity.edu.in</span> email address to log in.
          </p>
          <p className="text-sm mt-1">
            <span className="font-semibold">Example:</span> For CSE student with roll number 42, use <span className="font-semibold">se22ucse042@mahindrauniversity.edu.in</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="bg-white/10 text-white border border-white/30 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="se22uXXXYYY@mahindrauniversity.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-white/70 mt-1">
              Example: se22ucse042@mahindrauniversity.edu.in
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-white/10 text-white border border-white/30 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-white/70 mt-1">
              For demo purposes, use: <span className="font-medium">student123</span>
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <a 
              href="/" 
              className="inline-block align-baseline font-bold text-sm text-blue-300 hover:text-blue-200"
            >
              Back to Home
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;