import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuth } from '../utils/auth';
import { API_BASE_URL, API_ENDPOINTS } from '../config';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, formData);
      const { token, role, userId } = response.data;
      
      setAuth(token, role, userId);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
   <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#000", // black background
    color: "#fff",
  }}
>
  <div
    style={{
      backgroundColor: "#111",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
      width: "100%",
      maxWidth: "400px",
    }}
  >
    <h2
      style={{
        textAlign: "center",
        marginBottom: "2rem",
        color: "#fff",
        letterSpacing: "1px",
      }}
    >
      Login to Nexus
    </h2>

    {error && (
      <div
        style={{
          backgroundColor: "#ff4d4d",
          padding: "0.75rem",
          borderRadius: "8px",
          textAlign: "center",
          color: "#fff",
          marginBottom: "1rem",
          fontSize: "0.9rem",
        }}
      >
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #444",
            backgroundColor: "#000",
            color: "#fff",
            outline: "none",
            fontSize: "1rem",
          }}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #444",
            backgroundColor: "#000",
            color: "#fff",
            outline: "none",
            fontSize: "1rem",
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "0.8rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#fff",
          color: "#000",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#ccc")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
      >
        Login
      </button>
    </form>

    <p style={{ textAlign: "center", marginTop: "1rem", color: "#aaa" }}>
      Don’t have an account?{" "}
      <a href="/register" style={{ color: "#fff", textDecoration: "underline" }}>
        Register
      </a>
    </p>
  </div>
</div>

  );
};

export default Login;