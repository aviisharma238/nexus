"use client";
import React, { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-70b-versatile",
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "4rem auto",
        padding: "1.5rem",
        borderRadius: "1rem",
        backgroundColor: "#111",
        color: "#fff",
        boxShadow: "0 0 20px rgba(255,255,255,0.05)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          fontSize: "1.5rem",
        }}
      >
        💬 Chat with AI
      </h2>

      <div
        style={{
          height: "300px",
          overflowY: "auto",
          backgroundColor: "#000",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
          border: "1px solid #333",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "0.5rem 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                backgroundColor:
                  msg.sender === "user" ? "#2563eb" : "#222",
                padding: "0.6rem 1rem",
                borderRadius: "15px",
                color: "#fff",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "0.7rem 1rem",
            borderRadius: "10px",
            border: "1px solid #444",
            backgroundColor: "#000",
            color: "#fff",
          }}
          placeholder="Type your message..."
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#2563eb",
            border: "none",
            padding: "0.7rem 1rem",
            borderRadius: "10px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
