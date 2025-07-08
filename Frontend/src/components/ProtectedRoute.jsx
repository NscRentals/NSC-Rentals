import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isLoggedIn, userProfile, isLoading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show nothing
  if (isLoading) {
    return null;
  }

  // If not logged in, redirect to login with return path
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user's role is not in allowed roles, redirect accordingly
  if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile.type)) {
    // If user is a technician, redirect to technician dashboard
    if (userProfile.type === "technician") {
      return <Navigate to="/technician/dashboard" state={{ error: "Only technicians can access this page." }} replace />;
    }
    // Otherwise, redirect to home
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected content
  return children;
}
