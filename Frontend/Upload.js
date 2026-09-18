import { useState } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";

const API_URL = "https://j49ibzzry3.execute-api.us-east-1.amazonaws.com";

function Upload() {
  const auth = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Please provide a title and select a file.");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/documents`,
        { title, description, uploadedBy: auth.user.profile.email, filename: file.name },
        { headers: { Authorization: `Bearer ${auth.user.id_token}` } }
      );

      await axios.put(res.data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      alert("Uploaded! Document ID: " + res.data.documentId);
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload. Check the console for details.");
    }
  };

  return (
    <div className="upload-card">
      <h2>Upload document</h2>

      <label className="field-label">Title</label>
      <input
        className="field-input"
        type="text"
        placeholder="Document title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="field-label">Description</label>
      <input
        className="field-input"
        type="text"
        placeholder="Short description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="field-label">File</label>
      <div
        className={`dropzone ${file ? "has-file" : ""}`}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {file ? file.name : "Click here to select a file"}
      </div>
      <input
        id="fileInput"
        type="file"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="btn-primary" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

export default Upload;