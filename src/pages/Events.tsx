import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { FaFacebookF as Facebook, FaTwitter as Twitter, FaInstagram as Instagram, FaLinkedinIn as Linkedin } from "react-icons/fa";

const Events: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTheme, setFilterTheme] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterTheme) params.append('theme', filterTheme);
      
      const response = await axios.get(`${API_BASE_URL}/events?${params}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error searching events:', error);
    }
  };

  const getEventStatus = (event: any) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now > endDate) return 'completed';
    if (now >= startDate) return 'ongoing';
    return 'upcoming';
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div
  className="container"
  style={{
    paddingTop: "2rem",
    paddingBottom: "2rem",
    color: "white",
    minHeight: "100vh",
    animation: "fadeIn 0.8s ease",
  }}
>
  {/* Header */}
  <div
    style={{
      textAlign: "center",
      marginBottom: "2rem",
    }}
  >
    <h1
      style={{
        fontSize: "2rem",
        fontWeight: "600",
        marginBottom: "0.5rem",
        textShadow: "0 0 10px rgba(255,255,255,0.2)",
      }}
    >
      All Events
    </h1>
    <p
      style={{
        fontSize: "1rem",
        opacity: "0.8",
      }}
    >
      Discover and join exciting events from various communities
    </p>
  </div>

  {/* Search + Filter */}
  <div
    style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "1rem",
      padding: "1.5rem",
      marginBottom: "2rem",
      boxShadow: "0 0 20px rgba(255,255,255,0.05)",
      backdropFilter: "blur(20px)",
      transition: "all 0.3s ease",
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr auto",
        gap: "1rem",
        alignItems: "end",
      }}
    >
      <div>
        <label style={{ fontSize: "0.85rem", opacity: "0.8" }}>
          Search Events
        </label>
        <input
          type="text"
          placeholder="Search by event name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.7rem",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "0.5rem",
            color: "white",
            marginTop: "0.3rem",
            outline: "none",
          }}
        />
      </div>
      <div>
        <label style={{ fontSize: "0.85rem", opacity: "0.8" }}>
          Filter by Theme
        </label>
        <select
          value={filterTheme}
          onChange={(e) => setFilterTheme(e.target.value)}
          style={{
            width: "100%",
            padding: "0.7rem",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "0.5rem",
            color: "white",
            marginTop: "0.3rem",
            outline: "none",
          }}
        >
          <option value="">All Themes</option>
          <option value="technology">Technology</option>
          <option value="science">Science</option>
          <option value="arts">Arts</option>
          <option value="sports">Sports</option>
          <option value="business">Business</option>
          <option value="cultural">Cultural</option>
        </select>
      </div>
      <button
        onClick={handleSearch}
        style={{
          padding: "0.8rem 1.5rem",
          borderRadius: "0.5rem",
          background: "linear-gradient(90deg, #000, #444)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.2)",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "linear-gradient(90deg,#222,#555)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "linear-gradient(90deg,#000,#444)")
        }
      >
        Search
      </button>
    </div>
  </div>

  {/* Events Grid */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
    }}
  >
    {events.map((event) => {
      const status = getEventStatus(event);
      return (
        <div
          key={event._id}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1rem",
            padding: "1.5rem",
            backdropFilter: "blur(20px)",
            transition: "all 0.3s ease",
            animation: "fadeUp 0.6s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-5px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: "500" }}>
              {event.name}
            </h3>
            <span
              style={{
                padding: "0.3rem 0.7rem",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                backgroundColor:
                  status === "completed"
                    ? "rgba(34,197,94,0.2)"
                    : status === "ongoing"
                    ? "rgba(234,179,8,0.2)"
                    : "rgba(59,130,246,0.2)",
                border:
                  status === "completed"
                    ? "1px solid rgba(34,197,94,0.4)"
                    : status === "ongoing"
                    ? "1px solid rgba(234,179,8,0.4)"
                    : "1px solid rgba(59,130,246,0.4)",
                color:
                  status === "completed"
                    ? "#4ade80"
                    : status === "ongoing"
                    ? "#facc15"
                    : "#60a5fa",
              }}
            >
              {status.toUpperCase()}
            </span>
          </div>

          <div style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
            <p>
              <strong>Theme:</strong> {event.theme}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(event.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(event.startDate).toLocaleTimeString()}
            </p>
            <p>
              <strong>Community:</strong> {event.communityId?.name}
            </p>
            <p>
              <strong>College:</strong> {event.communityId?.collegeName}
            </p>
          </div>

          {event.prizes?.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <strong>Prizes:</strong>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {event.prizes.map((prize, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "0.3rem 0.6rem",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "0.5rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {prize.position === 1
                      ? "🥇"
                      : prize.position === 2
                      ? "🥈"
                      : "🥉"}{" "}
                    ₹{prize.amount}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.6rem",
              alignItems: "center",
              marginTop: "0.5rem",
            }}
          >
            <button
              onClick={() => navigate(`/event/${event._id}`)}
              style={{
                background: "linear-gradient(90deg,#000,#444)",
                color: "white",
                border: "none",
                borderRadius: "0.4rem",
                padding: "0.6rem 1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg,#222,#555)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg,#000,#444)")
              }
            >
              View Details
            </button>
            <span style={{ fontSize: "0.85rem", opacity: "0.7" }}>
              {event.participants?.length || 0} registered
            </span>
          </div>

          <div
            style={{
              marginTop: "0.8rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {event.attendanceProvided && (
              <span
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "0.4rem",
                  fontSize: "0.8rem",
                }}
              >
                📋 Attendance
              </span>
            )}
            {event.certificatesProvided && (
              <span
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "0.4rem",
                  fontSize: "0.8rem",
                }}
              >
                📜 Certificate
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>

  {events.length === 0 && (
    <div style={{ textAlign: "center", padding: "3rem", opacity: "0.8" }}>
      <h3>No events found</h3>
      <p>Try adjusting your search criteria</p>
    </div>
  )}

  <style>
    {`
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `}
  </style>


  {/* 🌸 End of Landing Page */}
  <div
    style={{
      position: "relative",
      background: "#121212",
  
      color: "white",
      padding: "3rem 1rem",
      overflow: "hidden",
    }}
  >
    
  
    {/* main footer container */}
    <div
      style={{
        position: "relative",
        zIndex: 10,
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
      }}
    >
      {/* Left section */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
          Community Connect
        </h2>
        <p style={{ color: "#bfdbfe", fontSize: "0.875rem" }}>
          Empowering communities through meaningful collaboration and engagement.
        </p>
      </div>
  
      {/* Center links */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1.5rem",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        <a href="#about" style={{ color: "#bfdbfe", textDecoration: "none" }}>
          About
        </a>
        <a href="#events" style={{ color: "#bfdbfe", textDecoration: "none" }}>
          Events
        </a>
        <a href="#volunteer" style={{ color: "#bfdbfe", textDecoration: "none" }}>
          Volunteer
        </a>
        <a href="#contact" style={{ color: "#bfdbfe", textDecoration: "none" }}>
          Contact
        </a>
      </div>
  
      {/* Right social section */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <a href="#" style={{ color: "#bfdbfe" }}>
          <Facebook size={22} />
        </a>
        <a href="#" style={{ color: "#bfdbfe" }}>
          <Twitter size={22} />
        </a>
        <a href="#" style={{ color: "#bfdbfe" }}>
          <Instagram size={22} />
        </a>
        <a href="#" style={{ color: "#bfdbfe" }}>
          <Linkedin size={22} />
        </a>
      </div>
    </div>
  
    {/* bottom copyright */}
    <div
      style={{
        marginTop: "2rem",
        textAlign: "center",
        color: "#93c5fd",
        fontSize: "0.875rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      © {new Date().getFullYear()} Community Connect. All rights reserved.
    </div>
  </div>
  
  
</div>

  );
};

export default Events;