import React, { useState } from 'react';
import ProfessorRatingForm from './ProfessorRatingForm';

const ProfessorCard = ({ professor }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-12 h-12 flex items-center justify-center">
            {professor.initials}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{professor.name}</h3>
            <p className="text-sm text-gray-500">{professor.department}</p>
            <p className="text-xs text-gray-400">Tech Institute of Science</p>
            
            {/* New course information section */}
            <div className="mt-2">
              <p className="text-sm font-medium">
                {professor.course}
              </p>
              <div className="flex gap-2 mt-1">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                  {professor.code}
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {professor.credits} credits
                </span>
              </div>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {professor.tags && professor.tags.map((tag, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-yellow-500">{professor.avgRating || professor.averageRating} ★</p>
          <p className="text-sm text-gray-500">{professor.numRatings || professor.reviewCount} reviews</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-[90%] relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-4 text-xl text-gray-600 hover:text-red-500"
            >
              &times;
            </button>
            <ProfessorRatingForm professorName={professor.name} professorId={professor._id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorCard;