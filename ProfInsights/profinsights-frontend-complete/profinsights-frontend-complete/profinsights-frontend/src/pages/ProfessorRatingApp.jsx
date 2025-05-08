import { useState, useEffect } from 'react';
import ProfessorRatingForm from './ProfessorRatingForm';
import professorService from '../services/professorService';
import reviewService from '../services/reviewService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const ProfessorRatingApp = () => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Fetch professors and recent reviews when component mounts
  useEffect(() => {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login-selection'); // Redirect to login if not logged in
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to fetch professors from backend
        try {
          const professorsData = await professorService.getAllProfessors();
          setProfessors(professorsData.data);
        } catch (profError) {
          console.log("Failed to fetch professors from API, using sample data:", profError);
          // TEMPORARY: Use sample professors data if API fails
          setProfessors([
            { _id: 1, name: 'Dr. Sarah Johnson', department: 'Computer Science' },
            { _id: 2, name: 'Dr. Michael Chen', department: 'Mathematics' },
            { _id: 3, name: 'Dr. Emily Rodriguez', department: 'Physics' }
          ]);
        }

        // Try to fetch reviews from backend
        try {
          const reviewsData = await reviewService.getProfessorReviews();
          setRecentReviews(reviewsData.data);
        } catch (reviewError) {
          console.log("Failed to fetch reviews from API, using localStorage:", reviewError);
          // TEMPORARY: Get reviews from localStorage
          const localReviews = JSON.parse(localStorage.getItem('professorReviews') || '[]');
          setRecentReviews(localReviews);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load professors and reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const openRatingModal = (professor) => {
    setSelectedProfessor(professor);
    setIsRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    setSelectedProfessor(null);
  };

  const handleReviewSubmitted = async () => {
    try {
      // Try to refresh reviews from backend
      try {
        const reviewsData = await reviewService.getProfessorReviews();
        setRecentReviews(reviewsData.data);
      } catch (apiError) {
        console.log("Failed to refresh reviews from API, using localStorage:", apiError);
        // TEMPORARY: Get reviews from localStorage
        const localReviews = JSON.parse(localStorage.getItem('professorReviews') || '[]');
        setRecentReviews(localReviews);
      }
    } catch (err) {
      console.error('Error refreshing reviews:', err);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading professors...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ProfInsights - Professor Ratings</h1>
      
      {/* Professor List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {professors.map(professor => (
          <div 
            key={professor._id} 
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-medium">{professor.name}</h3>
            <p className="text-gray-600 mb-4">{professor.department}</p>
            <button
              onClick={() => openRatingModal(professor)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Rate this Professor
            </button>
          </div>
        ))}
      </div>
      
      {/* Recent Ratings */}
      {recentReviews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Ratings</h2>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">
                    {professors.find(p => p._id === review.professorId)?.name || 'Unknown Professor'}
                  </h3>
                  <p className="text-gray-600">{review.courseName} - {review.semester}</p>
                </div>
                <p className="mt-2">{review.review}</p>
                <div className="mt-2 text-sm text-gray-600">
                  Average Rating: {review.averageRating?.toFixed(1) || 'N/A'} / 5
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Rating Modal */}
      {isRatingModalOpen && selectedProfessor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="max-h-full w-full max-w-4xl">
            <ProfessorRatingForm
              professorId={selectedProfessor._id}
              professorName={selectedProfessor.name}
              onClose={closeRatingModal}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorRatingApp;