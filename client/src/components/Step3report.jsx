import React from "react";

function Step3report({ report }) {
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <p className="text-gray-500 text-lg"> Loading Report....</p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;
  return <div>hiiii</div>;
}
export default Step3report;
