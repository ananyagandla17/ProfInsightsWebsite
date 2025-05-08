import React, { useState, useEffect } from 'react';
import ProfessorCard from './ProfessorCard';

// Replace sample professors with our faculty data
const facultyProfiles = [
  {
    id: 1,
    name: "Dr. Vivek Kumar Mishra",
    department: "Finance",
    course: "Computational Finance with Applications",
    code: "CS3235",
    credits: 3,
    avgRating: 0,
    numRatings: 0,
    tags: ["Finance", "Computational"],
    initials: "VKM"
  },
  {
    id: 2,
    name: "Veeraiah Talagondapati",
    department: "Computer Science",
    course: "Computer Networks",
    code: "CS2202",
    credits: 4,
    avgRating: 0,
    numRatings: 0,
    tags: ["Networks", "Technical"],
    initials: "VT"
  },
  {
    id: 3,
    name: "Mr. Rahul Roy",
    department: "AI/ML",
    course: "Deep Neural Networks",
    code: "CS3223",
    credits: 4,
    avgRating: 0,
    numRatings: 0,
    tags: ["AI", "Neural Networks"],
    initials: "RR"
  },
  {
    id: 4,
    name: "Dr. Raghu Kishore Neelisetty",
    department: "Cybersecurity",
    course: "Information Security Risk Assessment and Assurance",
    code: "CS4179",
    credits: 3,
    avgRating: 0,
    numRatings: 0,
    tags: ["Security", "Risk Assessment"],
    initials: "RKN"
  },
  {
    id: 5,
    name: "Prof. Salome Benhur",
    department: "Humanities",
    course: "Introduction to Professional Development",
    code: "HS3201",
    credits: 2,
    avgRating: 0,
    numRatings: 0,
    tags: ["Professional Development"],
    initials: "SB"
  },
  {
    id: 6,
    name: "Dr. Yajulu Medury",
    department: "Humanities",
    course: "Organizational Behaviour",
    code: "HS3226",
    credits: 2,
    avgRating: 0,
    numRatings: 0,
    tags: ["Organizational", "Behaviour"],
    initials: "YM"
  },
  {
    id: 7,
    name: "Mrs. Sowmini Devi Veeramachaneni",
    department: "Computer Science",
    course: "Programming Workshop",
    code: "CS3204",
    credits: 1,
    avgRating: 0,
    numRatings: 0,
    tags: ["Programming", "Practical"],
    initials: "SDV"
  },
  {
    id: 8,
    name: "Dr. Vijay Rao Duddu",
    department: "Computer Science",
    course: "Software Engineering",
    code: "CS3201",
    credits: 3,
    avgRating: 0,
    numRatings: 0,
    tags: ["Software", "Engineering"],
    initials: "VRD"
  }
];

const StudentDashboard = () => {
  const [professors, setProfessors] = useState(facultyProfiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  // Get unique departments for filter dropdown
  const departments = [...new Set(professors.map(prof => prof.department))];
  
  // Filter professors based on search and department
  const filteredProfessors = professors.filter(professor => {
    const matchesSearch = searchTerm === '' || 
      professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.code.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = departmentFilter === '' || 
      professor.department === departmentFilter;
      
    return matchesSearch && matchesDepartment;
  });
  
  // Load saved reviews from localStorage to update ratings
  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem('professorReviews') || '[]');
    
    if (savedReviews.length > 0) {
      // Create a map of professor ratings
      const profRatings = {};
      
      savedReviews.forEach(review => {
        const profId = review.professorId;
        if (!profRatings[profId]) {
          profRatings[profId] = { total: 0, count: 0 };
        }
        profRatings[profId].total += review.averageRating;
        profRatings[profId].count += 1;
      });
      
      // Update professors with ratings
      const updatedProfessors = professors.map(prof => {
        if (profRatings[prof.id]) {
          const ratings = profRatings[prof.id];
          return {
            ...prof,
            avgRating: (ratings.total / ratings.count).toFixed(1),
            numRatings: ratings.count
          };
        }
        return prof;
      });
      
      setProfessors(updatedProfessors);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-2xl font-bold text-blue-700">ProfInsights Dashboard</div>
        <button
          onClick={() => (window.location.href = '/')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Add search and filters */}
      <div className="bg-white shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Professors
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name, course or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Department
            </label>
            <select
              id="department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProfessors.length > 0 ? (
          filteredProfessors.map((prof) => (
            <ProfessorCard key={prof.id} professor={prof} />
          ))
        ) : (
          <div className="col-span-2 text-center p-6 bg-white rounded-lg shadow">
            <p className="text-gray-500">No professors found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;