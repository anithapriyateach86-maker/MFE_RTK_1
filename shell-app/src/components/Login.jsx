// shell/src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MOCK_USERS = [
  { email: "john@fashionhub.com", password: "john123", label: "John", emoji: "🧑" },
  { email: "jane@fashionhub.com", password: "jane123", label: "Jane", emoji: "🧑" },
];

const Login = () => {
  const { login }      = useAuth();
  const navigate       = useNavigate();  // ← navigate after login
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (emailVal, passwordVal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:4000/users?email=${emailVal}`
      );

      if (!response.ok) throw new Error("Server error — please try again");

      const users = await response.json();

      if (users.length === 0) {
        setError("No account found with this email address.");
        setLoading(false);
        return;
      }

      const user = users[0];

      if (user.password !== passwordVal) {	 	  	      	 	    	    	    	    	 	
        setError("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      // Store user in AuthContext
      login({
        userId: user.userId,
        name:   user.name,
        email:  user.email,
        token:  user.token,
      });

      // ← Redirect to products after successful login
      navigate("/products", { replace: true });

    } catch (err) {
      setError(err.message || "Login failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    handleLogin(email, password);
  };

  const handleQuickLogin = (mockUser) => {
    setEmail(mockUser.email);
    setPassword(mockUser.password);
    handleLogin(mockUser.email, mockUser.password);
  };

  return (
    <div style={{	 	  	      	 	    	    	    	    	 	
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px",
        padding: "40px", width: "420px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            color: "#7B7FD8", fontSize: "28px",
            fontWeight: "800", margin: "0 0 8px",
          }}>
            FashionHub
          </h1>
          <p style={{ color: "#666", margin: 0 }}>
            Sign in to your account
          </p>
        </div>

        {/* Quick login buttons */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{
            fontSize: "11px", fontWeight: "700",
            color: "#999", letterSpacing: "1px",
            textTransform: "uppercase", marginBottom: "10px",
          }}>
            QUICK LOGIN
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            {MOCK_USERS.map((u) => (
              <button
                key={u.email}
                onClick={() => handleQuickLogin(u)}
                disabled={loading}	 	  	      	 	    	    	    	    	 	
                style={{
                  flex: 1, padding: "12px",
                  background: "#7B7FD8", color: "white",
                  border: "none", borderRadius: "10px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "700", fontSize: "15px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {u.emoji} {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "12px", marginBottom: "20px",
        }}>
          <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
          <span style={{ color: "#999", fontSize: "13px" }}>
            or sign in manually
          </span>
          <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
        </div>

        {/* Manual form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block", fontSize: "14px",
              fontWeight: "600", marginBottom: "6px", color: "#333",
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}	 	  	      	 	    	    	    	    	 	
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@fashionhub.com"
              style={{
                width: "100%", padding: "12px 14px",
                border: "2px solid #e0e0e0", borderRadius: "8px",
                fontSize: "15px", outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = "#7B7FD8"}
              onBlur={(e)  => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block", fontSize: "14px",
              fontWeight: "600", marginBottom: "6px", color: "#333",
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "12px 14px",
                border: "2px solid #e0e0e0", borderRadius: "8px",
                fontSize: "15px", outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = "#7B7FD8"}
              onBlur={(e)  => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          {/* Error message */}	 	  	      	 	    	    	    	    	 	
          {error && (
            <div style={{
              background: "#fff5f5", border: "1px solid #fed7d7",
              borderRadius: "8px", padding: "10px 14px",
              color: "#c53030", fontSize: "14px",
              marginBottom: "16px", fontWeight: "500",
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: loading
                ? "#b794f4"
                : "linear-gradient(135deg, #7B7FD8, #764ba2)",
              color: "white", border: "none",
              borderRadius: "10px", fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "700",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Test credentials */}
        <div style={{
          marginTop: "20px", padding: "12px",
          background: "#f8f4ff", borderRadius: "8px",
          fontSize: "12px", color: "#666",
        }}>
          <strong style={{ color: "#7B7FD8" }}>Test credentials:</strong>
          <br />
          john@fashionhub.com / john123
          <br />
          jane@fashionhub.com / jane123
        </div>
      </div>
    </div>
  );
};

export default Login;	 	  	      	 	    	    	    	    	 	
