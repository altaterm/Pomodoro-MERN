import React, { useState, useEffect } from 'react';

const Settings = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key, value) => {
    const newSettings = {
      ...localSettings,
      [key]: parseInt(value) || 1
    };
    setLocalSettings(newSettings);
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleReset = () => {
    const defaultSettings = {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <p>Customize your Pomodoro experience</p>
      </div>

      <div className="settings-grid">
        <div className="setting-group">
          <label htmlFor="work-duration">
            <span className="setting-icon">🍅</span>
            Work Duration
          </label>
          <div className="input-group">
            <input
              id="work-duration"
              type="number"
              min="1"
              max="60"
              value={localSettings.workDuration}
              onChange={(e) => handleChange('workDuration', e.target.value)}
            />
            <span className="input-suffix">minutes</span>
          </div>
        </div>

        <div className="setting-group">
          <label htmlFor="short-break">
            <span className="setting-icon">☕</span>
            Short Break
          </label>
          <div className="input-group">
            <input
              id="short-break"
              type="number"
              min="1"
              max="30"
              value={localSettings.shortBreakDuration}
              onChange={(e) => handleChange('shortBreakDuration', e.target.value)}
            />
            <span className="input-suffix">minutes</span>
          </div>
        </div>

        <div className="setting-group">
          <label htmlFor="long-break">
            <span className="setting-icon">🌟</span>
            Long Break
          </label>
          <div className="input-group">
            <input
              id="long-break"
              type="number"
              min="1"
              max="60"
              value={localSettings.longBreakDuration}
              onChange={(e) => handleChange('longBreakDuration', e.target.value)}
            />
            <span className="input-suffix">minutes</span>
          </div>
        </div>

        <div className="setting-group">
          <label htmlFor="sessions-until-long">
            <span className="setting-icon">🔄</span>
            Sessions Until Long Break
          </label>
          <div className="input-group">
            <input
              id="sessions-until-long"
              type="number"
              min="2"
              max="10"
              value={localSettings.sessionsUntilLongBreak}
              onChange={(e) => handleChange('sessionsUntilLongBreak', e.target.value)}
            />
            <span className="input-suffix">sessions</span>
          </div>
        </div>
      </div>

      <div className="settings-preview">
        <h3>Preview</h3>
        <div className="preview-grid">
          <div className="preview-item work">
            <span>Work</span>
            <strong>{localSettings.workDuration}m</strong>
          </div>
          <div className="preview-item short-break">
            <span>Short Break</span>
            <strong>{localSettings.shortBreakDuration}m</strong>
          </div>
          <div className="preview-item long-break">
            <span>Long Break</span>
            <strong>{localSettings.longBreakDuration}m</strong>
          </div>
        </div>
        <p className="preview-text">
          After every {localSettings.sessionsUntilLongBreak} work sessions, you'll get a long break
        </p>
      </div>

      <div className="settings-actions">
        <button onClick={handleReset} className="reset-btn">
          Reset to Default
        </button>
        <button onClick={handleSave} className="save-btn">
          {showSaved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>

      {showSaved && (
        <div className="save-notification">
          Settings saved successfully! 🎉
        </div>
      )}
    </div>
  );
};

export default Settings;