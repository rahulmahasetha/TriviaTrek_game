import React, { useEffect } from 'react';
import { useUserProgress } from '../context/UserProgressContext';
import confetti from 'canvas-confetti';

export default function ScoreSummary() {
  const { progress, updateHighestScore } = useUserProgress();

  const totalScore =
    (progress.science?.score || 0) +
    (progress.jungle?.score || 0) +
    (progress.math?.score || 0) +
    (progress.history?.score || 0);

  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 }
    });

    updateHighestScore(totalScore);
  }, []);

  return (
    <div className="mcq-card" style={{ padding: 20, textAlign: "center" }}>
      <h2>🎉 Final Score Summary</h2>

      <p>Science: <b>{progress.science?.score}</b></p>
      <p>Jungle: <b>{progress.jungle?.score}</b></p>
      <p>Math: <b>{progress.math?.score}</b></p>
      <p>History: <b>{progress.history?.score}</b></p>

      <h3 style={{ marginTop: 15 }}>Total Score: <b>{totalScore}</b></h3>
      <h3>🏆 Highest Score: <b>{progress.highestScore}</b></h3>

      <button 
        onClick={() => window.location.href = '/'} 
        style={{
          marginTop: 20,
          padding: "10px 15px",
          background: "#2196F3",
          color: "white",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer"
        }}
      >
        ⬅ Go Home
      </button>
    </div>
  );
}
