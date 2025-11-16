import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const CreateCommunity: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    collegeName: '',
    description: '',
    category: 'technology'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getToken();
      await axios.post(`${API_BASE_URL}/communities`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Community created successfully!');
      navigate('/communities');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
  style={{ 
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem'
  }}
>
  <div 
    style={{
      width: '100%',
      maxWidth: '600px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '2.5rem',
      boxShadow: '0 0 40px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease'
    }}
  >
    <div 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}
    >
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Create New Community</h1>
      <button
        onClick={() => navigate('/communities')}
        style={{
          background: 'transparent',
          color: '#00bfff',
          border: '1px solid #00bfff',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontWeight: '500',
          transition: '0.3s ease',
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#00bfff';
          e.target.style.color = '#000';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = '#00bfff';
        }}
      >
        Back
      </button>
    </div>

    <form onSubmit={handleSubmit}>
      {/* Creator Name */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Community Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your name as community "
          required
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
            transition: '0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#00bfff'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
        />
      </div>

      {/* College Name */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Creator Name
        </label>
        <input
          type="text"
          value={formData.collegeName}
          onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
          placeholder="creator name"
          required
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
            transition: '0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#00bfff'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your community's purpose and activities..."
          required
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '1rem',
            resize: 'none',
            outline: 'none',
            transition: '0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#00bfff'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? 'rgba(0,191,255,0.4)' : '#00bfff',
          color: '#000',
          border: 'none',
          borderRadius: '10px',
          padding: '0.9rem',
          fontWeight: '700',
          fontSize: '1.1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: '0.3s ease',
        }}
        onMouseOver={(e) => {
          if (!loading) e.target.style.background = '#1ec8ff';
        }}
        onMouseOut={(e) => {
          if (!loading) e.target.style.background = '#00bfff';
        }}
      >
        {loading ? 'Creating...' : 'Create Community'}
      </button>
    </form>
  </div>
</div>

  );
};

export default CreateCommunity;