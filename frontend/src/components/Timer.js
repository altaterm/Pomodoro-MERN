import React, { useState, useEffect, useRef } from 'react';
import { sessionAPI } from '../services/api';

const Timer = ({ onSessionComplete, settings }) => {
  const [minutes, setMinutes] = useState(settings.workDuration);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('work');
  const [sessionCount, setSessionCount] = useState(0);
  
  const intervalRef = useRef(null);
  
  const sessionDurations = {
    work: settings.workDuration,
    shortBreak: settings.shortBreakDuration,
    longBreak: settings.longBreakDuration
  };

  // Update timer when settings change
  useEffect(() => {
      setMinutes(sessionDurations[sessionType]);
      setSeconds(0);
  }, [settings, sessionType]);

  useEffect(() => {
    if (isActive && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      handleSessionComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    
    // Save session to database
    try {
      await sessionAPI.createSession({
        type: sessionType,
        duration: sessionDurations[sessionType],
        completed: true
      });
      
      if (onSessionComplete) {
        onSessionComplete();
      }
      
      // Auto-switch session type
      if (sessionType === 'work') {
        const newCount = sessionCount + 1;
        setSessionCount(newCount);
        
        if (newCount % settings.sessionsUntilLongBreak === 0) {
          switchSession('longBreak');
        } else {
          switchSession('shortBreak');
        }
      } else {
        switchSession('work');
      }
      
      // Play notification sound (if available)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Session Complete!', {
          body: `${sessionType} session finished. Time for ${getNextSessionType()}!`,
          icon: '/favicon.ico'
        });
      }
      
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const getNextSessionType = () => {
    if (sessionType === 'work') {
      return sessionCount % settings.sessionsUntilLongBreak === (settings.sessionsUntilLongBreak - 1) ? 'long break' : 'short break';
    }
    return 'work';
  };

  const switchSession = (type) => {
    setSessionType(type);
    setMinutes(sessionDurations[type]);
    setSeconds(0);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(sessionDurations[sessionType]);
    setSeconds(0);
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'work': return '#e74c3c';
      case 'shortBreak': return '#3498db';
      case 'longBreak': return '#2ecc71';
      default: return '#e74c3c';
    }
  };

  return (
    <div className="timer-container" style={{ color: getSessionColor() }}>
      <div className="session-selector">
        <button 
          className={sessionType === 'work' ? 'active' : ''}
          onClick={() => switchSession('work')}
        >
          Work
        </button>
        <button 
          className={sessionType === 'shortBreak' ? 'active' : ''}
          onClick={() => switchSession('shortBreak')}
        >
          Short Break
        </button>
        <button 
          className={sessionType === 'longBreak' ? 'active' : ''}
          onClick={() => switchSession('longBreak')}
        >
          Long Break
        </button>
      </div>
      
      <div className="timer-display">
        <h1>{formatTime(minutes, seconds)}</h1>
        <p>Session #{sessionCount + 1}</p>
        <div className="session-info">
          <span className="current-session">{sessionType.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
          <span className="next-session">Next: {getNextSessionType()}</span>
        </div>
      </div>
      
      <div className="timer-controls">
        <button onClick={toggleTimer} className="primary-btn">
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="secondary-btn">
          Reset
        </button>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{
            width: `${((sessionDurations[sessionType] * 60 - minutes * 60 - seconds) / (sessionDurations[sessionType] * 60)) * 100}%`,
            backgroundColor: getSessionColor()
          }}
        />
      </div>
    </div>
  );
};

export default Timer;