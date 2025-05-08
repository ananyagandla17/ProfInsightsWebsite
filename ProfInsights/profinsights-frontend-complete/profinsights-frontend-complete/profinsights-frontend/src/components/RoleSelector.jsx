import { useNavigate } from 'react-router-dom';

const RoleSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-400 flex flex-col items-center justify-center text-white px-4">
      {/* ProfInsights Branding */}
      <div className="absolute top-6 text-4xl font-extrabold tracking-wide">
        <span className="bg-white text-indigo-600 px-4 py-1 rounded shadow">ProfInsights</span>
      </div>

      {/* Role Selector Card */}
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-10 w-full max-w-md mt-20">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">Select Your Role</h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/student-login')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md"
          >
            I'm a Student
          </button>
          <button
            onClick={() => navigate('/faculty-login')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md"
          >
            I'm a Faculty
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
