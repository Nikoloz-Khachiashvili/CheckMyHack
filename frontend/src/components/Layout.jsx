import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

const Layout = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Detect token change on any route change
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md transition-all">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            🔍 CheckMyHack
          </Link>
          <nav className="flex items-center space-x-4 sm:space-x-6">
            <Link
              to="/"
              className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              Home
            </Link>
            <a
              href="https://haveibeenpwned.com/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              About
            </a>
            {isLoggedIn && (
              <Link
                to="/history"
                className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-300 transition"
              >
                History
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-300 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-300 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition font-semibold"
              >
                Logout
              </button>
            )}

            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="ml-2 sm:ml-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-2xl p-2 rounded-full shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-6 transition-all">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 mt-10 py-4 text-center text-sm text-gray-500 dark:text-gray-400 transition-all">
        &copy; {new Date().getFullYear()} CheckMyHack. Built by Xarcho.
      </footer>
    </div>
  );
};

export default Layout;
