import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/leaderboard`);
      setLeaderboard(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${position}`;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1: return 'linear-gradient(135deg, #FFD700, #FFA500)';
      case 2: return 'linear-gradient(135deg, #C0C0C0, #A9A9A9)';
      case 3: return 'linear-gradient(135deg, #CD7F32, #B8860B)';
      default: return 'var(--bg-secondary)';
    }
  };

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  return (
    <div className="leaderboard-section">
  <style>{`
    .leaderboard-section {
      background-color: #000;
      color: #fff;
      font-family: 'Poppins', sans-serif;
      padding: 2rem;
      border-radius: 1rem;
    }

    .leaderboard-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .leaderboard-header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .filter-row {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .filter-btn {
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      border: 1px solid #333;
      background: #111;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-btn.active,
    .filter-btn:hover {
      background: #fff;
      color: #000;
    }

    .podium {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .podium-box {
      text-align: center;
      transition: all 0.4s ease;
    }

    .podium-box:hover {
      transform: translateY(-5px);
      filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
    }

    .podium-rank {
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .gold { background: #FFD700; width: 120px; height: 100px; font-size: 2.5rem; }
    .silver { background: #C0C0C0; width: 100px; height: 80px; font-size: 2rem; }
    .bronze { background: #CD7F32; width: 100px; height: 60px; font-size: 2rem; }

    .leaderboard-card {
      background: #111;
      border: 1px solid #222;
      border-radius: 1rem;
      padding: 1rem 1.5rem;
    }

    .leaderboard-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.8rem;
      background: #0d0d0d;
      padding: 1rem;
      border-radius: 0.6rem;
      border: 1px solid #1a1a1a;
      transition: background 0.3s ease;
    }

    .leaderboard-item:hover {
      background: #1a1a1a;
    }

    .leaderboard-rank {
      font-size: 1.5rem;
      font-weight: bold;
      width: 60px;
      text-align: center;
    }

    .leaderboard-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #444;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      margin-right: 1rem;
    }

    .leaderboard-info {
      flex: 1;
    }

    .leaderboard-info h4 {
      margin: 0;
      font-size: 1rem;
    }

    .leaderboard-meta {
      font-size: 0.85rem;
      color: #aaa;
      display: flex;
      gap: 1rem;
    }

    .leaderboard-score {
      font-weight: bold;
      font-size: 1.2rem;
    }
  `}</style>

  <div className="leaderboard-header">
    <h1>🏆 Leaderboard</h1>
    <p>Top performing students across all communities</p>
  </div>

  <div className="filter-row">
    <button className="filter-btn active">All Students</button>
    <button className="filter-btn">By Events</button>
    <button className="filter-btn">By Certificates</button>
  </div>

  <div className="podium">
    <div className="podium-box">
      <div className="podium-rank silver">🥈</div>
      <h3>Reena</h3>
      <p>860 pts</p>
    </div>

    <div className="podium-box">
      <div className="podium-rank gold">🥇</div>
      <h2>Aman</h2>
      <p>980 pts</p>
    </div>

    <div className="podium-box">
      <div className="podium-rank bronze">🥉</div>
      <h3>Zeeshan</h3>
      <p>720 pts</p>
    </div>
  </div>

  <div className="leaderboard-card">
    <h3>Complete Rankings</h3>
    <div className="leaderboard-item">
      <div className="leaderboard-rank">#1</div>
      <div className="leaderboard-avatar">A</div>
      <div className="leaderboard-info">
        <h4>Aman</h4>
        <div className="leaderboard-meta">
          <span>📅 12 Events</span>
          <span>📜 5 Certificates</span>
          <span>🏆 8 Badges</span>
        </div>
      </div>
      <div className="leaderboard-score">980</div>
    </div>

    <div className="leaderboard-item">
      <div className="leaderboard-rank">#2</div>
      <div className="leaderboard-avatar">R</div>
      <div className="leaderboard-info">
        <h4>Reena</h4>
        <div className="leaderboard-meta">
          <span>📅 10 Events</span>
          <span>📜 4 Certificates</span>
          <span>🏆 6 Badges</span>
        </div>
      </div>
      <div className="leaderboard-score">860</div>
    </div>

    <div className="leaderboard-item">
      <div className="leaderboard-rank">#3</div>
      <div className="leaderboard-avatar">Z</div>
      <div className="leaderboard-info">
        <h4>Zeeshan</h4>
        <div className="leaderboard-meta">
          <span>📅 8 Events</span>
          <span>📜 3 Certificates</span>
          <span>🏆 4 Badges</span>
        </div>
      </div>
      <div className="leaderboard-score">720</div>
    </div>
  </div>
</div>

  );
};

export default Leaderboard;