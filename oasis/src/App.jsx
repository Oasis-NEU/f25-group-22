import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignedOutLayout from "./layouts/SignedOutLayout";
import Dashboard from "./pages/Dashboard";
import YourTrails from "./pages/YourTrails";
import RecommendedTrails from "./pages/RecommendedTrails";

function App() {
  return (
    <>
      <Routes>
        <Route element={<SignedOutLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/yourtrails" element={<YourTrails />} />
        <Route path="/recommended" element={<RecommendedTrails />} />
      </Routes>
    </>
  );
}

export default App;
