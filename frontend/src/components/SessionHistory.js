import React, { useState, useEffect } from 'react';
import { sessionAPI } from '../services/api';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsResponse, statsResponse] = await Promise.all([
        sessionAPI.getSessions(),
        sessionAPI.getStats()
      ]);
      
      setSessions(sessionsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionIcon = (type) => {
    switch (type) {
      case 'work': return '🍅';
      case 'shortBreak': return '☕';
      case 'longBreak': return '🌟';
      default: return '⏱️';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="session-history">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Work Sessions</h3>
          <p className="stat-number">{stats.todayWork || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Breaks</h3>
          <p className="stat-number">{stats.todayBreaks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Minutes</h3>
          <p className="stat-number">{stats.todayMinutes || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sessions</h3>
          <p className="stat-number">{stats.totalSessions || 0}</p>
        </div>
      </div>
      
      <div className="recent-sessions">
        <h3>Recent Sessions</h3>
        {sessions.length === 0 ? (
          <p>No sessions yet. Start your first Pomodoro!</p>
        ) : (
          <div className="sessions-list">
            {sessions.slice(0, 10).map((session) => (
              <div key={session._id} className="session-item">
                <span className="session-icon">
                  {getSessionIcon(session.type)}
                </span>
                <div className="session-details">
                  <span className="session-type">
                    {session.type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <span className="session-duration">
                    {session.duration} min
                  </span>
                </div>
                <span className="session-time">
                  {formatDate(session.completedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionHistory;