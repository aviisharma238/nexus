import React, { useState } from "react";
import { getToken } from "../utils/auth";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { motion, AnimatePresence } from "framer-motion";

const QuickEditEvent = ({ event, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: event.name,
    location: event.location,
    registrationDeadline: new Date(event.registrationDeadline)
      .toISOString()
      .slice(0, 16),
    description: event.description,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getToken();
      await axios.put(`${API_BASE_URL}/events/${event._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          style={{
            width: "100%",
            maxWidth: "480px",
            background: "rgba(255, 255, 255, 0.12)",
            borderRadius: "20px",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 0 40px rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            padding: "2rem",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ fontWeight: 600, fontSize: "1.4rem" }}>
              ✨ Quick Edit Event
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "1.4rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit}>
            <FormField
              label="Event Name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <FormField
              label="Location"
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <FormField
              label="Registration Deadline"
              type="datetime-local"
              value={formData.registrationDeadline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registrationDeadline: e.target.value,
                })
              }
            />
            <FormArea
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "0.6rem 1.5rem",
                  borderRadius: "30px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg,#7b61ff,#a5b4fc)",
                  border: "none",
                  padding: "0.6rem 1.6rem",
                  borderRadius: "30px",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(123,97,255,0.3)",
                  transition: "0.3s",
                }}
              >
                {loading ? "Updating..." : "Update Event"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// 🌸 Reusable Form Components
const FormField = ({ label, type, value, onChange }) => (
  <div style={{ marginBottom: "1.2rem" }}>
    <label
      style={{
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: 500,
        color: "#e5e7eb",
      }}
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      style={{
        width: "100%",
        padding: "0.6rem 1rem",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        outline: "none",
        fontSize: "0.95rem",
      }}
    />
  </div>
);

const FormArea = ({ label, value, onChange }) => (
  <div style={{ marginBottom: "1.2rem" }}>
    <label
      style={{
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: 500,
        color: "#e5e7eb",
      }}
    >
      {label}
    </label>
    <textarea
      rows={3}
      value={value}
      onChange={onChange}
      required
      style={{
        width: "100%",
        padding: "0.7rem 1rem",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        outline: "none",
        resize: "none",
        fontSize: "0.95rem",
      }}
    />
  </div>
);

export default QuickEditEvent;
