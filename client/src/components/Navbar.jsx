import React, { useActionState, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsRobot } from "react-icons/bs";
import { BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUser, FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import AuthModel from "./AuthModel";

function Navbar() {
  const { userData } = useSelector((state) => state.user);

  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/api/v1/user/auth/logout",
        {
          withCredentials: true,
        },
      );
      dispatch(setUserData(null));
      setShowCreditsPopup(false);
      setShowUserPopup(false);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-[#f3f3f3] flex justify-center px-4 pt-4 bt-6 ">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h1 className="font-semibold hidden md:block text-lg">
            AI Interviewer
          </h1>
        </div>
        <div className="flex items-center gap-6 relative">
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowCreditsPopup(!showCreditsPopup);
                setShowUserPopup(false);
              }}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition"
            >
              <BsCoin size={20} />
              {userData?.credits || 0}
            </button>
            {showCreditsPopup && (
              <div className="absolute right-12.5 mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded-2xl p-5 z-50">
                <p className="text-sm text-gray-600 mb-4">
                  Need more credits to continue interviews ?{" "}
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm"
                >
                  Buy more credits
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowUserPopup(!showUserPopup);
                setShowCreditsPopup(false);
              }}
              className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold"
            >
              {userData?.name ? (
                userData.name.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut />
              )}
            </button>
            {showUserPopup && (
              <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl border border-gray-200 rounded-xl p-4 z-50">
                <p className="text-md text-blue-500 font-medium mb-1">
                  {userData?.name}
                </p>
                <button
                  onClick={() => navigate("/history")}
                  className="w-full text-left text-sm py-2 hover:text-black text-gray-600"
                >
                  Interview History
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm flex items-center gap-2
                text-red-500 py-2 hover:text-black "
                >
                  <HiOutlineLogout size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
}
export default Navbar;
