import React, { useState } from "react";
import axios from "axios";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      setSkills(res.data.skills || []);
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-8 rounded-2xl shadow-xl text-center w-[400px]">
      
      <h2 className="text-xl font-semibold mb-4">
        Upload Resume
      </h2>

      {/* File Input */}
      <input
        type="file"
        accept=".pdf"
        className="mb-4 text-sm text-gray-300"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="w-full bg-blue-500 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        {loading ? "Processing..." : "Upload"}
      </button>

      {/* Skills Output */}
      {skills.length > 0 && (
        <div className="mt-6 text-left">
          <h3 className="text-lg font-semibold mb-2 text-blue-400">
            Extracted Skills:
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default UploadResume;