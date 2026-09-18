import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";

const API_URL = "https://j49ibzzry3.execute-api.us-east-1.amazonaws.com";

function Admin() {
  const auth = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [error, setError] = useState(null);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/documents/pending`, {
        headers: { Authorization: `Bearer ${auth.user.id_token}` },
      });
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error(err);
      setError("Could not load pending documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecision = async (documentId, action) => {
    setActioningId(documentId);
    try {
      await axios.post(
        `${API_URL}/documents/decide`,
        { documentId, action },
        { headers: { Authorization: `Bearer ${auth.user.id_token}` } }
      );
      setDocuments((docs) => docs.filter((d) => d.documentId !== documentId));
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating this document.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2>Pending documents</h2>
      </div>

      {error && <div className="status-banner error">{error}</div>}

      {isLoading ? (
        <p className="page-subtitle" style={{ margin: 0 }}>Loading…</p>
      ) : documents.length === 0 ? (
        <p className="page-subtitle" style={{ margin: 0 }}>No documents waiting for review.</p>
      ) : (
        documents.map((doc) => (
          <div key={doc.documentId} className="doc-row">
            <div>
              <div className="doc-title">{doc.title}</div>
              <div className="doc-meta">{doc.uploadedBy}</div>
              {doc.description && <div className="doc-meta">{doc.description}</div>}
            </div>
            <div className="doc-actions">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-view"
              >
                View file
              </a>
              <button
                className="btn-approve"
                disabled={actioningId === doc.documentId}
                onClick={() => handleDecision(doc.documentId, "approved")}
              >
                Approve
              </button>
              <button
                className="btn-reject"
                disabled={actioningId === doc.documentId}
                onClick={() => handleDecision(doc.documentId, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;