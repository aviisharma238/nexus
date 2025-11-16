import React, { useState, useEffect } from 'react';
import { getToken, getRole } from '../utils/auth';
import axios from 'axios';
import { API_BASE_URL } from '../config';

interface ProfileData {
  user: any;
  events: {
    ongoing: any[];
    upcoming: any[];
    completed: any[];
  };
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [activities, setActivities] = useState([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const role = getRole();

  useEffect(() => {
    fetchProfile();
    if (activeTab === 'activity') fetchActivity();
    if (role === 'admin') fetchAdminStats();
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchActivity = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/users/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/users/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const tabs = role === 'admin' 
    ? ['events', 'analytics', 'activity', 'communities']
    : ['events', 'certificates', 'badges', 'activity', 'communities'];

  const renderTabContent = () => {
    if (!profileData) return <div className="loading">Loading...</div>;

    switch (activeTab) {
      case 'events':
        return (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h3>Ongoing Events (8) </h3>
              <div className="grid grid-auto" style={{ marginTop: '1rem' }}>
                {profileData.events.ongoing.map((event: any) => (
                  <div key={event._id} className="card">
                    <h4>{event.name}</h4>
                    <p>Location: {event.location}</p>
                    <p>Ends: {new Date(event.endDate).toLocaleDateString()}</p>
                    <span className="badge badge-active">Active</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3>Upcoming Events (14)</h3>
              <div className="grid grid-auto" style={{ marginTop: '1rem' }}>
                {profileData.events.upcoming.map((event: any) => (
                  <div key={event._id} className="card">
                    <h4>{event.name}</h4>
                    <p>Location: {event.location}</p>
                    <p>Starts: {new Date(event.startDate).toLocaleDateString()}</p>
                    <span className="badge badge-upcoming">Upcoming</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3>Completed Events (10)</h3>
              <div className="grid grid-auto" style={{ marginTop: '1rem' }}>
                {profileData.events.completed.map((event: any) => (
                  <div key={event._id} className="card">
                    <h4>{event.name}</h4>
                    <p>Location: {event.location}</p>
                    <p>Completed: {new Date(event.endDate).toLocaleDateString()}</p>
                    <span className="badge badge-completed">Completed</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'certificates':
        return role === 'admin' ? null : (
          <div>
            <h3>My Certificates ({profileData.user.certificates.length})</h3>
            <div className="grid grid-auto" style={{ marginTop: '1rem' }}>
              {profileData.user.certificates.map((cert: any, index: number) => (
                <div key={index} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📜</div>
                  <h4>{cert.eventId?.name || 'Certificate'}</h4>
                  <p>Earned: {new Date(cert.earnedDate).toLocaleDateString()}</p>
                  <button 
                    onClick={() => window.open(`${API_BASE_URL}/certificates/download/${cert.eventId}`, '_blank')}
                    className="btn-primary"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'badges':
        return role === 'admin' ? null : (
          <div>
            <h3>My Badges ({profileData.user.badges.length})</h3>
            <div className="grid grid-auto" style={{ marginTop: '1rem' }}>
              {profileData.user.badges.map((badge: any, index: number) => (
                <div key={index} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
                  <h4>{badge.name}</h4>
                  <p>Earned: {new Date(badge.earnedDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'activity':
        return (
          <div>
            <h3>Activity Timeline</h3>
            <div style={{ marginTop: '1rem' }}>
              {activities.map((activity: any, index: number) => (
                <div key={index} className="timeline-item">
                  <h4>{activity.title}</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {new Date(activity.date).toLocaleDateString()} • {activity.community || activity.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'communities':
        return (
          <div>
            <h3>My Communities ({profileData.user.communitiesJoined.length})</h3>
            <div className="grid grid-auto" style={{ marginTop: '1rem' }}>
              {profileData.user.communitiesJoined.map((community: any) => (
                <div key={community._id} className="card">
                  <h4>{community.name}</h4>
                  <p>College: {community.collegeName}</p>
                  <button className="btn-secondary">View Community</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return adminStats ? (
          <div>
            <h3>Event Analytics & Success Metrics</h3>
            <div className="grid grid-stats" style={{ marginTop: '1.5rem' }}>
              <div className="stat-card" style={{ '--bg-from': '#10b981', '--bg-to': '#059669' } as any}>
                <h2>18</h2>
                <p>Total Events Created</p>
              </div>
              <div className="stat-card" style={{ '--bg-from': '#3b82f6', '--bg-to': '#2563eb' } as any}>
                <h2>85%</h2>
                <p>Avg Success Rate</p>
              </div>
              <div className="stat-card" style={{ '--bg-from': '#f59e0b', '--bg-to': '#d97706' } as any}>
                <h2>5000+</h2>
                <p>Active Participants</p>
              </div>
              <div className="stat-card" style={{ '--bg-from': '#8b5cf6', '--bg-to': '#7c3aed' } as any}>
                <h2>4.1/5</h2>
                <p>Avg Event Rating</p>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h4>Event Performance Insights</h4>
              <div className="grid grid-auto" style={{ marginTop: '1rem' }}>
                <div className="card">
                  <h4>📈 Participation Trends</h4>
                  <p>Higher participation in weekend events (78% vs 65%)</p>
                  <p>Tech events show 92% completion rate</p>
                </div>
                <div className="card">
                  <h4>❓ Query Analysis</h4>
                  <p>Most queries: Certificate issues (35%)</p>
                  <p>Avg resolution time: 2.3 hours</p>
                  <p>Technical issues decreased by 40%</p>
                </div>
                <div className="card">
                  <h4>📝 Feedback Summary</h4>
                  <p>"Great organization and content" - 89%</p>
                  <p>"Clear instructions" - 92%</p>
                  <p>"Would recommend" - 87%</p>
                </div>
                <div className="card">
                  <h4>🎯 Success Factors</h4>
                  <p>Events with prizes: +23% participation</p>
                  <p>Clear location info: -60% location queries</p>
                  <p>Early reminders: +15% attendance</p>
                </div>
              </div>
            </div>
          </div>
        ) : <div className="loading">Loading analytics...</div>;

      default:
        return <div>Select a tab</div>;
    }
  };

  if (!profileData) return <div className="loading">Loading profile...</div>;

  return (
    <div
  style={{
    paddingTop: "2rem",
    paddingBottom: "2rem",
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
  }}
>
  {/* Profile Header */}
  <div
    style={{
      backgroundColor: "#111",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
      marginBottom: "2rem",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {/* Avatar */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            color: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.8rem",
            fontWeight: "bold",
          }}
        >
          {profileData.user.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>
            {profileData.user.name}
          </h2>
          <p style={{ color: "#aaa", marginBottom: "0.3rem" }}>
            {profileData.user.email}
          </p>
          <p style={{ color: "#ccc", marginBottom: "0.3rem" }}>
            Role:{" "}
            <span
              style={{
                backgroundColor:
                  role === "admin" ? "#fff" : "rgba(255,255,255,0.1)",
                color: role === "admin" ? "#000" : "#fff",
                padding: "0.3rem 0.7rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "600",
              }}
            >
              {role?.toUpperCase()}
            </span>
          </p>
          {profileData.user.collegeName && (
            <p style={{ color: "#aaa" }}>
              organize by : {profileData.user.collegeName}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Tabs */}
  <div
    style={{
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      marginBottom: "2rem",
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap",
      justifyContent: "center",
    }}
  >
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        style={{
          backgroundColor:
            activeTab === tab ? "#fff" : "rgba(255,255,255,0.1)",
          color: activeTab === tab ? "#000" : "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "0.6rem 1.2rem",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor =
            activeTab === tab ? "#eee" : "#222")
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor =
            activeTab === tab ? "#fff" : "rgba(255,255,255,0.1)")
        }
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Tab Content */}
  <div style={{ backgroundColor: "#111", padding: "1.5rem", borderRadius: "10px" }}>
    {renderTabContent()}
  </div>
</div>

  );
};

export default Profile;