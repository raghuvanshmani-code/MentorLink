
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MySessionsPage from './pages/MySessionsPage';
import RateSessionPage from './pages/RateSessionPage';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sessions" element={<MySessionsPage />} />
              <Route path="/rate/:sessionId" element={<RateSessionPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
