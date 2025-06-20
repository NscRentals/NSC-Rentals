import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create and export the context
const AuthContext = createContext(null);

// Create and export the hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Create and export the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:4000/api";

  // Set up axios interceptors for token handling
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Add a response interceptor
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Clear auth data on 401 errors
          localStorage.removeItem("token");
          localStorage.removeItem("userType");
          localStorage.removeItem("driverId");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Remove the interceptor when the component unmounts
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");
      const driverId = localStorage.getItem("driverId");

      console.log('Auth initialization:', { token: !!token, userType, driverId });

      if (!token || !userType) {
        console.log('Missing token or userType, skipping auth initialization');
        setLoading(false);
        return;
      }

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log('Set Authorization header:', axios.defaults.headers.common["Authorization"]);

      // Determine the appropriate endpoint based on user type
      let endpoint;
      switch (userType) {
        case "driver":
          if (!driverId) {
            throw new Error("Driver ID not found");
          }
          endpoint = `${API_BASE_URL}/driver/${driverId}`;
          break;
        case "technician":
          endpoint = `${API_BASE_URL}/technician/me`;
          break;
        case "admin":
          endpoint = `${API_BASE_URL}/admin/me`;
          break;
        default:
          endpoint = `${API_BASE_URL}/users/me`;
      }

      console.log('Fetching user data from:', endpoint);
      const response = await axios.get(endpoint);
      
      if (response.data) {
        // For drivers, the response structure is different
        const userData = userType === 'driver' ? 
          { ...response.data.driver, type: 'driver' } : 
          { ...response.data, type: userType };

        console.log('Setting user data:', userData);
        setUser(userData);
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      if (error.response) {
        console.error("Error response:", {
          status: error.response.status,
          data: error.response.data
        });
      }
      // Clear invalid auth data
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("driverId");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userDataOrEmail, password) => {
    try {
      // If first parameter is an object, it's pre-authenticated user data
      if (typeof userDataOrEmail === 'object') {
        setUser(userDataOrEmail);
        return { success: true, userType: userDataOrEmail.type };
      }

      // Otherwise, treat it as a regular login with credentials
      const userType = localStorage.getItem("userType");
      if (!userType) {
        throw new Error("User type not selected");
      }

      // Determine the login endpoint based on user type
      let endpoint;
      switch (userType) {
        case "driver":
          endpoint = `${API_BASE_URL}/driver/login`;
          break;
        case "technician":
          endpoint = `${API_BASE_URL}/technician/login`;
          break;
        case "admin":
          endpoint = `${API_BASE_URL}/admin/login`;
          break;
        default:
          endpoint = `${API_BASE_URL}/users/login`;
      }

      const response = await axios.post(endpoint, { 
        email: userDataOrEmail, 
        password 
      });
      
      const { token, user: userData, driver } = response.data;

      if (!token) {
        throw new Error("No token received");
      }

      // Store auth data
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Set user with type information
      const finalUserData = userType === 'driver' ? driver : userData;
      if (!finalUserData) {
        throw new Error("User data not found in response");
      }
      
      setUser({ ...finalUserData, type: userType });
      return { success: true, userType };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Invalid credentials"
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("driverId");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const refreshSession = async () => {
    try {
      await initializeAuth();
      return true;
    } catch (error) {
      console.error("Session refresh failed:", error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    refreshSession,
    isAuthenticated: !!user && !!localStorage.getItem("token")
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};