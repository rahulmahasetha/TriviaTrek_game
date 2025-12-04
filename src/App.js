import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import Playground from './components/Playground';
import ScoreSummary from './components/ScoreSummary';
import Leaderboard from './components/Leaderboard';
import { UserProgressProvider } from './context/UserProgressContext';

export default function App() {
  return (
    <UserProgressProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playground/:category" element={<Playground />} />
        <Route path="/summary" element={<ScoreSummary />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </UserProgressProvider>
  );
}