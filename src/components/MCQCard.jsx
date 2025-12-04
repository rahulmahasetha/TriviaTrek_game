// src/components/MCQCard.jsx
import React, { useState, useEffect } from 'react';
import { useUserProgress } from '../context/UserProgressContext';

export default function MCQCard({ levelObj, category, onCorrectNextLevel, totalLevels, onBackToLevels }) {
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const { markPassed, isLevelCompleted, userProgress } = useUserProgress();
  
  // Check if this level is already completed
  const isAlreadyCompleted = levelObj ? isLevelCompleted(category, levelObj.level) : false;

  // Safely get current category progress with default values
  const categoryProgress = userProgress && userProgress[category] ? userProgress[category] : { passedLevels: [] };
  const passedLevels = categoryProgress.passedLevels || [];

  // Check if current level is passed
  const isCurrentLevelPassed = passedLevels.includes(levelObj?.level);

  // Reset timer and states when levelObj changes (new question)
  useEffect(() => {
    setSelected(null);
    setShowHint(false);
    setResult(null);
    setTimeLeft(20);
  }, [levelObj]);

  useEffect(() => {
    if (result) return;

    if (timeLeft === 0) {
      handleTimeout();
      return;
    }

    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, result]);

  function handleTimeout() {
    setResult('timeout');
    
    // Show timeout message but don't allow next level
    setTimeout(() => {
      // No auto-progression for timeout
    }, 2000);
  }

  function handleWrongAnswer() {
    setResult('incorrect');
    // Show wrong answer message but don't allow next level
    setTimeout(() => {
      // No auto-progression for wrong answers
    }, 2000);
  }

  function handleCorrectAnswer() {
    if (isAlreadyCompleted) {
      // Level already completed - show message
      setResult('alreadyCompleted');
    } else {
      // First time completing this level - mark as passed
      setResult('correct');
      markPassed(category, levelObj.level);
    }

    // Check if this is the last level
    const isLastLevel = levelObj.level >= totalLevels;
    
    setTimeout(() => {
      if (isLastLevel) {
        // Show completion message
        setResult('completed');
      } else {
        // Auto-move to next level ONLY for correct answers
        onCorrectNextLevel(levelObj.level + 1);
      }
    }, 1500);
  }

  function submit() {
    if (selected == null) {
      alert('Please select an answer!');
      return;
    }

    if (levelObj.answer === selected) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  }

  // Early return if levelObj is not available
  if (!levelObj) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h3>No level data available</h3>
      </div>
    );
  }

  return (
    <div className="mcq-card" style={{ padding: '20px' }}>
      <div className="timer-section" style={{ 
        marginBottom: '15px', 
        padding: '10px', 
        background: '#f0f8ff', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
          ⏳ Time Left: <span style={{ color: timeLeft <= 5 ? 'red' : '#2196F3' }}>{timeLeft}s</span>
        </p>
      </div>

      {levelObj.image && (
        <img 
          src={levelObj.image} 
          alt="Question visual" 
          style={{ 
            width: '100%', 
            maxHeight: '200px', 
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '15px'
          }} 
        />
      )}

      <h3 style={{ marginBottom: '15px', color: '#333' }}>
        Level {levelObj.level}: {levelObj.question}
      </h3>

      <div className="options-container" style={{ marginBottom: '20px' }}>
        {levelObj.options.map((opt, index) => (
          <label 
            key={index}
            className={`option-item ${selected === opt ? 'selected' : ''}`}
            style={{
              display: 'block',
              padding: '12px 15px',
              marginBottom: '10px',
              border: `2px solid ${selected === opt ? '#4CAF50' : '#ddd'}`,
              borderRadius: '8px',
              backgroundColor: selected === opt ? '#e8f5e8' : 'white',
              cursor: result === null ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              fontWeight: selected === opt ? '600' : '400',
              opacity: result === null ? 1 : 0.7
            }}
          >
            <input
              type="radio"
              name="answer"
              value={opt}
              checked={selected === opt}
              onChange={() => setSelected(opt)}
              style={{ marginRight: '10px' }}
              disabled={result !== null}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        {result === null ? (
          <>
            <button 
              onClick={submit} 
              style={{
                padding: '12px 24px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                flex: 1
              }}
            >
              Submit Answer
            </button>
            
            <button 
              onClick={() => setShowHint(s => !s)}
              style={{
                padding: '12px 16px',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          </>
        ) : (
          <>
            {/* No buttons shown after submission */}
          </>
        )}
      </div>

      {showHint && (
        <div className="hint" style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          color: '#856404'
        }}>
          <strong>💡 Hint:</strong> {levelObj.hint}
        </div>
      )}

      {/* Result Messages */}
      {result === 'correct' && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          color: '#155724',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          ✅ Correct! +20 points! {levelObj.level < totalLevels ? 'Moving to next level...' : 'Category completed!'}
        </div>
      )}

      {result === 'alreadyCompleted' && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#e2e3e5',
          border: '1px solid #d6d8db',
          borderRadius: '8px',
          color: '#383d41',
          textAlign: 'center'
        }}>
          ✅ Correct! (Already completed - no additional points)
          {levelObj.level < totalLevels && ' Moving to next level...'}
        </div>
      )}

      {result === 'completed' && (
        <div style={{
          marginTop: '15px',
          padding: '20px',
          backgroundColor: '#d1ecf1',
          border: '2px solid #bee5eb',
          borderRadius: '10px',
          color: '#0c5460',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎉</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>Category Complete!</h3>
          <p style={{ margin: 0 }}>Congratulations! You've completed all {totalLevels} levels in {category}!</p>
        </div>
      )}
      
      {result === 'incorrect' && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          textAlign: 'center'
        }}>
          ❌ Wrong answer! You must complete this level to proceed.
        </div>
      )}
      
      {result === 'timeout' && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          color: '#856404',
          textAlign: 'center'
        }}>
          ⏰ Time's up! You must complete this level to proceed.
        </div>
      )}
    </div>
  );
}