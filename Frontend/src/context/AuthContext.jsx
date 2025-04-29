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
      localStorage.removeItem('userId');
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
        setUserProfile({
          name: response.data.firstName || response.data.name || 'User',
          profilePicture: response.data.profilePicture,
          id: userId,
          type: response.data.type?.toLowerCase()
        });
        
        // Store userId in localStorage
        localStorage.setItem('userId', userId);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
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
      localStorage.removeItem('userId');
      setIsLoggedIn(false);
      setUserProfile({ 
        name: "", 
        profilePicture: null, 
        id: null, 
        type: null 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem('token', token);
    await checkLoginStatus();
    
    // Store userId in localStorage if available
    if (userProfile.id) {
      localStorage.setItem('userId', userProfile.id);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
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