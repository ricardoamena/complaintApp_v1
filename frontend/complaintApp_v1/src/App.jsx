import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import ComplaintForm from "./components/ComplaintForm";
import AnonyComplaintForm from "./components/AnonyComplaintForm";
import ComplaintStatus from "./components/ComplaintStatus";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow overflow-auto">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/complaint" element={<ComplaintForm />} />
          <Route path="/anony-complaint" element={<AnonyComplaintForm />} />
          <Route path="/status-complaint" element={<ComplaintStatus />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
