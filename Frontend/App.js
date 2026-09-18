import { useState } from "react";
import Login from "./Login";
import Upload from "./Upload";
import Admin from "./Admin";
import MyDocuments from "./MyDocuments";
import { useAuth } from "react-oidc-context";

const cognitoDomain = "https://us-east-1fphf2ojat.auth.us-east-1.amazoncognito.com";
const clientId = "38eoftqdv8rv1mq4o48ffelkhi";

function App() {
  const auth = useAuth();
  const [employeeTab, setEmployeeTab] = useState("upload");

  const signOutRedirect = () => {
    auth.removeUser();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(window.location.origin)}`;
  };

  if (!auth.isAuthenticated) {
    return <Login />;
  }

  const groups = auth.user?.profile?.["cognito:groups"] || [];
  const isAdmin = groups.includes("Admin");
  const initial = auth.user?.profile?.email?.[0]?.toUpperCase() || "?";

  return (
    <div className="page-shell">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark">D</div>
          <span className="brand-name">DocApproval</span>
        </div>
        <div className="user-chip">
          <div className="user-chip-avatar">{initial}</div>
          <span className="user-chip-email">{auth.user?.profile?.email}</span>
          <button className="signout-link" onClick={signOutRedirect}>
            Sign out
          </button>
        </div>
      </div>

      {isAdmin ? (
        <>
          <h1 className="page-title">Review documents</h1>
          <p className="page-subtitle">Approve or reject documents submitted by your team.</p>
          <Admin />
        </>
      ) : (
        <>
          <h1 className="page-title">Document workspace</h1>
          <p className="page-subtitle">
            Upload documents for review and track their status.
          </p>

          <div className="tabs">
            <button
              className={`tab-btn ${employeeTab === "upload" ? "active" : ""}`}
              onClick={() => setEmployeeTab("upload")}
            >
              Upload
            </button>
            <button
              className={`tab-btn ${employeeTab === "mine" ? "active" : ""}`}
              onClick={() => setEmployeeTab("mine")}
            >
              My Documents
            </button>
          </div>

          {employeeTab === "upload" ? <Upload /> : <MyDocuments />}
        </>
      )}
    </div>
  );
}

export default App;