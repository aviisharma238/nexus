"use client";
import React, { useState, useEffect, forwardRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import { getToken } from "../utils/auth";
import Card from "../components/Card";
import { FaFacebookF as Facebook, FaTwitter as Twitter, FaInstagram as Instagram, FaLinkedinIn as Linkedin } from "react-icons/fa";


// 🌸 Reusable Button Component
const Button = forwardRef(
  (
    {
      variant = "default",
      size = "default",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      borderRadius: "8px",
      fontWeight: 500,
      transition: "all 0.3s ease",
      cursor: "pointer",
      outline: "none",
      border: "none",
    };

    const variants = {
      default: { backgroundColor: "#fff", color: "#000" },
      secondary: { backgroundColor: "#1f1f1f", color: "#fff" },
      ghost: { backgroundColor: "transparent", color: "#fff" },
      gradient: {
        background: "linear-gradient(90deg, #fff, #777)",
        color: "#000",
        transform: "scale(1)",
      },
    };

    const sizes = {
      default: { height: "40px", padding: "0.5rem 1rem", fontSize: "0.875rem" },
      sm: { height: "36px", padding: "0.5rem 1.25rem", fontSize: "0.875rem" },
      lg: { height: "48px", padding: "0.75rem 2rem", fontSize: "1rem" },
    };

    return (
      <button
        ref={ref}
        style={{ ...baseStyle, ...variants[variant], ...sizes[size] }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// ➤ Arrow Icon
const ArrowRight = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

// 💫 Combined Landing + Hero Section
const Landing = memo(() => {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
    fetchEvents();
    fetchUserCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.COMMUNITIES.GET_ALL}`
      );
      setCommunities(response.data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.EVENTS.GET_ALL}`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchUserCommunities = async () => {
    try {
      const token = getToken();
      if (token) {
        const response = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserCommunities(response.data.user.communitiesJoined || []);
      }
    } catch (error) {
      console.error("Error fetching user communities:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.EVENTS.GET_ALL}?search=${searchTerm}`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error searching events:", error);
    }
  };

  const joinCommunity = async (communityId) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/communities/${communityId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Joined community successfully!");
      fetchCommunities();
      fetchUserCommunities();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to join community");
    }
  };

  const isUserMember = (communityId) => {
    return userCommunities.some((c) => c._id === communityId);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* 🖤 HERO SECTION */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 1.5rem",
          textAlign: "center",
          position: "relative",
          background: "radial-gradient(circle at center, #111 0%, #000 80%)",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            lineHeight: "1.2",
            fontWeight: "700",
            background: "linear-gradient(90deg, #fff, #777)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
            letterSpacing: "-0.03em",
          }}
        >
         Empowering communities to create 
 <br /> impactful events that inspire connection and engagement
        </h1>

        <p
          style={{
            maxWidth: "600px",
            color: "#bbb",
            fontSize: "1.1rem",
            marginBottom: "2.5rem",
          }}
        >
          Unite Your Community with Seamless Event Planning.
        </p>

        <Button 
          onClick={() => navigate("/community/:communityId/create-event")} variant="gradient" size="lg">
          Create your first event <ArrowRight />
        </Button> 
     

        <img
          src="https://i.postimg.cc/SKcdVTr1/Dashboard2.png"
          alt="Hero"
          style={{
            marginTop: "4rem",
            width: "100%",
            maxWidth: "800px",
            borderRadius: "1rem",
            boxShadow: "0 0 30px rgba(255,255,255,0.1)",
          }}
        />
      </section>

      {/* 🌐 SEARCH + COMMUNITIES + EVENTS */}
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: "700",
            background: "linear-gradient(90deg, #fff, #777)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
          }}
        >
          Nexus
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#bbb", marginBottom: "2rem" }}>
          Empowering locals to plan, promote, and participate together. ✨
        </p>

        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <input
            type="text"
            placeholder="Search events "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              backgroundColor: "#111",
              border: "1px solid #333",
              color: "#eee",
              outline: "none",
              fontSize: "0.95rem",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: "#fff",
              color: "#000",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* 🌟 Featured Communities */}
      <div style={{ marginTop: "5rem" }}>
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
          Featured Communities
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {communities.map((community) => (
            <div
              key={community._id}
              style={{
                backgroundColor: "#111",
                border: "1px solid #222",
                borderRadius: "1rem",
                padding: "1.5rem",
                transition: "all 0.3s ease",
                boxShadow: "0 0 10px rgba(255,255,255,0.05)",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                {community.name}
              </h3>
              <p style={{ color: "#bbb" }}>🏫 {community.collegeName}</p>
              <p style={{ color: "#bbb" }}>
                👥 Members: {community.members?.length || 0}
              </p>
              <p style={{ color: "#bbb", marginBottom: "1rem" }}>
                🎉 Events: {community.events?.length || 0}
              </p>

              {isUserMember(community._id) ? (
                <button
                  onClick={() => navigate(`/community/${community._id}`)}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#fff",
                    color: "#000",
                    fontWeight: "600",
                    border: "none",
                  }}
                >
                  View Community
                </button>
              ) : (
                <button
                  onClick={() => joinCommunity(community._id)}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "transparent",
                    color: "#fff",
                    border: "1px solid #fff",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Join Community
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 🎉 Recent Events */}
      <div style={{ marginTop: "5rem" }}>
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
          Recent Events
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {events.slice(0, 6).map((event) => (
            <div
              key={event._id}
              style={{
                backgroundColor: "#111",
                border: "1px solid #222",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow: "0 0 10px rgba(255,255,255,0.05)",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                {event.name}
              </h3>
              <p style={{ color: "#bbb" }}>🎭 Theme: {event.theme}</p>
              <p style={{ color: "#bbb" }}>📍 {event.location}</p>
              <p style={{ color: "#bbb" }}>
                📅 {new Date(event.startDate).toLocaleDateString()}
              </p>
              <p style={{ color: "#bbb", marginBottom: "0.75rem" }}>
                🏘️ {event.communityId?.name}
              </p>

              <span
                style={{
                  display: "inline-block",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  backgroundColor: event.certificateAvailable ? "#fff" : "#222",
                  color: event.certificateAvailable ? "#000" : "#aaa",
                }}
              >
                {event.certificateAvailable
                  ? "Certificate Available"
                  : "No Certificate"}
              </span>
            </div>
          ))}
        </div>
      </div>

        {/* 🌸 Card */}
      <div
  style={{
    padding: "6rem 1rem",
    background: "linear-gradient(to bottom, #000000, #000000)",
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* background glow */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(circle at top left, #c7d2fe 0%, transparent 70%)",
      zIndex: -1,
    }}
  ></div>

  {/* heading */}
  <div
    style={{
      textAlign: "center",
      marginBottom: "4rem",
      transition: "all 0.8s ease",
    }}
  >
    <h2
      style={{
        fontSize: "3rem",
        fontWeight: 700,
        color: "#ffffff",
        marginBottom: "0.75rem",
      }}
    >
      Recent Events
    </h2>
    <p
      style={{
        color: "#ffffff",
        fontSize: "1.125rem",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      Explore the amazing experiences and community highlights.
    </p>
  </div>

  {/* cards */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2.5rem",
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >
    {/* card 1 */}
    <div
      style={{
        borderRadius: "24px",
        background: "linear-gradient(135deg, #1f1f1f, #111112)",
        padding: "2px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
      }}
    >
      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          height: "100%",
          padding: "1.8rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          Community Clean-Up Drive
        </h3>
        <p style={{ color: "#bbb", marginBottom: "0.75rem" }}>
          Volunteers joined together to make our surroundings cleaner and
          greener.
        </p>
        <p style={{ color: "#bbb" }}>📅 October 14, 2025</p>
        <p style={{ color: "#bbb" }}>📍 City Park, Downtown</p>

        <div
          style={{
            marginTop: "1.5rem",
            bottom: "0",
            height: "4px",
            width: "100%",
            borderRadius: "6px",
            background:
              "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
            opacity: 0.7,
          }}
        ></div>
      </div>
    </div>

    {/* card 2 */}
    <div
      style={{
        borderRadius: "24px",
        background: "linear-gradient(135deg, #1f1f1f, #111112)",
        padding: "2px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
      }}
    >
      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          height: "100%",
          padding: "1.8rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          Tech Innovation Fair
        </h3>
        <p style={{ color: "#bbb", marginBottom: "0.75rem" }}>
          Showcasing the latest innovations and startup projects by local youth.
        </p>
        <p style={{ color: "#bbb" }}>📅 November 3, 2025</p>
        <p style={{ color: "#bbb" }}>📍 CSIT Auditorium</p>

        <div
          style={{
            marginTop: "1.5rem",
            height: "4px",
            bottom: "0",
            width: "100%",
            borderRadius: "6px",
            background:
              "linear-gradient(to right, #10b981, #06b6d4, #3b82f6)",
            opacity: 0.7,
          }}
        ></div>
      </div>
    </div>

    {/* card 3 */}
    <div
      style={{
        borderRadius: "24px",
        background: "linear-gradient(135deg, #1f1f1f, #111112)",
        padding: "2px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
      }}
    >
      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          height: "100%",
          padding: "1.8rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          Art & Culture Fest
        </h3>
        <p style={{ color: "#bbb", marginBottom: "0.75rem" }}>
          A colorful celebration of creativity, performance, and local talent.
        </p>
        <p style={{ color: "#bbb" }}>📅 December 1, 2025</p>
        <p style={{ color: "#bbb" }}>📍 Central Hall, CSIT Campus</p>

        <div
          style={{
            marginTop: "1.5rem",
            height: "4px",
            width: "100%",
            borderRadius: "6px",
            background:
              "linear-gradient(to right, #f59e0b, #f97316, #ef4444)",
            opacity: 0.7,
          }}
        ></div>
      </div>
    </div>
    {/* card 3 */}
    <div
      style={{
        borderRadius: "24px",
        background: "linear-gradient(135deg, #1f1f1f, #111112)",
        padding: "2px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
      }}
    >
      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          height: "100%",
          padding: "1.8rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          Art & Culture Fest
        </h3>
        <p style={{ color: "#bbb", marginBottom: "0.75rem" }}>
          A colorful celebration of creativity, performance, and local talent.
        </p>
        <p style={{ color: "#bbb" }}>📅 December 1, 2025</p>
        <p style={{ color: "#bbb" }}>📍 Central Hall, CSIT Campus</p>

        <div
          style={{
            marginTop: "1.5rem",
            height: "4px",
            width: "100%",
            borderRadius: "6px",
            background:
              "linear-gradient(to right, #f59e0b, #f97316, #ef4444)",
            opacity: 0.7,
          }}
        ></div>
      </div>
    </div>
    {/* card 1 */}
    <div
      style={{
        borderRadius: "24px",
        background: "linear-gradient(135deg, #1f1f1f, #111112)",
        padding: "2px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
      }}
    >
      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          height: "100%",
          padding: "1.8rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          Community Clean-Up Drive
        </h3>
        <p style={{ color: "#bbb", marginBottom: "0.75rem" }}>
          Volunteers joined together to make our surroundings cleaner and
          greener.
        </p>
        <p style={{ color: "#bbb" }}>📅 October 14, 2025</p>
        <p style={{ color: "#bbb" }}>📍 City Park, Downtown</p>

        <div
          style={{
            marginTop: "1.5rem",
            bottom: "0",
            height: "4px",
            width: "100%",
            borderRadius: "6px",
            background:
              "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
            opacity: 0.7,
          }}
        ></div>
      </div>
    </div>

    {/* card 2 */}
    <div
      style={{
        borderRadius: "24px",
        background: "linear-gradient(135deg, #1f1f1f, #111112)",
        padding: "2px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
      }}
    >
      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          height: "100%",
          padding: "1.8rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          Tech Innovation Fair
        </h3>
        <p style={{ color: "#bbb", marginBottom: "0.75rem" }}>
          Showcasing the latest innovations and startup projects by local youth.
        </p>
        <p style={{ color: "#bbb" }}>📅 November 3, 2025</p>
        <p style={{ color: "#bbb" }}>📍 CSIT Auditorium</p>

        <div
          style={{
            marginTop: "1.5rem",
            height: "4px",
            bottom: "0",
            width: "100%",
            borderRadius: "6px",
            background:
              "linear-gradient(to right, #10b981, #06b6d4, #3b82f6)",
            opacity: 0.7,
          }}
        ></div>
      </div>
    </div>
  </div>
</div>

{/* 🌸 End of Landing Page */}
<div
  style={{
    position: "relative",
    background: "linear-gradient(to bottom, #000000, #000000)",

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
});

export default Landing;
