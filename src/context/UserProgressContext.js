import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
//import { userProgressAPI, leaderboardAPI } from '../services/api';

const UserProgressContext = createContext();

export function UserProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem("trivia_progress");
      return saved
        ? JSON.parse(saved)
        : {
            science: { passed: [], score: 0 },
            jungle: { passed: [], score: 0 },
            math: { passed: [], score: 0 },
            history: { passed: [], score: 0 },
            highestScore: 0,
            leaderboard: []   
          };
    } catch (e) {
      return {
        science: { passed: [], score: 0 },
        jungle: { passed: [], score: 0 },
        math: { passed: [], score: 0 },
        history: { passed: [], score: 0 },
        highestScore: 0,
        leaderboard: []
      };
    }
  });

  // Save to localStorage and API
  useEffect(() => {
    localStorage.setItem("trivia_progress", JSON.stringify(progress));
    
    // Sync with JSON Server (optional)
    const syncWithServer = async () => {
      try {
        // await userProgressAPI.updateProgress('current', progress);
      } catch (error) {
        console.log('Server sync failed, using local storage only');
      }
    };
    
    syncWithServer();
  }, [progress]);

  const markPassed = (category, level) => {
    setProgress((prev) => {
      const categoryProgress = prev[category] || { passed: [], score: 0 };
      const levelIndex = level - 1;
      
      const isAlreadyCompleted = categoryProgress.passed.includes(levelIndex);
      
      if (isAlreadyCompleted) {
        toast.info('Level already completed!');
        return prev;
      }
      
      const newPassed = [...new Set([...categoryProgress.passed, levelIndex])];
      const newScore = categoryProgress.score + 20;
      
      const updatedProgress = {
        ...prev,
        [category]: {
          ...categoryProgress,
          passed: newPassed,
          score: newScore
        }
      };

      const totalScore = Object.values(updatedProgress).reduce((total, cat) => {
        if (cat && typeof cat === 'object' && 'score' in cat) {
          return total + cat.score;
        }
        return total;
      }, 0);

      toast.success(`+20 points! Level ${level} completed!`);
      
      return {
        ...updatedProgress,
        highestScore: Math.max(prev.highestScore, totalScore)
      };
    });
  };

  const addPenalty = (category, penalty) => {
    setProgress(prev => {
      const categoryProgress = prev[category] || { passed: [], score: 0 };
      const newScore = Math.max(0, categoryProgress.score - penalty);
      
      toast.error(`-${penalty} points penalty!`);
      
      return {
        ...prev,
        [category]: {
          ...categoryProgress,
          score: newScore
        }
      };
    });
  };

  const isLevelCompleted = (category, level) => {
    const categoryProgress = progress[category];
    if (!categoryProgress) return false;
    return categoryProgress.passed.includes(level - 1);
  };

  const updateHighestScore = (total) => {
    setProgress((prev) => ({
      ...prev,
      highestScore: Math.max(prev.highestScore, total)
    }));
  };

  const resetProgress = () => {
    const fresh = {
      science: { passed: [], score: 0 },
      jungle: { passed: [], score: 0 },
      math: { passed: [], score: 0 },
      history: { passed: [], score: 0 },
      highestScore: 0,
      leaderboard: []
    };

    setProgress(fresh);
    localStorage.setItem("trivia_progress", JSON.stringify(fresh));
    toast.success('Progress reset successfully!');
  };

  const saveToLeaderboard = async (name, totalScore) => {
    const newEntry = { 
      name, 
      score: totalScore, 
      date: new Date().toLocaleDateString(),
      id: Date.now() + Math.random()
    };
    
    setProgress((prev) => {
      const updated = [...prev.leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      return {
        ...prev,
        leaderboard: updated
      };
    });

    // Save to JSON Server
    try {
      await leaderboardAPI.addToLeaderboard(newEntry);
      toast.success('Score saved to leaderboard!');
    } catch (error) {
      toast.error('Failed to save to online leaderboard');
    }
  };

  const getTotalScore = () => {
    return Object.values(progress).reduce((total, category) => {
      if (category && typeof category === 'object' && 'score' in category) {
        return total + category.score;
      }
      return total;
    }, 0);
  };

  return (
    <UserProgressContext.Provider
      value={{
        progress,
        markPassed,
        addPenalty,
        isLevelCompleted,
        updateHighestScore,
        saveToLeaderboard,
        resetProgress,
        getTotalScore
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
}

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};