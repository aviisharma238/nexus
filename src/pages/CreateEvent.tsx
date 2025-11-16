import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../utils/auth';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: '',
    attendanceProvided: false,
    certificatesProvided: false,
    theme: '',
    description: ''
  });
  const [prizes, setPrizes] = useState<{ position: number; amount: number }[]>([]);
  const [registrationFields, setRegistrationFields] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const addPrize = () => {
    if (prizes.length < 3) {
      setPrizes([...prizes, { position: prizes.length + 1, amount: 0 }]);
    }
  };

  const removePrize = (index: number) => {
    const newPrizes = prizes.filter((_, i) => i !== index);
    // Reorder positions
    const reorderedPrizes = newPrizes.map((prize, i) => ({ ...prize, position: i + 1 }));
    setPrizes(reorderedPrizes);
  };

  const updatePrizeAmount = (index: number, amount: number) => {
    const newPrizes = [...prizes];
    newPrizes[index].amount = amount;
    setPrizes(newPrizes);
  };

  const addRegistrationField = () => {
    setRegistrationFields([...registrationFields, {
      fieldName: '',
      fieldType: 'text',
      isRequired: false,
      options: [],
      placeholder: ''
    }]);
  };

  const removeRegistrationField = (index: number) => {
    setRegistrationFields(registrationFields.filter((_, i) => i !== index));
  };

  const updateRegistrationField = (index: number, field: string, value: any) => {
    const newFields = [...registrationFields];
    newFields[index][field] = value;
    setRegistrationFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Validation
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const deadline = new Date(formData.registrationDeadline);

      if (end <= start) {
        setError('End date must be after start date');
        return;
      }

      if (deadline >= start) {
        setError('Registration deadline must be before start date');
        return;
      }

      // Validate prizes
      for (let prize of prizes) {
        if (prize.amount <= 0) {
          setError('Prize amount must be greater than 0');
          return;
        }
      }

      const token = getToken();
      await axios.post(`${API_BASE_URL}/events`, {
        ...formData,
        prizes,
        registrationFields,
        communityId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Event created successfully!');
      navigate(`/community/${communityId}`);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create event');
    }
  };

  const themes = [
    'Artificial Intelligence',
    'Web Development',
    'Data Science',
    'Cybersecurity',
    'Mobile Development',
    'Cloud Computing',
    'Blockchain',
    'Machine Learning',
    'DevOps',
    'UI/UX Design',
    'Other'
  ];

  return (
    <div
  style={{
    padding: "4rem 1rem",
    background: "linear-gradient(to bottom, #000, #0a0a0a)",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  }}
>
  <div style={{ textAlign: "center", marginBottom: "3rem" }}>
    <h1 style={{ fontSize: "2.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
      ✨ Create New Event
    </h1>
    <p style={{ color: "#aaa", fontSize: "1rem" }}>
      Fill in the details to organize your next amazing community event 💫
    </p>
  </div>

  <div
    style={{
      maxWidth: "900px",
      margin: "0 auto",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "1.2rem",
      padding: "2.5rem",
      boxShadow: "0 0 25px rgba(0,0,0,0.3)",
      backdropFilter: "blur(16px)",
    }}
  >
    <form onSubmit={handleSubmit}>
      {/* 🎯 Event Info */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#fff" }}>
          Event Information
        </h3>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem" }}>Event Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., AI Workshop 2024"
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "rgba(255,255,255,0.07)",
              color: "#fff",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem" }}>Theme *</label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "rgba(255,255,255,0.07)",
              color: "#fff",
            }}
          >
            <option value="">Select a theme</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem" }}>Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g., Main Auditorium or https://zoom.us/..."
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "rgba(255,255,255,0.07)",
              color: "#fff",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem" }}>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe your event..."
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "rgba(255,255,255,0.07)",
              color: "#fff",
            }}
          />
        </div>
      </div>

      {/* 📅 Date & Time */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#fff" }}>Date & Time</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.2rem",
          }}
        >
          {["startDate", "endDate", "registrationDeadline"].map((field, i) => (
            <div key={i}>
              <label style={{ display: "block", marginBottom: "0.4rem" }}>
                {field === "startDate"
                  ? "Start Date & Time *"
                  : field === "endDate"
                  ? "End Date & Time *"
                  : "Registration Deadline *"}
              </label>
              <input
                type="datetime-local"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #333",
                  backgroundColor: "rgba(255,255,255,0.07)",
                  color: "#fff",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ⚙️ Options */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#fff" }}>
          Event Options
        </h3>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              name="attendanceProvided"
              checked={formData.attendanceProvided}
              onChange={handleChange}
            />
            <span>Attendance Tracking</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              name="certificatesProvided"
              checked={formData.certificatesProvided}
              onChange={handleChange}
            />
            <span>Certificates Provided</span>
          </label>
        </div>
      </div>

      {/* 🏆 Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <button
          type="button"
          onClick={() => navigate(`/community/${communityId}`)}
          style={{
            padding: "0.7rem 1.5rem",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "#fff",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          style={{
            padding: "0.7rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(to right, #2563eb, #1e40af)",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(37,99,235,0.4)",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Create Event
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default CreateEvent;