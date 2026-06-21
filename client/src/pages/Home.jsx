import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import AuthModel from "../components/AuthModel";
import Footer from "../components/Footer";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      icon: <BsRobot size={24} />,
      step: "STEP 1",
      title: "Role & Experience Selection",
      desc: "AI adjusts difficulty based on selected job role.",
    },
    {
      icon: <BsMic size={24} />,
      step: "STEP 2",
      title: "Smart Voice Interview",
      desc: "Dynamic follow-up questions based on your answers.",
    },
    {
      icon: <BsClock size={24} />,
      step: "STEP 3",
      title: "Timer Based Simulation",
      desc: "Real interview pressure with time tracking.",
    },
    {
      icon: <BsBarChart size={24} />,
      step: "STEP 4",
      title: "History & Performance Analysis",
      desc: "Detailed evaluation of strengths and weaknesses.",
    },
    {
      icon: <BsFileEarmarkText size={24} />,
      step: "STEP 5",
      title: "Download PDF & Interview Report",
      desc: "Get a complete AI-generated feedback report.",
    },
  ];
  const interviewModes = [
    {
      icon: <BsMic size={24} />,
      title: "HR Interview Mode",
      desc: "Practice common HR questions like self-introduction, strengths, weaknesses, and behavioral scenarios.",
    },
    {
      icon: <BsRobot size={24} />,
      title: "Technical Interview Mode",
      desc: "Role-specific technical interviews with adaptive difficulty and AI-generated follow-up questions.",
    },
    {
      icon: <BsBarChart size={24} />,
      title: "Confidence Detection",
      desc: "Analyze confidence levels, speaking pace, hesitation, and communication effectiveness.",
    },
    {
      icon: <BsFileEarmarkText size={24} />,
      title: "Credits System",
      desc: "Use credits to unlock interviews, advanced reports, and premium AI-powered features.",
    },
  ];
  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Navbar />
      <div className="flex-1 px-6 py-20">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2">
            <HiSparkles size={16} className="bg-green-50 text-green-600 " />
            AI Powered Smart Interview Platform
          </div>
        </div>
        <div className="text-center mb-28">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto `}
          >
            <p>Practice Interviews with</p>
            <span className="relative inline-block text-green-500">
              AI Intelligence
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg"
          >
            Role-based mock interviews with smart follow-ups, adaptive
            difficulty and real-time performance evaluation.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4 mt-10 ">
            <motion.button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/interview");
              }}
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              className="bg-black text-white px-10 py-3 rounded-full hover:opacity-90 transition shadow-md"
            >
              Start Interview
            </motion.button>

            <motion.button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/history");
              }}
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              className="border border-gray-300 px-10 py-3 rounded-full hover:bg-gray-100 transition"
            >
              View History
            </motion.button>
          </div>
        </div>
        {/* ai tool next seciton  */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Experience a complete AI-powered interview process designed to
              simulate real-world technical and HR interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                  {item.icon}
                </div>

                <span className="text-green-600 text-sm font-medium">
                  {item.step}
                </span>

                <h3 className="text-lg font-semibold mt-2 mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        {/* interview mode section  */}

        <div className="max-w-6xl mx-auto mt-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Multiple <span className="text-green-500">Interview Modes</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Choose the interview experience that matches your preparation
              goals and receive personalized AI feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {interviewModes.map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                  {mode.icon}
                </div>

                <h3 className="text-xl font-semibold mb-3">{mode.title}</h3>

                <p className="text-gray-500">{mode.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer />
    </div>
  );
}
export default Home;
