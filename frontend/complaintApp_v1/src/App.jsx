import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import ComplaintForm from "./components/ComplaintForm";
import AnonyComplaintForm from "./components/AnonyComplaintForm";
import ComplaintStatus from "./components/ComplaintStatus";

function App() {
  return (
    <>
      <div className="h-screen overflow-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/complaint" element={<ComplaintForm />} />
          <Route path="/anony-complaint" element={<AnonyComplaintForm />} />
          <Route path="/status-complaint" element={<ComplaintStatus />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
