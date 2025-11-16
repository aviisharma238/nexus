"use client";
import React, { forwardRef, memo } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "gradient";
  size?: "default" | "sm" | "lg";
  className?: string;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
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

    const variants: Record<string, React.CSSProperties> = {
      default: { backgroundColor: "#fff", color: "#000" },
      secondary: { backgroundColor: "#1f1f1f", color: "#fff" },
      ghost: { backgroundColor: "transparent", color: "#fff" },
      gradient: {
        background: "linear-gradient(90deg, #ffffff, #e5e5e5)",
        color: "#000",
        transform: "scale(1)",
      },
    };

    const sizes: Record<string, React.CSSProperties> = {
      default: { height: "40px", padding: "0.5rem 1rem", fontSize: "0.875rem" },
      sm: { height: "36px", padding: "0.5rem 1.25rem", fontSize: "0.875rem" },
      lg: { height: "48px", padding: "0.75rem 2rem", fontSize: "1rem" },
    };

    return (
      <button
        ref={ref}
        style={{
          ...baseStyle,
          ...variants[variant],
          ...sizes[size],
        }}
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

const ArrowRight = ({ size = 16 }: { size?: number }) => (
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

const Hero = memo(() => {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        backgroundColor: "#fff",
        color: "#000",
        padding: "5rem 1.5rem",
        animation: "fadeIn 0.6s ease-out",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Top Banner */}
      <a
        href="/"
        style={{
          marginBottom: "2rem",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          border: "1px solid #333",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          backdropFilter: "blur(6px)",
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: "0.75rem" }}>New version of template is out!</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
        >
          Read more <ArrowRight size={12} />
        </span>
      </a>

      {/* Hero Title */}
      <h1
        style={{
          fontSize: "3rem",
          textAlign: "center",
          maxWidth: "800px",
          lineHeight: "1.2",
          marginBottom: "1rem",
          background:
            "linear-gradient(to bottom, #000000, #000000, rgba(255,255,255,0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.05em",
        }}
      >
        Give your big idea <br /> the website it deserves
      </h1>

      {/* Subtitle */}
      <p
        style={{
          textAlign: "center",
          maxWidth: "600px",
          fontSize: "1rem",
          color: "#666",
          marginBottom: "2.5rem",
        }}
      >
        Landing page kit template built with React and inline styling —  
        clean, simple, and ready to use.
      </p>

      {/* Button */}
      <div style={{ marginBottom: "4rem", zIndex: 10 }}>
        <Button variant="gradient" size="lg">
          Get started
        </Button>
      </div>

      {/* Hero Image */}
      <div style={{ width: "100%", maxWidth: "1000px", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "-23%",
            width: "90%",
            transform: "translateX(-50%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <img
            src="https://i.postimg.cc/Ss6yShGy/glows.png"
            alt="Background glow"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>
          <img
            src="https://i.postimg.cc/SKcdVTr1/Dashboard2.png"
            alt="Dashboard Preview"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
            }}
          />
        </div>
      </div>
    </section>
  );
});