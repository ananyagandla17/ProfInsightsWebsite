import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import professorService from '../services/professorService';
import reviewService from '../services/reviewService';
import authService from '../services/authService';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [facultyName, setFacultyName] = useState('');
  const [facultyData, setFacultyData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [professorId, setProfessorId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const user = authService.getCurrentUser();
        if (!user || user.role !== 'faculty') {
          authService.logout();
          navigate('/faculty-login');
          return;
        }

        // Set faculty details from user data
        setFacultyName(user.name);
        setProfessorId(user._id);
        
        // Set faculty data
        setFacultyData({
          name: user.name,
          department: user.department,
          course: user.course,
          code: user.code,
          credits: user.credits,
          email: user.email,
          averageRating: 0,
          reviewCount: 0
        });
        
        // Fetch this professor's reviews using the authenticated API
        try {
          // API approach - use when backend is ready
          if (process.env.NODE_ENV === 'production') {
            const response = await reviewService.getMyReviews();
            const myReviews = response.data.data; // Adjust based on your actual API response structure
            setReviews(myReviews);
            
            // Update faculty data with review statistics
            if (myReviews && myReviews.length > 0) {
              const totalRating = myReviews.reduce((sum, review) => {
                return sum + (parseFloat(review.averageRating) || 0);
              }, 0);
              
              setFacultyData(prev => ({
                ...prev,
                averageRating: (totalRating / myReviews.length).toFixed(1),
                reviewCount: myReviews.length
              }));
            }
          } else {
            // Fallback to localStorage for development
            const allReviews = JSON.parse(localStorage.getItem('professorReviews') || '[]');
            
            // Filter reviews for this professor only (by ID or name)
            const myReviews = allReviews.filter(review => 
              // Match by ID if available
              (review.professorId && review.professorId === user._id) ||
              // Or match by name as fallback
              (review.professorName && 
                review.professorName.toLowerCase().includes(user.name.toLowerCase()))
            );
            
            setReviews(myReviews);
            
            // Update faculty data with review statistics
            if (myReviews.length > 0) {
              const totalRating = myReviews.reduce((sum, review) => {
                return sum + (parseFloat(review.averageRating) || 0);
              }, 0);
              
              setFacultyData(prev => ({
                ...prev,
                averageRating: (totalRating / myReviews.length).toFixed(1),
                reviewCount: myReviews.length
              }));
            }
          }
        } catch (err) {
          console.error('Error fetching reviews:', err);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/faculty-login');
  };

  // Calculate rating statistics
  const ratingCounts = [1, 2, 3, 4, 5].map((rating) => {
    // Count reviews with this rating
    const count = reviews.filter((review) => {
      // Handle cases where averageRating might be a string or number
      const avgRating = typeof review.averageRating === 'string' 
        ? parseFloat(review.averageRating) 
        : review.averageRating;
      
      // Round to nearest whole number for categorization
      return Math.round(avgRating) === rating;
    }).length;
    
    return {
      rating: `${rating} Stars`,
      count: count,
      value: rating
    };
  });

  // Create a dataset for ratings by criteria
  const criteriaRatings = [
    { name: 'Clarity', value: getAverageCriteriaRating('clarity') },
    { name: 'Knowledge', value: getAverageCriteriaRating('knowledge') },
    { name: 'Organization', value: getAverageCriteriaRating('organization') },
    { name: 'Helpfulness', value: getAverageCriteriaRating('helpfulness') },
    { name: 'Fairness', value: getAverageCriteriaRating('fairness') }
  ];

  // Helper function to calculate average rating for a specific criterion
  function getAverageCriteriaRating(criterionName) {
    const validRatings = reviews
      .filter(review => review.ratings && review.ratings[criterionName])
      .map(review => parseFloat(review.ratings[criterionName]));
    
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((a, b) => a + b, 0);
    return parseFloat((sum / validRatings.length).toFixed(1));
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-blue-900 via-sky-800 to-indigo-900 font-sans flex items-center justify-center">
        <div className="text-white text-2xl">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-blue-900 via-sky-800 to-indigo-900 font-sans flex items-center justify-center">
        <div className="bg-red-800/50 p-6 rounded-xl text-white text-xl">
          {error}
          <button 
            onClick={() => navigate('/faculty-login')} 
            className="block mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-900 via-sky-800 to-indigo-900 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10 pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="text-2xl font-semibold text-white drop-shadow-lg">{facultyName}</div>
        <button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition">
          Logout
        </button>
      </div>

      <h1 className="text-4xl font-extrabold mb-10 text-center text-white drop-shadow-lg relative z-10">
        📊 Faculty Review Dashboard
      </h1>

      {/* Faculty Profile Card */}
      <div className="bg-white/20 rounded-2xl shadow-lg p-6 backdrop-blur-lg border border-white/20 relative z-10 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-white">👨‍🏫 Your Course Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-lg border border-white/10">
            <h3 className="text-lg font-medium text-orange-200 mb-2">Course</h3>
            <div className="text-white">
              <p className="font-semibold text-lg">{facultyData.course}</p>
              <div className="flex gap-2 mt-1">
                <span className="bg-blue-500/30 text-blue-100 px-2 py-1 rounded text-xs font-semibold">
                  {facultyData.code}
                </span>
                <span className="bg-gray-500/30 text-gray-100 px-2 py-1 rounded text-xs">
                  {facultyData.credits} credits
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg border border-white/10">
            <h3 className="text-lg font-medium text-orange-200 mb-2">Department</h3>
            <p className="text-white font-semibold">{facultyData.department}</p>
            <p className="text-white/70 text-sm mt-2">{facultyData.email}</p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg border border-white/10">
            <h3 className="text-lg font-medium text-orange-200 mb-2">Rating Overview</h3>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-yellow-400">
                {facultyData.reviewCount > 0 ? facultyData.averageRating : "No ratings yet"}
              </div>
              {facultyData.reviewCount > 0 && (
                <div className="text-white">
                  <span className="text-yellow-400">★</span> 
                  <span className="text-sm">({facultyData.reviewCount} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white/20 rounded-2xl shadow-lg p-8 backdrop-blur-lg border border-white/20 text-center text-white text-xl">
          <p className="mb-2">No reviews yet!</p>
          <p className="text-white/70 text-lg">As students submit reviews for your course, they will appear here.</p>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
            <div className="bg-white/20 rounded-2xl shadow-lg p-4 backdrop-blur-lg border border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-center text-white">Rating Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingCounts}>
                  <XAxis dataKey="rating" stroke="#fff" />
                  <YAxis allowDecimals={false} stroke="#fff" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} />
                  <Bar dataKey="count" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/20 rounded-2xl shadow-lg p-4 backdrop-blur-lg border border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-center text-white">Performance by Criteria</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={criteriaRatings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis domain={[0, 5]} stroke="#fff" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} />
                  <Bar dataKey="value" fill="#22d3ee" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white/20 rounded-2xl shadow-lg p-6 backdrop-blur-lg border border-white/20 relative z-10">
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">📝 Student Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-white text-center">Comments</h3>
                {reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-orange-400/30 rounded-lg bg-orange-100/20 hover:bg-orange-200/30 transition backdrop-blur text-white shadow-md"
                  >
                    <div className="text-orange-200 font-medium mb-1">
                      {rev.courseName || facultyData.course} {rev.courseCode && `(${rev.courseCode})`}
                      {rev.semester && <span className="ml-2">- {rev.semester}</span>}
                      <span className="ml-2">({parseFloat(rev.averageRating).toFixed(1)}⭐)</span>
                    </div>
                    <p>{rev.review || 'No comment provided'}</p>
                    <div className="text-xs text-orange-100/70 mt-2">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-white text-center">Ratings</h3>
                {reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-orange-400/30 rounded-lg bg-orange-100/20 hover:bg-orange-200/30 transition backdrop-blur text-orange-300 shadow-md"
                  >
                    <div className="text-center text-lg">
                      {parseFloat(rev.averageRating).toFixed(1) || 'N/A'}/5 ⭐
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                      <div>Clarity: {rev.ratings?.clarity || 'N/A'}</div>
                      <div>Knowledge: {rev.ratings?.knowledge || 'N/A'}</div>
                      <div>Fairness: {rev.ratings?.fairness || 'N/A'}</div>
                      <div>Engagement: {rev.ratings?.engagement || 'N/A'}</div>
                      <div>Organization: {rev.ratings?.organization || 'N/A'}</div>
                      <div>Helpfulness: {rev.ratings?.helpfulness || 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyDashboard;