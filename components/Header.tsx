
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { LogoIcon } from './icons.tsx';

const Header: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
          <LogoIcon className="h-8 w-8 text-indigo-600" />
          <span>MentorLink</span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-600 hidden sm:block">Welcome, {user?.name}</span>
              <Link to="/sessions" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
                My Sessions
              </Link>
              <button
                onClick={handleLogout}
                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;