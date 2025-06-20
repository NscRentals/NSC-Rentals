import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DriverRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.type !== 'driver') {
    return <Navigate to="/" />;
  }

  return children;
};

export default DriverRoute; 