import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";

const API_URL = "https://j49ibzzry3.execute-api.us-east-1.amazonaws.com";

function statusLabel(status) {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

function MyDocuments() {
  const auth = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/documents/mine`, {
        headers: { Authorization: `Bearer ${auth.user.id_token}` },
      });
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error(err);
      setError("Could not load your documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <div className="card-header">
        <h2>My documents</h2>
      </div>

      {error && <div className="status-banner error">{error}</div>}

      {isLoading ? (
        <p className="page-subtitle" style={{ margin: 0 }}>Loading…</p>
      ) : documents.length === 0 ? (
        <p className="page-subtitle" style={{ margin: 0 }}>You haven't uploaded any documents yet.</p>
      ) : (
        documents.map((doc) => (
          <div key={doc.documentId} className="doc-row">
            <div>
              <div className="doc-title">{doc.title}</div>
              {doc.description && <div className="doc-meta">{doc.description}</div>}
            </div>
            <span className={`status-badge status-${doc.status}`}>
              {statusLabel(doc.status)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default MyDocuments;