import React, { useState } from "react";
import axios from "axios";

function UploadResume() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      alert("Upload successful!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Upload Your Resume</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

export default UploadResume;