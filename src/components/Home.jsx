// src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserProgress } from "../context/UserProgressContext";

export default function Home() {
  const { progress, resetProgress } = useUserProgress();
  const [showInstructions, setShowInstructions] = useState(false);

  const totalScore =
    (progress.science?.score || 0) +
    (progress.jungle?.score || 0) +
    (progress.math?.score || 0) +
    (progress.history?.score || 0);

  const completedSections = [
    progress.science?.passed?.length > 0,
    progress.jungle?.passed?.length > 0,
    progress.math?.passed?.length > 0,
    progress.history?.passed?.length > 0
  ].filter(Boolean).length;

  const isAllCompleted = totalScore === 440;
  const remainingSections = 4 - completedSections;

  const categories = [
    { path: "/playground/science", name: "Science", icon: "🔬", color: "#4CAF50", description: "Explore scientific wonders and discoveries" },
    { path: "/playground/jungle", name: "Jungle", icon: "🐾", color: "#FF9800", description: "Discover wildlife and nature mysteries" },
    { path: "/playground/math", name: "Math", icon: "➗", color: "#2196F3", description: "Solve mathematical puzzles and challenges" },
    { path: "/playground/history", name: "History", icon: "🏛", color: "#9C27B0", description: "Journey through historical events and figures" }
  ];

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
      resetProgress();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 font-sans flex flex-col">
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">🎮 Game Instructions</h2>
              <button 
                onClick={() => setShowInstructions(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <div className="space-y-4">
                {[
                  { icon: "🎯", title: "Choose Your Adventure", desc: "Select from 4 different categories: Science, Jungle, Math, and History" },
                  { icon: "📝", title: "Complete Levels", desc: "Each category has 10 levels. Complete them in sequence to unlock new challenges" },
                  { icon: "⭐", title: "Earn Points", desc: "Answer questions correctly to earn points. Each category has a maximum of 200 points" },
                  { icon: "🏆", title: "Achieve Mastery", desc: "Complete all categories with perfect scores to become a Master Adventurer!" },
                  { icon: "🔒", title: "Progressive Unlocking", desc: "Levels unlock sequentially. Complete one level to access the next" },
                  { icon: "📊", title: "Track Progress", desc: "Monitor your progress through progress bars and achievement badges" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border-l-4 border-indigo-500">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setShowInstructions(false)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                Let's Start Learning!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-lg py-3 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-800">TriviaTrek</span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button 
              onClick={() => setShowInstructions(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-full font-medium text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 text-sm"
            >
              <span>📖</span>
              <span>Instructions</span>
            </button>
            
            <Link 
              to="/leaderboard" 
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-full font-medium text-gray-700 hover:border-yellow-500 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-300 text-sm"
            >
              <span>🏆</span>
              <span>Leaderboard</span>
            </Link>
            
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 rounded-full font-medium text-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 text-sm"
            >
              <span>🔄</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-shadow-lg">
            Choose Your Challenge
          </h1>
          <p className="text-xl text-white/90 font-light max-w-2xl mx-auto">
            {isAllCompleted ? (
              <span className="text-yellow-300 font-semibold">Master Adventurer! You've conquered all quests! 🌟</span>
            ) : (
              "Embark on an educational journey through exciting subjects"
            )}
          </p>
        </section>

        {/* Categories Section */}
        <section className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Explore Subjects</h2>
            <p className="text-white/80">Select a quest to begin your adventure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const categoryProgress = progress[category.name.toLowerCase()];
              const completedLevels = categoryProgress?.passed?.length || 0;
              const totalLevels = 10;
              const isCategoryCompleted = completedLevels === totalLevels;
              const categoryScore = categoryProgress?.score || 0;
              const progressPercentage = (completedLevels / totalLevels) * 100;
              
              return (
                <Link
                  key={category.name}
                  to={category.path}
                  className={`bg-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                    isCategoryCompleted ? 'border-2 border-green-500' : 'border border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                      <p className="text-gray-600 text-xs leading-tight">{category.description}</p>
                    </div>
                    <div>
                      {isCategoryCompleted ? (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">✅</span>
                      ) : completedLevels > 0 ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                          {completedLevels}/10
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">🎯</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1 text-xs font-medium text-gray-600">
                      <span>{categoryScore} pts</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${progressPercentage}%`,
                          backgroundColor: category.color
                        }}
                      ></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Progress Overview */}
        <section className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2 sm:mb-0">Adventure Progress</h2>
            <div className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
              {completedSections}/4 Quests
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-lg flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-white">{totalScore}</div>
                <div className="text-white/80 text-sm">Total Score</div>
              </div>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-white">{progress.highestScore || 0}</div>
                <div className="text-white/80 text-sm">Highest Score</div>
              </div>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-white">
                  {isAllCompleted ? '100%' : `${Math.round((totalScore / 800) * 100)}%`}
                </div>
                <div className="text-white/80 text-sm">Completion</div>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${Math.round((totalScore / 800) * 100)}%` }}
            ></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/10 backdrop-blur-lg border-t border-white/10 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-2">
            <span className="text-lg font-bold text-white">Trivia Trek</span>
          </div>
          <div className="text-white/80 text-sm mb-2">
            Embark on your learning adventure today!
          </div>
          <div className="text-white/60 text-xs">
            &copy; 2025 Trivia Trek. Crafted with for learners
          </div>
        </div>
      </footer>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease;
        }
        
        .text-shadow-lg {
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        @media (max-width: 768px) {
          .grid-cols-4 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}