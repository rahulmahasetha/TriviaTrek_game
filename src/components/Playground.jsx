import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LevelMarker from './LevelMarker';
import MCQCard from './MCQCard';
import { useUserProgress } from '../context/UserProgressContext';

import dataScience from '../data/science.json';
import dataJungle from '../data/jungle.json';
import dataMath from '../data/math.json';
import dataHistory from '../data/history.json';

import scienceMap from '../assets/maps/scienceMap.png';
import jungleMap from '../assets/maps/jungle.png';
import mathMap from '../assets/maps/math.png';
import historyMap from '../assets/maps/history.png';

const mapByCategory = {
  science: scienceMap,
  jungle: jungleMap,
  math: mathMap,
  history: historyMap
};

const categoryColors = {
  science: '#4CAF50',
  jungle: '#FF9800',
  math: '#2196F3',
  history: '#9C27B0'
};

const categoryIcons = {
  science: '🔬',
  jungle: '🐾',
  math: '➗',
  history: '🏛'
};

export default function Playground() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { progress } = useUserProgress();
  const [data, setData] = useState({ levels: [] });
  const [showProgressOverview, setShowProgressOverview] = useState(false);

  useEffect(() => {
    if (category === 'science') setData(dataScience);
    else if (category === 'jungle') setData(dataJungle);
    else if (category === 'math') setData(dataMath);
    else if (category === 'history') setData(dataHistory);
    setSelectedLevel(null);
  }, [category]);

  function onLevelClick(level) {
    setSelectedLevel(level);
  }

  const passed = new Set((progress[category] && progress[category].passed) || []);
  const currentScore = Math.max(progress[category]?.score || 0, 0);
  const passedCount = passed.size;
  const totalLevels = data.levels.length;
  const progressPercentage = totalLevels > 0 ? (passedCount / totalLevels) * 100 : 0;

  const positions = [
    { left: '8%', top: '20%' },
    { left: '22%', top: '12%' },
    { left: '38%', top: '34%' },
    { left: '54%', top: '18%' },
    { left: '70%', top: '28%' },
    { left: '82%', top: '46%' },
    { left: '60%', top: '58%' },
    { left: '40%', top: '70%' },
    { left: '20%', top: '60%' },
    { left: '10%', top: '44%' }
  ];

  return (
    <div className="playground-container">
      {/* Header Section */}
      <header className="playground-header">
        <div className="header-content">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            ← Back to Home
          </button>
          <div className="category-title">
            <span className="category-icon">{categoryIcons[category]}</span>
            <h1>{category} Adventure</h1>
          </div>
          
          {/* Navbar with Leaderboard and Progress Overview */}
          <nav className="playground-nav">
            <button 
              onClick={() => navigate('/leaderboard')}
              className="nav-button leaderboard-nav"
              title="View Leaderboard"
            >
              <span className="nav-icon">🏆</span>
              <span className="nav-text">Leaderboard</span>
            </button>
            
            <button 
              onClick={() => setShowProgressOverview(!showProgressOverview)}
              className="nav-button progress-nav"
              title="Progress Overview"
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Progress</span>
            </button>
            
            <div className="header-progress">
              <div className="score-badge">
                🏅 {currentScore} Points
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Progress Overview Modal */}
      {showProgressOverview && (
        <div className="progress-overlay">
          <div className="progress-modal">
            <div className="modal-header">
              <h2>{category} Adventure Progress</h2>
              <button 
                onClick={() => setShowProgressOverview(false)}
                className="close-button"
              >
                ✕
              </button>
            </div>
            
            <div className="progress-content">
              {/* Progress Header */}
              <div className="progress-header">
                <div className="level-count">
                  <span className="count">{passedCount}/{totalLevels}</span>
                  <span className="label">Levels Completed</span>
                </div>
              </div>

              {/* Progress Details */}
              <div className="progress-details-modal">
                <div className="progress-item-modal">
                  <span className="progress-label">Levels Completed:</span>
                  <span className="progress-value">{passedCount}</span>
                </div>
                <div className="progress-item-modal">
                  <span className="progress-label">Current Score:</span>
                  <span className="progress-value">{currentScore} pts</span>
                </div>
                <div className="progress-item-modal">
                  <span className="progress-label">Levels Remaining:</span>
                  <span className="progress-value">{totalLevels - passedCount}</span>
                </div>
              </div>

              {/* Category Progress */}
              <div className="category-progress-section">
                <h3>Category Progress</h3>
                <div className="progress-bar-large">
                  <div 
                    className="progress-fill-large"
                    style={{ 
                      width: `${progressPercentage}%`,
                      backgroundColor: categoryColors[category]
                    }}
                  ></div>
                </div>
                <div className="progress-percentage">
                  {Math.round(progressPercentage)}% Complete
                </div>
              </div>

              {/* Level Breakdown */}
              <div className="level-breakdown">
                <h4>Level Progress (1-{totalLevels})</h4>
                <div className="levels-grid">
                  {data.levels.map((_, index) => {
                    const levelNumber = index + 1;
                    const isCompleted = passed.has(levelNumber);
                    const isCurrent = !isCompleted && (index === 0 || passed.has(index));
                    
                    return (
                      <div key={index} className="level-status">
                        <div className={`level-indicator ${isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'}`}>
                          {isCompleted ? '✓' : isCurrent ? '→' : levelNumber}
                        </div>
                        <span className="level-text">Level {levelNumber}</span>
                        <span className="level-state">
                          {isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Locked'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  onClick={() => setShowProgressOverview(false)}
                  className="continue-button"
                >
                  Continue Playing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="playground-main">
        <div className="layout-grid">
          {/* Map Section */}
          <section className="map-section">
            <div className="map-container">
              <div className="map-header">
                <h2>Explore the Map</h2>
                <div className="map-instruction">
                  <div className="progress-badge">
                    {passedCount}/{totalLevels} Completed
                  </div>
                </div>
              </div>
              
              <div className="map-wrapper">
                <img 
                  className="map-image" 
                  src={mapByCategory[category]} 
                  alt={`${category} adventure map`} 
                />
                
                {/* Level Markers - FIXED LOGIC */}
                {data.levels.map((lvl, idx) => {
                  const pos = positions[idx] || { left: `${6 + idx * 8}%`, top: '40%' };
                  const levelNumber = idx + 1;

                  // FIXED UNLOCKING LOGIC:
                  // A level is locked only if:
                  // 1. It's not level 1 AND
                  // 2. Previous level is not completed AND
                  // 3. This level itself is not completed
                  const isCompleted = passed.has(levelNumber);
                  const previousLevelCompleted = levelNumber === 1 || passed.has(levelNumber - 1);
                  const isLocked = !previousLevelCompleted && !isCompleted;
                  
                  // Current level is the first incomplete level
                  let currentLevelIndex = -1;
                  for (let i = 0; i < totalLevels; i++) {
                    if (!passed.has(i + 1)) {
                      currentLevelIndex = i;
                      break;
                    }
                  }
                  
                  // If all levels completed, consider the last level as current
                  const isCurrent = currentLevelIndex === -1 ? 
                    levelNumber === totalLevels : 
                    levelNumber === currentLevelIndex + 1;

                  return (
                    <LevelMarker
                      key={idx}
                      style={{ left: pos.left, top: pos.top }}
                      level={levelNumber}
                      locked={isLocked}
                      completed={isCompleted}
                      current={isCurrent}
                      category={category}
                      onClick={() => !isLocked && onLevelClick(lvl)}
                    />
                  );
                })}
              </div>

              {/* Map Legend */}
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-color current"></div>
                  <span>Current Level</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color completed"></div>
                  <span>Completed</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color locked"></div>
                  <span>Locked</span>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar Section */}
          <aside className="sidebar">
            <div className="question-section">
              {selectedLevel ? (
                <div className="mcq-container">
                  <div className="mcq-header">
                    <h3>Level {selectedLevel.level}</h3>
                    <button
                      onClick={() => setSelectedLevel(null)}
                      className="stop-mcq-button"
                      title="Stop Current Level"
                    >
                      <span className="stop-icon">⛔</span>
                      Stop
                    </button>
                  </div>
                  <MCQCard
                    levelObj={selectedLevel}
                    category={category}
                    totalLevels={totalLevels}
                    setSelectedLevel={setSelectedLevel}
                    onCorrectNextLevel={(nextLevel) => {
                      const next = data.levels.find(l => l.level === nextLevel);
                      if (next) setSelectedLevel(next);
                    }}
                  />
                </div>
              ) : (
                <div className="welcome-card">
                  <div className="welcome-icon">🎯</div>
                  <h3>Ready to Start?</h3>
                  <p>Select a level on the map to begin your {category} adventure!</p>
                  
                  <div className="tips">
                    <div className="tip">
                      <span className="tip-icon">💡</span>
                      Complete levels in order to unlock new challenges
                    </div>
                    <div className="tip">
                      <span className="tip-icon">⭐</span>
                      Earn points for correct answers (first time only)
                    </div>
                    <div className="tip">
                      <span className="tip-icon">🔄</span>
                      Replay completed levels anytime - progress is saved
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <style jsx>{`
        .playground-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Poppins', sans-serif;
        }

        .playground-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 20px 0;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .back-button {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          color: #495057;
        }

        .back-button:hover {
          background: #e9ecef;
          transform: translateX(-5px);
        }

        .category-title {
          display: flex;
          align-items: center;
          gap: 15px;
          flex: 1;
          justify-content: center;
        }

        .category-title h1 {
          margin: 0;
          font-size: 2.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: capitalize;
        }

        .category-icon {
          font-size: 2.5rem;
        }

        .playground-nav {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 2px solid #e9ecef;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          background: white;
          color: #495057;
        }

        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .score-badge {
          background: linear-gradient(45deg, #FFD700, #FFA000);
          color: #333;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }

        .playground-main {
          padding: 30px 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .layout-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 30px;
          align-items: start;
        }

        .map-section {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          min-height: 600px;
        }

        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .map-wrapper {
          position: relative;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          background: #f8f9fa;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .map-image {
          width: 100%;
          height: auto;
          border-radius: 15px;
        }

        .map-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .legend-color.current { background: #4CAF50; }
        .legend-color.completed { background: #2196F3; }
        .legend-color.locked { background: #9e9e9e; }

        .sidebar {
          width: 360px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 20px;
        }

        .mcq-container {
          background: white;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .mcq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .stop-mcq-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          color: white;
          cursor: pointer;
        }

        .welcome-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .welcome-icon {
          font-size: 3.5rem;
          margin-bottom: 15px;
        }

        .tips {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }

        .tip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: left;
        }

        @media (max-width: 1024px) {
          .layout-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .sidebar {
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
          
          .category-title {
            justify-content: center;
          }
          
          .playground-nav {
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .map-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .map-legend {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

// CSS Styles
const styles = `
.playground-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
}

.playground-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.back-button {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #495057;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.back-button:hover {
  background: #e9ecef;
  transform: translateX(-5px);
}

.category-title {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  justify-content: center;
}

.category-title h1 {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: capitalize;
}

.category-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

/* Header Progress Display */
.header-progress {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.score-badge {
  background: linear-gradient(45deg, #FFD700, #FFA000);
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

/* Navbar Styles */
.playground-nav {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  background: white;
  color: #495057;
  text-decoration: none;
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.leaderboard-nav:hover {
  border-color: #FFD700;
  background: #FFF9C4;
}

.progress-nav:hover {
  border-color: #4CAF50;
  background: #E8F5E8;
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-text {
  font-size: 0.9rem;
  font-weight: 600;
}

/* Progress Overview Modal */
.progress-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.progress-modal {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
}

.close-button {
  background: #f8f9fa;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #e9ecef;
  color: #333;
}

.progress-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  color: white;
}

.level-count .count {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.level-count .label {
  font-size: 1.1rem;
  opacity: 0.9;
}

.progress-details-modal {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
}

.progress-item-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.progress-item-modal:last-child {
  border-bottom: none;
}

.progress-label {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

.progress-value {
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
}

.category-progress-section {
  margin-bottom: 25px;
}

.category-progress-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.progress-bar-large {
  width: 100%;
  height: 12px;
  background: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill-large {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-percentage {
  text-align: center;
  font-weight: 600;
  color: #666;
  font-size: 1rem;
}

.level-breakdown {
  margin-bottom: 25px;
}

.level-breakdown h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.level-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.level-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.level-indicator.completed {
  background: #4CAF50;
}

.level-indicator.current {
  background: #2196F3;
}

.level-indicator.locked {
  background: #9e9e9e;
  color: white;
}

.level-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  flex: 1;
}

.level-state {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.continue-button {
  padding: 12px 30px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.continue-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
}

.playground-main {
  padding: 30px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 30px;
  align-items: start;
}

/* Map Section */
.map-section {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.map-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.map-instruction {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

.map-wrapper {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 15px;
}

.map-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.legend-color.current {
  background: #4CAF50;
}

.legend-color.completed {
  background: #2196F3;
}

.legend-color.locked {
  background: #9e9e9e;
}

/* Sidebar - Clean without progress info */
.sidebar {
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* Question Section */
.question-section {
  flex: 1;
}

/* MCQ Container with Stop Button */
.mcq-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.mcq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.mcq-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.stop-mcq-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.stop-mcq-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.stop-icon {
  font-size: 1rem;
}

.welcome-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-icon {
  font-size: 3.5rem;
  margin-bottom: 15px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.welcome-card h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
}

.welcome-card p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
  font-size: 0.95rem;
}

.tips {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #555;
  text-align: left;
}

.tip-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .layout-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .sidebar {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    position: static;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .category-title {
    justify-content: center;
  }
  
  .header-progress {
    justify-content: center;
  }
  
  .playground-nav {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .map-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .map-legend {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .sidebar {
    max-width: 100%;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-button {
    padding: 10px;
  }
  
  .progress-modal {
    padding: 20px;
    margin: 10px;
  }
  
  .levels-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .playground-main {
    padding: 20px 15px;
  }
  
  .map-section, .welcome-card {
    padding: 20px;
  }
  
  .category-title h1 {
    font-size: 1.8rem;
  }
  
  .header-progress {
    flex-direction: column;
    gap: 10px;
  }
  
  .map-wrapper {
    min-height: 400px;
  }
  
  .mcq-header {
    padding: 15px;
  }
  
  .mcq-header h3 {
    font-size: 1.1rem;
  }
  
  .stop-mcq-button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}