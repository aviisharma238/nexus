import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getRole, clearAuth } from "../utils/auth";
import { FaInfinity, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const role = getRole();

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.8rem 1.5rem",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(0,0,0,0.25)",
        background: "rgba(0,0,0,0.3)",
      }}
    >
      {/* 🌸 Left Logo */}
      <div
        style={{
          fontSize: "1.6rem",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "1px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        Nexus
      </div>

      {/* 🌈 Center Menu (Desktop) */}
      {!isMobile && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "50px",
            padding: "0.6rem 2rem",
            boxShadow: "0 0 25px rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <NavItem to="/" label="Home" />
          <NavItem to="/communities" label="Communities" />
          <NavItem to="/events" label="Events" />
          {role !== "admin" && <NavItem to="/leaderboard" label="Leaderboard" />}
          <NavItem to="/profile" label="Profile" />

          {authenticated ? (
            <button
              onClick={handleLogout}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.35)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
              }
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              style={loginLinkStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.4)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* 🌸 Right Infinity Icon / Mobile Toggle */}
      {isMobile ? (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      ) : (
        <button
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
          }
        >
          <FaInfinity size={22} />
        </button>
      )}

      {/* 🌸 Mobile Dropdown Menu */}
      {menuOpen && isMobile && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "1.2rem 2rem",
            boxShadow: "0 0 25px rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            width: "80%",
          }}
        >
          <NavItem to="/" label="Home" onClick={() => setMenuOpen(false)} />
          <NavItem
            to="/communities"
            label="Communities"
            onClick={() => setMenuOpen(false)}
          />
          <NavItem
            to="/events"
            label="Events"
            onClick={() => setMenuOpen(false)}
          />
          {role !== "admin" && (
            <NavItem
              to="/leaderboard"
              label="Leaderboard"
              onClick={() => setMenuOpen(false)}
            />
          )}
          <NavItem
            to="/profile"
            label="Profile"
            onClick={() => setMenuOpen(false)}
          />
          {authenticated ? (
            <button onClick={handleLogout} style={buttonStyle}>
              Logout
            </button>
          ) : (
            <Link to="/login" style={loginLinkStyle}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

// 🌸 Helper Components & Styles
const NavItem = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    style={{
      color: "white",
      textDecoration: "none",
      fontWeight: 500,
      letterSpacing: "0.5px",
      transition: "color 0.3s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = "#a5b4fc")}
    onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
  >
    {label}
  </Link>
);

const buttonStyle = {
  background: "rgba(255, 255, 255, 0.2)",
  border: "none",
  padding: "0.5rem 1.2rem",
  borderRadius: "30px",
  color: "white",
  fontWeight: 500,
  cursor: "pointer",
  transition: "0.3s",
};

const loginLinkStyle = {
  background: "rgba(255,255,255,0.25)",
  color: "white",
  textDecoration: "none",
  padding: "0.5rem 1.2rem",
  borderRadius: "30px",
  fontWeight: 600,
  transition: "0.3s",
};

export default Navbar;
