import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuth } from '../utils/auth';
import { API_BASE_URL, API_ENDPOINTS } from '../config';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    collegeName: '',
    adminSecret: ''
  });
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, formData);
      const { token, role, userId } = response.data;
      
      setAuth(token, role, userId);
      setIsRegistered(true);
      
      setTimeout(() => {
        if (role === 'user') {
          navigate('/events');
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="flex-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="form-container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>Registration Completed!</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Redirecting you to events page...</p>
        </div>
      </div>
    );
  }

  return (
    <section
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #000000, #1a1a1a)",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    padding: "2rem",
  }}
>
  <div
    style={{
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "16px",
      padding: "2.5rem",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      backdropFilter: "blur(12px)",
      animation: "fadeIn 1s ease-in-out",
      transition: "transform 0.3s ease",
    }}
  >
    <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.8rem" }}>
      Register for <span style={{ color: "#a855f7" }}>Nexus</span>
    </h2>

    {error && (
      <div
        style={{
          background: "rgba(255, 0, 0, 0.15)",
          padding: "0.75rem",
          borderRadius: "8px",
          color: "#ff6b6b",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit}>
      {[
        { type: "text", name: "name", placeholder: "Full Name" },
        { type: "email", name: "email", placeholder: "Email" },
        { type: "password", name: "password", placeholder: "Password" },
        { type: "password", name: "confirmPassword", placeholder: "Confirm Password" },
      ].map((field, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <input
            {...field}
            value={formData[field.name]}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.08)",
              color: "#fff",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) =>
              (e.target.style.border = "1px solid #a855f7")
            }
            onBlur={(e) =>
              (e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)")
            }
          />
        </div>
      ))}

      <div style={{ marginBottom: "1rem" }}>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.08)",
            color: "#fff",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="user">user</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {formData.role === "admin" && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              name="collegeName"
              placeholder="College Name"
              value={formData.collegeName}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="password"
              name="adminSecret"
              placeholder="Admin Secret Code"
              value={formData.adminSecret}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
              }}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "0.9rem",
          borderRadius: "8px",
          background: isLoading
            ? "rgba(168, 85, 247, 0.3)"
            : "linear-gradient(90deg, #a855f7, #6366f1)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontWeight: "600",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1.0)")}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>

    <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#ccc" }}>
      Already have an account?{" "}
      <a
        href="/login"
        style={{
          color: "#a855f7",
          textDecoration: "none",
          transition: "color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.color = "#c084fc")}
        onMouseLeave={(e) => (e.target.style.color = "#a855f7")}
      >
        Login
      </a>
    </p>
  </div>
</section>

  );
};

export default Register;