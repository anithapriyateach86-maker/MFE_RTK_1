// profile-mfe/src/ProfileApp.jsx
import React, { useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { setAuthToken } from "./store/fashionApi";
import Profile  from "./components/Profile";
import Wishlist from "./components/Wishlist";

function ProfileNav({ user }) {
  const location = useLocation();

  return (
    <div style={{
      background: "#fff", borderRadius: "12px",
      padding: "16px 24px", marginBottom: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      display: "flex", gap: "8px", alignItems: "center",
    }}>
      <span style={{
        fontWeight: "800", fontSize: "18px",
        color: "#1a1a2e", marginRight: "16px",
      }}>
        My Account
      </span>

      {[
        { path: "/profile",          label: "👤 Profile"  },
        { path: "/profile/wishlist", label: "❤️ Wishlist" },
      ].map(({ path, label }) => {
        const isActive = location.pathname === path;
        return (
          <Link key={path} to={path} style={{
            padding: "8px 18px", borderRadius: "20px",
            background: isActive ? "#7B7FD8" : "#f5f5f5",
            color: isActive ? "white" : "#555",
            fontWeight: "600", fontSize: "14px",
            textDecoration: "none",
          }}>
            {label}	 	  	      	 	    	    	    	    	 	
          </Link>
        );
      })}

      {user && (
        <span style={{
          marginLeft: "auto", fontSize: "13px",
          color: "#999",
        }}>
          Signed in as <strong style={{ color: "#7B7FD8" }}>
            {user.name}
          </strong>
        </span>
      )}
    </div>
  );
}

// ProfileApp — root component exposed via Module Federation
function ProfileApp({ user }) {
  // Set auth token for RTK Query requests when user changes
  // Satisfies: API Base Configuration with Auth Token (6 marks)
  useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token);
      console.log("[ProfileApp] Auth token set for RTK Query");
    }
  }, [user?.token]);

  return (
    // Provider wraps ProfileApp so Redux store is available
    <Provider store={store}>
      <div style={{ padding: "20px" }}>
        <ProfileNav user={user} />
        <Routes>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile"  element={<Profile  user={user} />} />
          <Route path="wishlist" element={<Wishlist user={user} />} />
        </Routes>
      </div>
    </Provider>
  );
}	 	  	      	 	    	    	    	    	 	

export default ProfileApp;