import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth";
import axios from "axios";
function App() {
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await axios.get(
          import.meta.env.VITE_SERVER_URL + "/api/v1/user/get-current-user",
          {
            withCredentials: true,
          },
        );
        console.log(user.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
