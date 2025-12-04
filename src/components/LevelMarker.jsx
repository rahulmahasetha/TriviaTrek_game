// src/components/LevelMarker.jsx
import React, { useState, useEffect } from 'react';

export default function LevelMarker({ level, locked, completed, current, pulsing, onClick, style, category }) {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldAnimate(true), level * 100);
    return () => clearTimeout(timer);
  }, [level]);

  const getMarkerContent = () => {
    if (locked) return '🔒';
    if (completed) return '✓';
    return level;
  };

  const getTooltipText = () => {
    if (locked) return 'Complete previous level to unlock';
    if (completed) return `Level ${level} - Completed!`;
    if (current) return `Level ${level} - Current`;
    return `Level ${level} - Click to play`;
  };

  const getCategoryColor = () => {
    switch(category) {
      case 'science': return 'from-green-500 to-emerald-600';
      case 'jungle': return 'from-orange-500 to-amber-600';
      case 'math': return 'from-blue-500 to-indigo-600';
      case 'history': return 'from-purple-500 to-violet-600';
      default: return 'from-purple-500 to-indigo-600';
    }
  };

  const baseClasses = `
    absolute w-12 h-12 rounded-full flex items-center justify-center font-bold 
    cursor-pointer transform scale-0 transition-all duration-300 
    shadow-lg z-10 text-lg border-3 border-transparent
    ${shouldAnimate ? 'scale-100' : ''}
    animate-marker-entrance
  `;

  const stateClasses = locked 
    ? 'bg-gray-400 cursor-not-allowed transform scale-90 animate-shake' 
    : completed 
    ? 'bg-green-500 animate-completed-glow' 
    : current 
    ? 'bg-blue-500 border-yellow-400 animate-current-pulse' 
    : pulsing 
    ? `bg-gradient-to-br ${getCategoryColor()} animate-suggest-pulse` 
    : `bg-gradient-to-br ${getCategoryColor()}`;

  const hoverClasses = isHovered && !locked 
    ? 'transform scale-125 -translate-y-2 shadow-2xl z-20' 
    : '';

  return (
    <div
      className={`${baseClasses} ${stateClasses} ${hoverClasses}`}
      title={getTooltipText()}
      onClick={!locked ? onClick : undefined}
      onMouseEnter={() => !locked && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        animationDelay: `${level * 0.1}s`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Main marker content */}
      <div className="z-20 relative">
        {getMarkerContent()}
      </div>
      
      {/* Pulse ring for pulsing markers */}
      {pulsing && (
        <div className="absolute w-16 h-16 border-2 border-orange-500 rounded-full pointer-events-none animate-ring-pulse"></div>
      )}
      
      {/* Hover effect trail */}
      {isHovered && (
        <div className="absolute w-16 h-16 border-2 border-white/60 rounded-full pointer-events-none animate-trail-expand"></div>
      )}
    </div>
  );
}

// Add CSS animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes marker-entrance {
      0% {
        transform: scale(0) rotate(-180deg);
        opacity: 0;
      }
      70% {
        transform: scale(1.1) rotate(10deg);
      }
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }

    @keyframes completed-glow {
      0%, 100% {
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
      }
      50% {
        box-shadow: 0 4px 20px rgba(76, 175, 80, 0.8), 0 0 30px rgba(76, 175, 80, 0.6);
      }
    }

    @keyframes current-pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
      }
      50% {
        transform: scale(1.1);
        box-shadow: 0 4px 20px rgba(33, 150, 243, 0.8), 0 0 30px rgba(33, 150, 243, 0.6);
      }
    }

    @keyframes suggest-pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.15);
        box-shadow: 0 0 25px rgba(255, 152, 0, 0.8);
      }
    }

    @keyframes ring-pulse {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    @keyframes trail-expand {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0) scale(0.9); }
      25% { transform: translateX(-3px) scale(0.9); }
      75% { transform: translateX(3px) scale(0.9); }
    }

    .animate-marker-entrance {
      animation: marker-entrance 0.6s ease-out;
    }

    .animate-completed-glow {
      animation: completed-glow 2s ease-in-out infinite;
    }

    .animate-current-pulse {
      animation: current-pulse 2s ease-in-out infinite;
    }

    .animate-suggest-pulse {
      animation: suggest-pulse 1.5s ease-in-out infinite;
    }

    .animate-ring-pulse {
      animation: ring-pulse 2s ease-out infinite;
    }

    .animate-trail-expand {
      animation: trail-expand 0.6s ease-out forwards;
    }

    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }

    /* Custom border width */
    .border-3 {
      border-width: 3px;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .w-12.h-12 {
        width: 2.5rem;
        height: 2.5rem;
      }
      .w-16.h-16 {
        width: 3.5rem;
        height: 3.5rem;
      }
      .text-lg {
        font-size: 0.875rem;
      }
    }

    @media (max-width: 480px) {
      .w-12.h-12 {
        width: 2rem;
        height: 2rem;
      }
      .w-16.h-16 {
        width: 3rem;
        height: 3rem;
      }
      .text-lg {
        font-size: 0.75rem;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}