import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const FacultyLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sample faculty data for all professors
  const facultyData = [
    {
      _id: 'prof1',
      name: 'Dr. Vivek Kumar Mishra',
      email: 'vivek@mahindrauniversity.edu.in',
      department: 'Finance',
      course: 'Computational Finance with Applications',
      code: 'CS3235',
      credits: 3
    },
    {
      _id: 'prof2',
      name: 'Veeraiah Talagondapati',
      email: 'veeraiah@mahindrauniversity.edu.in',
      department: 'Computer Science',
      course: 'Computer Networks',
      code: 'CS2202',
      credits: 4
    },
    {
      _id: 'prof3',
      name: 'Mr. Rahul Roy',
      email: 'rahul@mahindrauniversity.edu.in',
      department: 'AI/ML',
      course: 'Deep Neural Networks',
      code: 'CS3223',
      credits: 4
    },
    {
      _id: 'prof4',
      name: 'Dr. Raghu Kishore Neelisetty',
      email: 'raghu@mahindrauniversity.edu.in',
      department: 'Cybersecurity',
      course: 'Information Security Risk Assessment and Assurance',
      code: 'CS4179',
      credits: 3
    },
    {
      _id: 'prof5',
      name: 'Prof. Salome Benhur',
      email: 'salome@mahindrauniversity.edu.in',
      department: 'Humanities',
      course: 'Introduction to Professional Development',
      code: 'HS3201',
      credits: 2
    },
    {
      _id: 'prof6',
      name: 'Dr. Yajulu Medury',
      email: 'yajulu@mahindrauniversity.edu.in',
      department: 'Humanities',
      course: 'Organizational Behaviour',
      code: 'HS3226',
      credits: 2
    },
    {
      _id: 'prof7',
      name: 'Mrs. Sowmini Devi Veeramachaneni',
      email: 'sowmini@mahindrauniversity.edu.in',
      department: 'Computer Science',
      course: 'Programming Workshop',
      code: 'CS3204',
      credits: 1
    },
    {
      _id: 'prof8',
      name: 'Dr. Vijay Rao Duddu',
      email: 'vijay@mahindrauniversity.edu.in',
      department: 'Computer Science',
      course: 'Software Engineering',
      code: 'CS3201',
      credits: 3
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Check email format
    const emailPattern = /^[a-zA-Z]+@mahindrauniversity\.edu\.in$/;
    if (!emailPattern.test(email)) {
      setError('Please use your Mahindra University faculty email (firstname@mahindrauniversity.edu.in)');
      setLoading(false);
      return;
    }
    
    // Check password
    if (password !== 'faculty123') {
      setError('Authentication failed. Please check your credentials.');
      setLoading(false);
      return;
    }
    
    // Find the professor by email
    const professor = facultyData.find(prof => prof.email.toLowerCase() === email.toLowerCase());
    
    if (professor) {
      console.log('Using hardcoded successful login for', professor.name);
      
      // Add role to the professor object
      const userData = {
        ...professor,
        role: 'faculty'
      };
      
      // Store in localStorage manually (same as authService would do)
      localStorage.setItem('token', 'fake-jwt-token-for-faculty');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Navigate to dashboard
      navigate('/faculty-dashboard');
      return;
    }
    
    setError('Authentication failed. Faculty profile not found.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-sky-800 to-indigo-900">
      <div className="bg-white/20 p-8 rounded-2xl shadow-lg backdrop-blur-lg border border-white/20 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Faculty Login</h2>
        
        {error && (
          <div className="bg-red-500/30 border border-red-500 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-blue-500/30 border border-blue-500 text-white px-4 py-3 rounded mb-6">
          <p className="font-medium">Faculty Access Only</p>
          <p className="text-sm mt-1">
            Use your <span className="font-semibold">firstname@mahindrauniversity.edu.in</span> email address to log in.
          </p>
          <p className="text-sm mt-1">
            <span className="font-semibold">Example:</span> For Dr. Vivek Kumar Mishra, use <span className="font-semibold">vivek@mahindrauniversity.edu.in</span>
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
              placeholder="firstname@mahindrauniversity.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-white/70 mt-1">
              Example: vivek@mahindrauniversity.edu.in
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
              For demo purposes, use: <span className="font-medium">faculty123</span>
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

export default FacultyLogin;