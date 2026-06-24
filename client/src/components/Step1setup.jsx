import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaUserTie,
  FaMicrophoneAlt,
  FaChartLine,
  FaUser,
  FaBriefcase,
  FaFileUpload,
} from "react-icons/fa";
import {useDispatch,useSelector} from "react-redux"
import { setUserData } from "../redux/userSlice";


function Step1setup({ onStart }) {
  
  const {userData} = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  console.log(resumeFile);

  const handleUplodResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    const formdata = new FormData();
    console.log("testing");
    formdata.append("resume", resumeFile);
    try {
      const result = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/api/v1/interview/resume-analyzer",
        formdata,
        { withCredentials: true },
      );
      console.log(result.data);
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects((await result).data.projects || []);
      setSkills((await result).data.skills || []);
      setResumeText((await result).data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log(error);
      setAnalyzing(false);
    }
  };

  // question genereation
  const handleStart = async () => {
  setLoading(true);

  try {
    const result = await axios.post(
      import.meta.env.VITE_SERVER_URL +
        "/api/v1/interview/generate-questions",
      {
        role,
        experience,
        mode,
        resumeText,
        projects,
        skills,
      },
      {
        withCredentials: true,
      }
    );

    console.log(result.data);

    if (userData) {
      dispatch(
        setUserData({
          ...user,
          credits: result.data.creditsLeft,
        })
      );
    }

    onStart(result.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
  };

  const steps = [
    {
      icon: <FaUserTie className="text-green-600 text-xl" />,
      text: "Choose Role & Experience",
    },
    {
      icon: <FaMicrophoneAlt className="text-green-600 text-xl" />,
      text: "Smart Voice Interview",
    },
    {
      icon: <FaChartLine className="text-green-600 text-xl" />,
      text: "Performance Analytics",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        {/* Left Section */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-linear-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your AI Interview
          </h2>

          <p className="text-gray-600 mb-10">
            Practice real interview scenarios powered by AI. Improve
            communication, technical skills, and confidence.
          </p>

          {/* Steps */}
          <div className="space-y-5">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white/70 p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
                  {step.icon}
                </div>

                <p className="text-gray-700 font-medium">{step.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 flex items-center justify-center"
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Begin?
            </h3>
            <div className="space-y-6 pb-6">
              <div className="relative">
                <FaUserTie className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter role"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                />
              </div>

              <div className="relative">
                <FaBriefcase className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Experience (e.g. 2 years)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  onChange={(e) => setExperience(e.target.value)}
                  value={experience}
                />
              </div>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              >
                <option value="Technical">Technical Interview</option>
                <option value="HR">HR Interview</option>
              </select>

              {/* analyzing */}

              {!analysisDone && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    document.getElementById("resumeUpload").click()
                  }
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                >
                  <FaFileUpload className="text-4xl mx-auto text-green-600 mb-3" />

                  <input
                    type="file"
                    accept="application/pdf"
                    id="resumeUpload"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <p className="text-gray-600 font-medium">
                    {resumeFile
                      ? resumeFile.name
                      : "Click to upload resume (Optional)"}
                  </p>
                  {resumeFile && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUplodResume();
                      }}
                      className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      {analyzing ? "Analyzing....." : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              )}
              {/* SHOW ANALYZED DATA LIKE SKILLS ETC */}

              {/* {analysisDone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    Resume Analysis Result
                  </h3>
                  {projects.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        Projects:
                      </p>

                      <ul className="list-disc list-inside text-gray-600">
                        {projects.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Skills:</p>

                      <div className="flex flex-wrap gap-2">
                        {skills.map((s, i) => (
                          <span
                            key={i}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )} */}

              {analysisDone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">
                      Resume Analysis Result
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      AI extracted information from your resume
                    </p>
                  </div>

                  {/* Projects */}
                  {projects.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 underline">
                        Projects:
                      </h4>

                      <div className="grid gap-3">
                        {projects.map((project, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:border-green-500 hover:bg-green-50 transition"
                          >
                            <p className="font-medium text-gray-700">
                              {project}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 underline">
                        Skills:
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              <motion.button

              onClick={handleStart}
                disabled={!role || !experience ||loading}
                whileHover={role && experience ? { scale: 1.03 } : {}}
                whileTap={role && experience ? { scale: 0.95 } : {}}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md"
              >
                {loading ? "starting....." :"Start Interview"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

}

export default Step1setup;
