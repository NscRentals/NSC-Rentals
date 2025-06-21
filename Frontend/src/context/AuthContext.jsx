import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    profilePicture: null,
    userId: null
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setUserProfile({ name: "", profilePicture: null, userId: null });
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
        const userId = response.data._id;
        localStorage.setItem('userId', userId);
        setUserProfile({
          name: response.data.firstName || response.data.name || 'User',
          profilePicture: response.data.profilePicture,
          userId: userId
        });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setUserProfile({ name: "", profilePicture: null, userId: null });
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setIsLoggedIn(false);
      setUserProfile({ name: "", profilePicture: null, userId: null });
    }
    setIsLoading(false);
  };

  const login = (token, userId) => {
    localStorage.setItem('token', token);
    if (userId) {
      localStorage.setItem('userId', userId);
    }
    checkLoginStatus();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserProfile({ name: "", profilePicture: null, userId: null });
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 