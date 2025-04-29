import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create and export the context
const AuthContext = createContext(null);

// Create and export the hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create and export the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const fetchUserData = async () => {
        try {
          let response;
          if (userType === 'driver') {
            const driverId = localStorage.getItem('driverId');
            response = await axios.get(`http://localhost:4000/api/driver/${driverId}`);
            if (response.data.driverone) {
              setUser({ ...response.data.driverone, type: 'driver' });
            } else {
              throw new Error('Driver data not found');
            }
          } else {
            response = await axios.get('http://localhost:4000/api/users/me');
            setUser({ ...response.data, type: 'user' });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('driverId');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const userType = localStorage.getItem('userType');
      console.log("Attempting login as:", userType);

      if (userType === 'driver') {
        // Driver login - exclusively using driver collection
        const response = await axios.post("http://localhost:4000/api/driver/login", {
          email,
          password,
        });

        console.log("Driver login response:", response.data);

        if (response.data.success && response.data.token) {
          const { token, driverId, user: driverData } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("driverId", driverId);
          localStorage.setItem("userType", "driver");
          localStorage.setItem("user", JSON.stringify(driverData));
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser({ ...driverData, _id: driverId, type: 'driver' });
          return {
            success: true,
            userType: 'driver'
          };
        }
        return {
          success: false,
          error: response.data.error || "Invalid driver credentials"
        };
      } else {
        // Regular user login
        const response = await axios.post("http://localhost:4000/api/users/login", {
          email,
          password,
        });

        console.log("User login response:", response.data);

        if (response.data.success && response.data.user) {
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("userType", user.type);
          localStorage.setItem("user", JSON.stringify(user));
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser({ ...user, type: user.type });
          return {
            success: true,
            userType: user.type
          };
        }
        return {
          success: false,
          error: response.data.error || "Invalid user credentials"
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          "Login failed";
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("driverId"); // Make sure to remove driverId on logout
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};