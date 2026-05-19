// shell/src/context/AuthContext.jsx
import React, {
  createContext, useContext, useState
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // currentUser shape: { userId, name, email, token }

  const login = (userData) => {
    setCurrentUser(userData);
    console.log("[AuthContext] User logged in:", userData.name);
  };

  const logout = () => {
    if (currentUser) {
      // Clear user-scoped cart from localStorage on logout
      localStorage.removeItem(`fashionhub_cart_${currentUser.userId}`);
      localStorage.removeItem(`fashionhub_orders_${currentUser.userId}`);
      console.log("[AuthContext] User logged out:", currentUser.name);
    }
    setCurrentUser(null);
  };

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {	 	  	      	 	    	    	    	    	 	
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;