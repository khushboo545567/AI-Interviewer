import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice.js";
import InterviewPage from "./pages/InterviewPage.jsx";
import InterviewHistory from "./pages/InterviewHistory.jsx";
import Pricing from "./pages/Pricing.jsx";
import InterviewReport from "./pages/InterviewReport.jsx";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await axios.get(
          import.meta.env.VITE_SERVER_URL + "/api/v1/user/get-current-user",
          {
            withCredentials: true,
          },
        );

        dispatch(setUserData(user.data.user));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    getUser();
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/history" element={<InterviewHistory />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/report/:id" element={<InterviewReport />} />
    </Routes>
  );
}

export default App;
