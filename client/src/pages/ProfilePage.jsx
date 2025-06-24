import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import AccountNav from "../AccountNav";
import AccountPropertiesPage from "./AccountPropertiesPage";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { user, isAuthenticated, logout, ready } = useAuth();
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function handleLogout() {
    logout();
    setRedirect("/");
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (ready && !isAuthenticated() && !redirect) {
    return <Navigate to="/login" />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto bg-gradient-card p-10 rounded-lg shadow-card border border-gray-200 text-gray-700 mt-8">
          <p className="mb-4 text-xl font-medium">
            Logged in as <span className="font-bold text-primary-blue">{user?.name}</span> (<span className="text-primary-green">{user?.email}</span>)
          </p>
          <button onClick={handleLogout} className="btn-primary max-w-sm mt-2">
            Log Out
          </button>
        </div>
      )}
      {subpage === "properties" && (
        <AccountPropertiesPage />
      )}
    </div>
  );
}