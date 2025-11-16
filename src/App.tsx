import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧩 Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// 📄 Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/AdminDashboard";
import StudentHome from "./pages/StudentHome";
import Profile from "./pages/Profile";
import CommunityHub from "./pages/CommunityHub";
import CommunityPage from "./pages/CommunityPage";
import CreateCommunity from "./pages/CreateCommunity";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventRegistration from "./pages/EventRegistration";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Leaderboard from "./pages/Leaderboard";



function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50 text-gray-800" style={{ marginTop: "90px" }} >
        {/* Global Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="pt-20 px-4 md:px-10">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
 


            {/* Protected Routes */}
            <Route
              path="/communities"
              element={
                <ProtectedRoute>
                  <CommunityHub />
                </ProtectedRoute>
              }
            />

            <Route
              path="/community/:communityId"
              element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-community"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateCommunity />
                </ProtectedRoute>
              }
            />

            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />

            <Route
              path="/event/:eventId"
              element={
                <ProtectedRoute>
                  <EventDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/event/:eventId/register"
              element={
                <ProtectedRoute>
                  <EventRegistration />
                </ProtectedRoute>
              }
            />

            <Route
              path="/community/:communityId/create-event"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateEvent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/event/:eventId/edit"
              element={
                <ProtectedRoute requiredRole="admin">
                  <EditEvent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/home"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
