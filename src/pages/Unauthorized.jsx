import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-black text-gray-800 dark:text-white">
      <h1 className="text-5xl font-extrabold text-red-600 mb-4">
        🚫 403 - Unauthorized Access
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mb-6">
        You don’t have permission to view this page. If you believe this is a mistake,
        please contact your system administrator.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-base font-medium transition"
      >
        🔙 Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
