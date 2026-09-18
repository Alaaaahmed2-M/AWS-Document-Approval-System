import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import './theme.css';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_FphF2OJat",
  client_id: "38eoftqdv8rv1mq4o48ffelkhi",
  redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "email openid",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider {...cognitoAuthConfig}>
    <App />
  </AuthProvider>
);