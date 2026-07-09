import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function InterviewReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(
          import.meta.env.VITE_SERVER_URL +
            "/api/v1/interview/get-interview/" +
            id,
          { withCredentials: true },
        );
        console.log(result.data);
        setReport(result.data);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <p className="text-gray-500 text-lg"> Loading Report....</p>
      </div>
    );
  }

  return <Step3Report report={report} />;
}
export default InterviewReport;
