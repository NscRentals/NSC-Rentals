import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create and export the context
export const AuthContext = createContext(null);

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    profilePicture: null,
    id: null,
    type: null
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setUserProfile({ 
        name: "", 
        profilePicture: null, 
        id: null, 
        type: null 
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:4000/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setIsLoggedIn(true);
        setUserProfile({
          name: response.data.firstName || response.data.name || 'User',
          profilePicture: response.data.profilePicture,
          id: response.data._id,
          type: response.data.type?.toLowerCase()
        });
      } else {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserProfile({ 
          name: "", 
          profilePicture: null, 
          id: null, 
          type: null 
        });
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserProfile({ 
        name: "", 
        profilePicture: null, 
        id: null, 
        type: null 
      });
    }
    setIsLoading(false);
  };

  const login = async (token) => {
    localStorage.setItem('token', token);
    await checkLoginStatus();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserProfile({ 
      name: "", 
      profilePicture: null, 
      id: null, 
      type: null 
    });
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      userProfile, 
      isLoading,
      login,
      logout,
      checkLoginStatus 
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};