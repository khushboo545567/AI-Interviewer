import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
