import React, { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { TradeBlotter } from './pages/TradeBlotter';

export const App: React.FC = () => {
  // 💡 FIXED: Read localStorage synchronously inside an initializer function.
  // This executes BEFORE the first frame renders, preventing the LoginPage flash entirely.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('trader_token');
    return token !== null; // Returns true instantly if token exists, false otherwise
  });

  // Callback passed to child to trigger instant view swapping
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // Core Logout Handler Function
  const handleLogout = () => {
    localStorage.removeItem('trader_token');     // Clear authorization token
    localStorage.removeItem('trader_username');  // Clear stored username session
    setIsAuthenticated(false);                  // Reset state to instantly drop back to login view
  };

  return (
    <>
      {isAuthenticated ? (
        /* Dynamically loads your Trade Blotter component once OTP succeeds */
        <TradeBlotter onLogout={handleLogout} />
      ) : (
        /* Loads Login view if unauthenticated, passing down the success hook */
        <LoginPage onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
};

export default App;
