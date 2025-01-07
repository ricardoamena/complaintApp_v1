import React from "react";
import { Routes, Route } from "react-router-dom";
import "./Index.css";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import ComplaintForm from "./components/ComplaintForm";

function App() {
  return (
    <>
      <div className="h-screen overflow-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/complaint" element={<ComplaintForm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
