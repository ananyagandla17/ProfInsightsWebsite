import { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import professorService from '../services/professorService';

const ProfessorRatingForm = ({ professorId, professorName, onClose, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    professorName: professorName || '',
    professorId: professorId,
    courseName: '',
    courseCode: '',
    courseCredits: 0,
    semester: '',
    clarity: 0,
    engagement: 0,
    knowledge: 0,
    fairness: 0,
    approachability: 0,
    organization: 0,
    discussion: 0,
    workload: 0,
    respect: 0,
    realWorldConnections: 0,
    review: '',
    reportMisconduct: false,
    allowAnalytics: false
  });

  const [professorCourses, setProfessorCourses] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch professor courses on component mount
  useEffect(() => {
    const fetchProfessorData = async () => {
      if (!professorId) {
        // Default courses if no professor ID is available
        setProfessorCourses(defaultCourses);
        setLoading(false);
        return;
      }

      try {
        // In a real app, you would fetch from API
        // For now, use the hardcoded data or fetch from localStorage
        
        // Simulating an API call with setTimeout
        setTimeout(() => {
          // For now, we'll use defaults, but in a real app you'd get this from the API
          const professor = {
            _id: professorId,
            name: professorName,
            course: "Software Engineering",
            code: "CS3201",
            credits: 3
          };
          
          // If you have data in localStorage:
          // const professors = JSON.parse(localStorage.getItem('professors') || '[]');
          // const professor = professors.find(p => p._id === professorId);
          
          if (professor) {
            // Set a single course from the professor data
            setProfessorCourses([{
              name: professor.course,
              code: professor.code,
              credits: professor.credits
            }]);
            
            // Pre-fill the form with this course
            setFormData(prev => ({
              ...prev,
              courseName: professor.course,
              courseCode: professor.code,
              courseCredits: professor.credits
            }));
          } else {
            setProfessorCourses(defaultCourses);
          }
          
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error("Error fetching professor data:", error);
        setProfessorCourses(defaultCourses);
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, [professorId, professorName]);

  // Default courses as a fallback
  const defaultCourses = [
    { name: "Introduction to Computer Science", code: "CS1101", credits: 3 },
    { name: "Data Structures and Algorithms", code: "CS2201", credits: 4 },
    { name: "Database Systems", code: "CS3111", credits: 3 },
    { name: "Software Engineering", code: "CS3201", credits: 3 },
    { name: "Artificial Intelligence", code: "CS4151", credits: 3 },
    { name: "Web Development", code: "CS3161", credits: 3 },
    { name: "Computer Networks", code: "CS2202", credits: 4 }
  ];

  const semesters = [
    "Spring 2025", "Fall 2024", "Spring 2024", "Fall 2023"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'courseName') {
      // When course is selected, also set the code and credits
      const selectedCourse = professorCourses.find(course => course.name === value);
      if (selectedCourse) {
        setFormData({
          ...formData,
          courseName: value,
          courseCode: selectedCourse.code,
          courseCredits: selectedCourse.credits
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredRatings = [
      "clarity", "engagement", "knowledge", "fairness", "approachability",
      "organization", "discussion", "workload", "respect", "realWorldConnections"
    ];

    if (!formData.courseName) errors.courseName = "Course is required";
    if (!formData.semester) errors.semester = "Semester is required";

    requiredRatings.forEach((field) => {
      if (!formData[field]) errors[field] = "Rating required";
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    // Calculate average rating
    const ratingFields = [
      "clarity", "engagement", "knowledge", "fairness", "approachability",
      "organization", "discussion", "workload", "respect", "realWorldConnections"
    ];
    
    const ratings = ratingFields.reduce((acc, field) => {
      acc[field] = parseInt(formData[field]);
      return acc;
    }, {});
    
    const sum = Object.values(ratings).reduce((a, b) => a + b, 0);
    const averageRating = sum / ratingFields.length;
    
    // Prepare review data
    const reviewData = {
      _id: 'review_' + Date.now(),
      professorId: formData.professorId,
      professorName: formData.professorName,
      courseName: formData.courseName,
      courseCode: formData.courseCode,
      courseCredits: formData.courseCredits,
      semester: formData.semester,
      ratings: ratings,
      averageRating: averageRating,
      review: formData.review,
      reportMisconduct: formData.reportMisconduct,
      allowAnalytics: formData.allowAnalytics,
      createdAt: new Date().toISOString()
    };
    
    // Get existing reviews or initialize empty array
    const existingReviews = JSON.parse(localStorage.getItem('professorReviews') || '[]');
    
    // Add new review
    existingReviews.push(reviewData);
    
    // Save to localStorage
    localStorage.setItem('professorReviews', JSON.stringify(existingReviews));
    
    // Call callback to refresh reviews
    if (onReviewSubmitted) {
      onReviewSubmitted();
    }
    
    // Show success and close
    window.alert("Review submitted successfully!");
    onClose();
  };

  const RatingRow = ({ label, name }) => (
    <div className="mb-6">
      <label className="block font-medium text-gray-800 mb-2">{label}</label>
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <label key={num} className="flex flex-col items-center text-sm">
            <input
              type="radio"
              name={name}
              value={num}
              checked={parseInt(formData[name]) === num}
              onChange={handleChange}
              className="h-4 w-4"
            />
            {num}
          </label>
        ))}
      </div>
      {formErrors[name] && <p className="text-red-500 text-sm">{formErrors[name]}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-md flex justify-center items-center h-60">
        <p className="text-gray-500">Loading course information...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md max-h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Rate {professorName}</h2>
        <button type="button" onClick={onClose} className="text-red-500 text-xl">✕</button>
      </div>
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Course</label>
          <select
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${formErrors.courseName ? "border-red-500" : ""}`}
          >
            <option value="">Select a course</option>
            {professorCourses.map((course) => (
              <option key={course.code} value={course.name}>
                {course.name} ({course.code}, {course.credits} credits)
              </option>
            ))}
          </select>
          {formErrors.courseName && <p className="text-red-500 text-sm">{formErrors.courseName}</p>}
        </div>
        
        {formData.courseName && (
          <div className="mb-6 p-3 bg-blue-50 rounded-md">
            <div className="font-medium text-blue-800">Course Details</div>
            <div className="flex space-x-4 mt-1">
              <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {formData.courseCode}
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                {formData.courseCredits} credits
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-1 font-medium">Semester</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${formErrors.semester ? "border-red-500" : ""}`}
          >
            <option value="">Select a semester</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
          {formErrors.semester && <p className="text-red-500 text-sm">{formErrors.semester}</p>}
        </div>

        {/* Rating questions */}
        <RatingRow label="Clarity of explanations" name="clarity" />
        <RatingRow label="Engagement in lectures" name="engagement" />
        <RatingRow label="Knowledge and preparation" name="knowledge" />
        <RatingRow label="Fairness in grading" name="fairness" />
        <RatingRow label="Approachability" name="approachability" />
        <RatingRow label="Course organization" name="organization" />
        <RatingRow label="Classroom discussion" name="discussion" />
        <RatingRow label="Workload management" name="workload" />
        <RatingRow label="Respectfulness" name="respect" />
        <RatingRow label="Real-world connection" name="realWorldConnections" />

        <div className="mb-6">
          <label className="block mb-1 font-medium">Written Review</label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            maxLength={500}
            rows={4}
          />
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <label>
            <input
              type="checkbox"
              name="reportMisconduct"
              checked={formData.reportMisconduct}
              onChange={handleChange}
              className="mr-2"
            />
            Report misconduct
          </label>
          <label>
            <input
              type="checkbox"
              name="allowAnalytics"
              checked={formData.allowAnalytics}
              onChange={handleChange}
              className="mr-2"
            />
            Allow use for analytics
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfessorRatingForm;