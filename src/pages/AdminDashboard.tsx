import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [communities, setCommunities] = useState([]);
  const [stats, setStats] = useState(null);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    collegeName: '',
    description: '',
    category: 'other'
  });

  useEffect(() => {
    fetchMyCommunities();
    fetchAdminStats();
  }, []);

  const fetchMyCommunities = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/communities/admin/my-communities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommunities(response.data);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/users/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.post(`${API_BASE_URL}/communities`, newCommunity, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewCommunity({ name: '', collegeName: '', description: '', category: 'other' });
      fetchMyCommunities();
      alert('Community created successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create community');
    }
  };

  const tabs = ['overview', 'communities', 'create-community', 'analytics'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return stats ? (
          <div style={{ backgroundColor: 'black', color: 'white', padding: '2rem', borderRadius: '10px' }}>
  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard Overview</h3>

  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
    gap: '1.5rem', 
    marginTop: '1.5rem' 
  }}>

    {/* Card 1 */}
    <div style={{ 
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
      borderRadius: '12px', 
      padding: '1.5rem', 
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>120</h2>
      <p style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#e5e7eb' }}>Total Students</p>
    </div>

    {/* Card 2 */}
    <div style={{ 
      background: 'linear-gradient(135deg, #10b981, #059669)', 
      borderRadius: '12px', 
      padding: '1.5rem', 
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>8</h2>
      <p style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#e5e7eb' }}>My Events</p>
    </div>

    {/* Card 3 */}
    <div style={{ 
      background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
      borderRadius: '12px', 
      padding: '1.5rem', 
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>45</h2>
      <p style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#e5e7eb' }}>Community Members</p>
    </div>

    {/* Card 4 */}
    <div style={{ 
      background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
      borderRadius: '12px', 
      padding: '1.5rem', 
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>12</h2>
      <p style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#e5e7eb' }}>Total Communities</p>
    </div>

  </div>
</div>

        ) : <div className="loading">Loading stats...</div>;

      case 'communities':
        return (
          <div>
            <h3>My Communities ({communities.length})</h3>
            <div className="grid grid-auto" style={{ marginTop: '1.5rem' }}>
              {communities.map((community: any) => (
                <div key={community._id} className="card">
                  <h4>{community.name}</h4>
                  <p>College: {community.collegeName}</p>
                  <p>Category: {community.category}</p>
                  <p>Description: {community.description}</p>
                  
                  <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-active">
                        {community.stats?.totalMembers || 0} Members
                      </span>
                      <span className="badge badge-upcoming">
                        {community.stats?.totalEvents || 0} Events
                      </span>
                      <span className="badge badge-completed">
                        {community.stats?.pendingQueries || 0} Pending Queries
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => navigate(`/community/${community._id}`)}
                      className="btn-primary" 
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      📊 Manage
                    </button>
                    <button 
                      onClick={() => navigate(`/attendance/${community._id}`)}
                      className="btn-secondary" 
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      📋 Attendance
                    </button>
                    {community.stats?.pendingQueries > 0 && (
                      <span className="badge badge-upcoming" style={{ fontSize: '0.75rem' }}>
                        {community.stats.pendingQueries} pending queries
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'create-community':
        return (
          <div>
            <h3>Create New Community</h3>
            <div className="card" style={{ maxWidth: '600px', marginTop: '1.5rem' }}>
              <form onSubmit={handleCreateCommunity}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Community Name
                  </label>
                  <input
                    type="text"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                    required
                    className="input-field"
                    placeholder="e.g., Tech Innovators Community"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    College Name
                  </label>
                  <input
                    type="text"
                    value={newCommunity.collegeName}
                    onChange={(e) => setNewCommunity({ ...newCommunity, collegeName: e.target.value })}
                    required
                    className="input-field"
                    placeholder="e.g., MIT College of Engineering"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Category
                  </label>
                  <select
                    value={newCommunity.category}
                    onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="technology">Technology</option>
                    <option value="science">Science</option>
                    <option value="arts">Arts</option>
                    <option value="sports">Sports</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Description
                  </label>
                  <textarea
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Describe your community's purpose and goals..."
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Create Community
                </button>
              </form>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div style={{ backgroundColor: 'black', color: 'white', padding: '2rem', borderRadius: '10px' }}>
  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Analytics & Reports</h3>

  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '1.5rem' 
  }}>
    
    {/* Card 1 */}
    <div style={{ 
      backgroundColor: '#1f2937', 
      padding: '1.5rem', 
      borderRadius: '10px', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
    }}>
      <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Community Alpha</h4>
      <div style={{ lineHeight: '1.8' }}>
        <p>📊 Total Members: 120</p>
        <p>🎉 Total Events: 8</p>
        <p>❓ Total Queries: 23</p>
        <p>⏳ Pending Queries: 5</p>
        <p>💬 Chat Messages: 340</p>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: '#374151', 
          borderRadius: '4px', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            width: '80%', 
            height: '100%', 
            background: 'linear-gradient(90deg, #10b981, #059669)' 
          }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Member Growth</p>
      </div>
    </div>

    {/* Card 2 */}
    <div style={{ 
      backgroundColor: '#1f2937', 
      padding: '1.5rem', 
      borderRadius: '10px', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
    }}>
      <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Community Beta</h4>
      <div style={{ lineHeight: '1.8' }}>
        <p>📊 Total Members: 75</p>
        <p>🎉 Total Events: 5</p>
        <p>❓ Total Queries: 12</p>
        <p>⏳ Pending Queries: 2</p>
        <p>💬 Chat Messages: 200</p>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: '#374151', 
          borderRadius: '4px', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            width: '60%', 
            height: '100%', 
            background: 'linear-gradient(90deg, #10b981, #059669)' 
          }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Member Growth</p>
      </div>
    </div>

  </div>
</div>

        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div 
  style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
    color: '#fff',
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}
>
  {/* Header */}
  <div 
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '1.5rem 2rem',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 0 30px rgba(0,0,0,0.3)'
    }}
  >
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.3rem' }}>Admin Dashboard</h1>
      <p style={{ opacity: '0.8', fontSize: '1rem' }}>Manage your communities, events, and members</p>
    </div>
    <div 
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00bfff, #007acc)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '1.2rem',
        boxShadow: '0 0 20px rgba(0,191,255,0.5)',
        color: '#000',
        cursor: 'pointer',
        transition: '0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.boxShadow = '0 0 35px rgba(0,191,255,0.8)'}
      onMouseOut={(e) => e.target.style.boxShadow = '0 0 20px rgba(0,191,255,0.5)'}
    >
      A
    </div>
  </div>

  {/* Navigation Tabs */}
  <div 
    style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '1rem 1.5rem',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(15px)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.8rem'
    }}
  >
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        style={{
          background: activeTab === tab ? '#00bfff' : 'transparent',
          color: activeTab === tab ? '#000' : '#fff',
          border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.2)',
          padding: '0.6rem 1.2rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          textTransform: 'capitalize',
          letterSpacing: '0.5px',
          transition: '0.3s ease'
        }}
        onMouseOver={(e) => {
          if (activeTab !== tab) {
            e.target.style.background = 'rgba(255,255,255,0.1)';
          }
        }}
        onMouseOut={(e) => {
          if (activeTab !== tab) {
            e.target.style.background = 'transparent';
          }
        }}
      >
        {tab.replace('-', ' ')}
      </button>
    ))}
  </div>

  {/* Tab Content */}
  <div 
    style={{
      flex: 1,
      background: 'rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 0 30px rgba(0,0,0,0.3)',
      animation: 'fadeIn 0.5s ease-in-out'
    }}
  >
    {renderTabContent()}
  </div>
</div>

  );
};

export default AdminDashboard;