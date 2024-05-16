import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import Watchlist from './Watchlist';
import Dashboard from './Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [currentPage, setCurrentPage] = useState('login'); // Can be 'login', 'signup', 'watchlist', or 'dashboard'
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for user data
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    if (storedUserId && storedUsername) {
      setUserId(storedUserId);
      setUsername(storedUsername);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (userId: string, username: string) => {
    // Save user data to localStorage
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    setUserId(userId);
    setIsAuthenticated(true);
    setUsername(username);
    setCurrentPage('dashboard');
  };

  const handleSignup = () => {
    setCurrentPage('login');
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    setUserId(null);
    setCurrentPage('login');
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <nav className="navbar">
            <button className={`nav-button ${currentPage === 'watchlist' ? 'active' : ''}`} onClick={() => setCurrentPage('watchlist')}>Watchlist</button>
            <button className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
            <button className="nav-button logout-button" onClick={handleLogout}>Logout</button>
          </nav>
          {currentPage === 'watchlist' && <Watchlist userId={userId} />}
          {currentPage === 'dashboard' && <Dashboard userId={userId} />}
        </>
      ) : (
        <>
          {currentPage === 'login' && <Login onLogin={handleLogin} />}
          {currentPage === 'signup' && <Signup onSignup={handleSignup} />}
          <nav className="navbar">
            <button className={`nav-button ${currentPage === 'login' ? 'active' : ''}`} onClick={() => setCurrentPage('login')}>Login</button>
            <button className={`nav-button ${currentPage === 'signup' ? 'active' : ''}`} onClick={() => setCurrentPage('signup')}>Signup</button>
          </nav>
        </>
      )}
    </div>
  );
}

export default App;
