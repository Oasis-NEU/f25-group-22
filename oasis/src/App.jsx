import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import InformationPage from "./pages/InformationPage";
import Signup from "./pages/Signup";
import SignedOutLayout from "./layouts/SignedOutLayout";
import Dashboard from "./pages/Dashboard";
import YourTrails from "./pages/YourTrails";
import RecommendedTrails from "./pages/RecommendedTrails";
import SignedInLayout from "./layouts/SignedInLayout";
import PlanHike from "./pages/PlanHike";

function App() {
  return (
    <>
      <Routes>
        <Route element={<SignedOutLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/infopage" element={<InformationPage />} />
        </Route>

        <Route element={<SignedInLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/yourtrails" element={<YourTrails />} />
          <Route path="/recommended" element={<RecommendedTrails />} />
          <Route path="/planhike" element={<PlanHike />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
