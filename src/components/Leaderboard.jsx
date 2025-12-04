// src/pages/Leaderboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserProgress } from "../context/UserProgressContext";

export default function Leaderboard() {
  const { progress } = useUserProgress();
  const navigate = useNavigate();

  const totalScore =
    (progress.science?.score || 0) +
    (progress.jungle?.score || 0) +
    (progress.math?.score || 0) +
    (progress.history?.score || 0);

  const sections = [
    { name: "Science", icon: "🔬", color: "#4CAF50", data: progress.science },
    { name: "Jungle", icon: "🐾", color: "#FF9800", data: progress.jungle },
    { name: "Math", icon: "➗", color: "#2196F3", data: progress.math },
    { name: "History", icon: "🏛", color: "#9C27B0", data: progress.history }
  ];

  const completedSections = sections.filter(sec => sec.data?.passed?.length > 0).length;
  const totalSections = sections.length;
  const completionPercentage = (completedSections / totalSections) * 100;

  const getAchievementLevel = (score) => {
    if (score >= 700) return { text: "🏆 Master", color: "from-yellow-500 to-yellow-600" };
    if (score >= 600) return { text: "⭐ Advanced", color: "from-purple-500 to-purple-600" };
    if (score >= 400) return { text: "🚀 Intermediate", color: "from-blue-500 to-blue-600" };
    if (score >= 200) return { text: "🌱 Beginner", color: "from-green-500 to-green-600" };
    return { text: "🎯 Newbie", color: "from-gray-500 to-gray-600" };
  };

  const achievement = getAchievementLevel(progress.highestScore || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800 font-sans pb-10">
      {/* Header Section */}
      <header className="bg-white/95 backdrop-blur-lg py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Learning Leaderboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Track your learning journey and achievements</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Overview Section */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Total Score Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">⭐</div>
                <h3 className="text-lg font-bold text-gray-800">Total Score</h3>
              </div>
              <div className="text-4xl font-black text-green-600 mb-1">{totalScore}</div>
              <div className="text-gray-500 mb-4">/ 800</div>
              <div className="text-sm font-semibold text-gray-600">
                {Math.round((totalScore / 800) * 100)}% Complete
              </div>
            </div>

            {/* Highest Score Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🔥</div>
                <h3 className="text-lg font-bold text-gray-800">Highest Score</h3>
              </div>
              <div className="text-4xl font-black text-orange-500 mb-4">{progress.highestScore || 0}</div>
              <div className={`bg-gradient-to-r ${achievement.color} text-white px-4 py-1.5 rounded-full text-sm font-bold inline-block`}>
                {achievement.text}
              </div>
            </div>

            {/* Completion Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">📊</div>
                <h3 className="text-lg font-bold text-gray-800">Progress</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{completedSections}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{totalSections}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-600">
                {Math.round(completionPercentage)}% Complete
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Category Performance</h2>
            <p className="text-white/90">Your progress across different learning adventures</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {sections.map((section) => {
              const sectionData = section.data || {};
              const completedLevels = sectionData.passed?.length || 0;
              const totalLevels = 10;
              const sectionScore = sectionData.score || 0;
              const progressPercentage = (completedLevels / totalLevels) * 100;

              const getStatus = () => {
                if (completedLevels === totalLevels) 
                  return { text: "✅ Completed", bg: "bg-green-100", textColor: "text-green-800" };
                if (completedLevels > 0) 
                  return { text: "🔄 In Progress", bg: "bg-blue-100", textColor: "text-blue-800" };
                return { text: "🎯 Start Now", bg: "bg-orange-100", textColor: "text-orange-800" };
              };

              const status = getStatus();

              return (
                <div 
                  key={section.name} 
                  className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-opacity-100 hover:border-current"
                  style={{ borderColor: section.color }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">{section.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{section.name}</h3>
                      <p className="text-gray-600 text-sm">Levels: {completedLevels}/{totalLevels}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: section.color }}>{sectionScore}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${progressPercentage}%`,
                          backgroundColor: section.color
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className={`${status.bg} ${status.textColor} px-3 py-1.5 rounded-full text-xs font-bold`}>
                      {status.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Section */}
        <section className="mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-white text-gray-800 font-semibold py-3 px-8 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 shadow-lg w-full sm:w-auto justify-center"
            >
              <span className="text-xl">🏠</span>
              Back to Home
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 shadow-lg w-full sm:w-auto justify-center"
            >
              <span className="text-xl">🎮</span>
              Continue Learning
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}