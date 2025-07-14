import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      aria-label="Toggle theme"
    >
      {isLight ? (
        <FaMoon className="text-gray-700 text-lg transition-transform hover:scale-110" />
      ) : (
        <FaSun className="text-yellow-400 text-lg transition-transform hover:scale-110" />
      )}
    </button>
  );
};

export default ThemeToggle;
