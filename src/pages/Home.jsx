// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 dark:from-gray-800 dark:to-gray-900 p-6 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-white mb-4">
        🚀 Welcome to <span className="text-purple-700 dark:text-purple-300">WorkNext</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
        The modern solution for managing your projects, teams, and tasks across the enterprise.
      </p>

      <Link
        to="/login"
        className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-xl shadow-md transition-all"
      >
        Get Started
      </Link>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-10">
        © {new Date().getFullYear()} WorkNext — Empowering your workflow.
      </p>
    </div>
  );
};

export default Home;
