import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken, getRole } from "../utils/auth";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config";
import QuickEditEvent from "../components/QuickEditEvent";

const CommunityPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState("events");
  const [communityData, setCommunityData] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newQuery, setNewQuery] = useState({
    issueType: "general",
    description: "",
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    pinned: false,
  });
  const [quickEditEvent, setQuickEditEvent] = useState<any>(null);
  const role = getRole();

  useEffect(() => {
    if (id) {
      fetchCommunityData();
    }
  }, [id]);

  const fetchCommunityData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/communities/${id}`);
      setCommunityData(response.data);
    } catch (error) {
      console.error("Error fetching community data:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.post(
        `${API_BASE_URL}/communities/${id}/chat`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      fetchCommunityData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to send message");
    }
  };

  const submitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.post(
        `${API_BASE_URL}/queries`,
        {
          communityId: id,
          issueType: newQuery.issueType,
          description: newQuery.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewQuery({ issueType: "general", description: "" });
      fetchCommunityData();
      alert("Query submitted successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to submit query");
    }
  };

  const addAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.post(
        `${API_BASE_URL}/communities/${id}/announcements`,
        newAnnouncement,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewAnnouncement({ title: "", content: "", pinned: false });
      fetchCommunityData();
      alert("Announcement added successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add announcement");
    }
  };

  const channels = ["events", "chat", "queries", "announcements"];

  const isAdminChannel = (channel: string) => {
    return ["announcements"].includes(channel);
  };

  const canWrite = (channel: string) => {
    if (isAdminChannel(channel)) return role === "admin";
    return true;
  };

  const renderChannelContent = () => {
    if (!communityData) return <div className="loading">Loading...</div>;

    switch (activeChannel) {
      case "events":
        return (
          <div style={{ color: "white", marginTop: "2rem" }}>
            {/* Header */}
            <div
              className="flex-between"
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <motion.h3
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                Community Events
              </motion.h3>

              {role === "admin" && (
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(255,255,255,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/community/${id}/create-event`)}
                  style={{
                    background: "white",
                    color: "black",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "9999px",
                    border: "none",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "0.3s ease",
                  }}
                >
                  Create Event
                </motion.button>
              )}
            </div>

            {/* Events Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {communityData?.community?.events?.length > 0 ? (
                communityData.community.events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                      transition: "0.3s ease",
                    }}
                    whileHover={{
                      scale: 1.03,
                      background: "rgba(255, 255, 255, 0.12)",
                      boxShadow: "0 0 20px rgba(255,255,255,0.15)",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {event.name}
                    </h4>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      🎨 Theme: {event.theme}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      📍 Location: {event.location}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      📅 Date: {new Date(event.startDate).toLocaleDateString()}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        marginBottom: "1rem",
                      }}
                    >
                      👥 Participants: {event.participants?.length || 0}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginTop: "1rem",
                      }}
                    >
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 10px rgba(255,255,255,0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "9999px",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          transition: "0.3s ease",
                        }}
                      >
                        Register
                      </motion.button>

                      {role === "admin" && (
                        <>
                          <motion.button
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 0 10px rgba(255,255,255,0.3)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuickEditEvent(event)}
                            style={{
                              padding: "0.5rem 1rem",
                              borderRadius: "9999px",
                              background: "white",
                              color: "black",
                              fontSize: "0.9rem",
                              cursor: "pointer",
                              transition: "0.3s ease",
                            }}
                          >
                            Quick Edit
                          </motion.button>

                          <motion.button
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 0 10px rgba(255,255,255,0.3)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/event/${event._id}/edit`)}
                            style={{
                              padding: "0.5rem 1rem",
                              borderRadius: "9999px",
                              border: "1px solid rgba(255,255,255,0.3)",
                              background: "transparent",
                              color: "white",
                              fontSize: "0.9rem",
                              cursor: "pointer",
                              transition: "0.3s ease",
                            }}
                          >
                            Full Edit
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    textAlign: "center",
                  }}
                >
                  No events yet.
                </p>
              )}
            </div>
          </div>
        );

      case "chat":
        return (
          <div style={{ color: "white", marginTop: "2rem" }}>
  {/* Header */}
  <div
    className="flex-between"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
    }}
  >
    <motion.h3
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        fontSize: "1.75rem",
        fontWeight: "600",
        letterSpacing: "0.5px",
      }}
    >
      Community Chat
    </motion.h3>

    {!canWrite("chat") && (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "white",
          padding: "0.4rem 0.8rem",
          borderRadius: "9999px",
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          backdropFilter: "blur(8px)",
        }}
      >
        👁️ Read Only
      </motion.span>
    )}
  </div>

  {/* Chat Container */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    style={{
      background: "rgba(255, 255, 255, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      borderRadius: "20px",
      padding: "1.5rem",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
    }}
  >
    {/* Messages Area */}
    <div
      style={{
        height: "400px",
        overflowY: "auto",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "1rem",
        padding: "1rem",
        marginBottom: "1rem",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(6px)",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.3) transparent",
      }}
    >
      {communityData.chatMessages?.length > 0 ? (
        communityData.chatMessages.map((msg, index) => (
          <motion.div
            key={msg._id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "1rem",
              background:
                msg.userId?.role === "admin"
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 0 10px rgba(255,255,255,0.05)",
              transition: "0.3s ease",
            }}
            whileHover={{
              scale: 1.02,
              background: "rgba(255,255,255,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.35rem",
              }}
            >
              <strong
                style={{
                  color:
                    msg.userId?.role === "admin"
                      ? "#60a5fa"
                      : "rgba(255,255,255,0.9)",
                }}
              >
                {msg.userId?.name}
              </strong>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.85)" }}>{msg.message}</p>
          </motion.div>
        ))
      ) : (
        <p style={{ color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
          No messages yet.
        </p>
      )}
    </div>

    {/* Message Input */}
    {canWrite("chat") ? (
      <form onSubmit={sendMessage}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              outline: "none",
              fontSize: "0.95rem",
              transition: "0.3s ease",
            }}
            onFocus={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.15)")
            }
            onBlur={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.1)")
            }
            required
          />
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(255,255,255,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "white",
              color: "black",
              padding: "0.7rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.3s ease",
            }}
          >
            Send
          </motion.button>
        </motion.div>
      </form>
    ) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          padding: "1rem",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderRadius: "0.75rem",
          textAlign: "center",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        🔒 Only admins can post messages in this community
      </motion.div>
    )}
  </motion.div>
</div>

        );

      case "queries":
        return (
          <div>
            <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
              <h3>Community Queries</h3>
            </div>

            {/* Submit New Query */}
            <div className="card" style={{ marginBottom: "2rem" }}>
              <h4>Submit a Query</h4>
              <form onSubmit={submitQuery}>
                <div style={{ marginBottom: "1rem" }}>
                  <select
                    value={newQuery.issueType}
                    onChange={(e) =>
                      setNewQuery({ ...newQuery, issueType: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="general">General</option>
                    <option value="certificate">Certificate</option>
                    <option value="registration">Registration</option>
                    <option value="attendance">Attendance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <textarea
                    value={newQuery.description}
                    onChange={(e) =>
                      setNewQuery({ ...newQuery, description: e.target.value })
                    }
                    placeholder="Describe your query..."
                    className="input-field"
                    rows={3}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Submit Query
                </button>
              </form>
            </div>

            {/* Existing Queries */}
            <div className="grid grid-auto">
              {communityData.queries?.map((query: any) => (
                <div key={query._id} className="card">
                  <div
                    className="flex-between"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <span
                      className={`badge ${
                        query.status === "open"
                          ? "badge-upcoming"
                          : "badge-completed"
                      }`}
                    >
                      {query.status}
                    </span>
                    <span className="badge badge-active">
                      {query.issueType}
                    </span>
                  </div>
                  <h4>Query by {query.userId?.name}</h4>
                  <p>{query.description}</p>
                  {query.reply && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <strong>Admin Reply:</strong>
                      <p>{query.reply}</p>
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      marginTop: "0.5rem",
                    }}
                  >
                    {new Date(query.dateCreated).toLocaleDateString()}
                  </p>
                </div>
              )) || <p>No queries yet.</p>}
            </div>
          </div>
        );

      case "announcements":
        return (
          <div>
            <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
              <div
                className="flex-between"
                style={{ alignItems: "center", gap: "1rem" }}
              >
                <h3>Announcements</h3>
                {!canWrite("announcements") && (
                  <span className="badge badge-upcoming">👁️ Admin Only</span>
                )}
              </div>
              {role === "admin" && (
                <button
                  className="btn-primary"
                  onClick={() => setActiveChannel("add-announcement")}
                >
                  Add Announcement
                </button>
              )}
            </div>

            <div className="grid grid-auto">
              {communityData.community.announcements?.map(
                (announcement: any) => (
                  <div key={announcement._id} className="card">
                    {announcement.pinned && (
                      <span
                        className="badge badge-active"
                        style={{ marginBottom: "0.5rem" }}
                      >
                        📌 Pinned
                      </span>
                    )}
                    <h4>{announcement.title}</h4>
                    <p>{announcement.content}</p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        marginTop: "1rem",
                      }}
                    >
                      By {announcement.createdBy?.name} •{" "}
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )
              ) || <p>No announcements yet.</p>}
            </div>
          </div>
        );

      case "add-announcement":
        return (
          <div>
            <h3>Add New Announcement</h3>
            <div
              className="card"
              style={{ marginTop: "1rem", maxWidth: "600px" }}
            >
              <form onSubmit={addAnnouncement}>
                <div style={{ marginBottom: "1rem" }}>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        title: e.target.value,
                      })
                    }
                    placeholder="Announcement title..."
                    className="input-field"
                    required
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        content: e.target.value,
                      })
                    }
                    placeholder="Announcement content..."
                    className="input-field"
                    rows={4}
                    required
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newAnnouncement.pinned}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          pinned: e.target.checked,
                        })
                      }
                    />
                    Pin this announcement
                  </label>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="submit" className="btn-primary">
                    Add Announcement
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveChannel("announcements")}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      default:
        return <div>Select a channel</div>;
    }
  };

  if (!communityData)
    return <div className="loading">Loading community...</div>;

  return (
    <div
      className="container"
      style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
    >
      {/* Community Header */}
      <div className="card-header">
        <h1>{communityData.community.name}</h1>
        <p>{communityData.community.description}</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <span className="badge badge-active">
            {communityData.community.members?.length || 0} Members
          </span>
          <span className="badge badge-upcoming">
            {communityData.community.events?.length || 0} Events
          </span>
          <span className="badge badge-completed">
            Category: {communityData.community.category}
          </span>
        </div>
      </div>

      {/* Channel Navigation */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {channels.map((channel) => (
            <button
              key={channel}
              onClick={() => setActiveChannel(channel)}
              className={`tab-button ${
                activeChannel === channel ? "active" : ""
              }`}
              style={{
                position: "relative",
                opacity:
                  !canWrite(channel) && isAdminChannel(channel) ? 0.7 : 1,
              }}
            >
              {channel}
              {isAdminChannel(channel) && !canWrite(channel) && (
                <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem" }}>
                  🔒
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Content */}
      <div>{renderChannelContent()}</div>

      {/* Quick Edit Modal */}
      {quickEditEvent && (
        <QuickEditEvent
          event={quickEditEvent}
          onClose={() => setQuickEditEvent(null)}
          onUpdate={fetchCommunityData}
        />
      )}
    </div>
  );
};

export default CommunityPage;
