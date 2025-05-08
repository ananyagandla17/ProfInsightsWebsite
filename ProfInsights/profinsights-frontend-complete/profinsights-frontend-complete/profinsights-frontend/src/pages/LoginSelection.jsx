import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to ProfInsights</h1>
        <p className="mb-8 text-gray-600">Please select your login type:</p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/student-login')}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Student Login
          </button>
          <button
            onClick={() => navigate('/faculty-login')}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Faculty Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;
