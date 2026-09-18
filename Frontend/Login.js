import { useAuth } from "react-oidc-context";

function Login() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="auth-page">
        <div className="auth-card">Loading...</div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="auth-page">
        <div className="auth-card">Error: {auth.error.message}</div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">D</div>
          <p className="auth-title">Welcome, {auth.user?.profile.email}</p>
          <button className="btn-primary" onClick={() => auth.removeUser()}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">D</div>
        <p className="auth-title">Welcome</p>
        <p className="auth-subtitle">Sign in to your approval workspace</p>
        <button className="btn-primary" onClick={() => auth.signinRedirect()}>
          Sign in
        </button>
      </div>
    </div>
  );
}

export default Login;