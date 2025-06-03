import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import SessionHistory from './components/SessionHistory';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSessionComplete = () => {
    setRefreshHistory(prev => prev + 1);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="App">
      <div className="app-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <header className="app-header">
        <div className="header-content">
          <h1>🍅 Pomodoro Focus</h1>
          <p>Master your time, master your mind</p>
        </div>
        <nav className="app-nav">
          <button 
            className={activeTab === 'timer' ? 'active' : ''}
            onClick={() => setActiveTab('timer')}
          >
            <span className="nav-icon">⏱️</span>
            Timer
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            <span className="nav-icon">📊</span>
            Stats
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
        </nav>
      </header>


      <main className="app-main">
        {activeTab === 'timer' && (
          <Timer 
            onSessionComplete={handleSessionComplete} 
            settings={settings}
          />
        )}
        {activeTab === 'history' && (
          <SessionHistory key={refreshHistory} />
        )}
        {activeTab === 'settings' && (
          <Settings 
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>🚀 Boost your productivity with the Pomodoro Technique</p>
        </div>
      </footer>
    </div>
  );
}

export default App;