import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaCar } from "react-icons/fa";
import Logo from "./Logo"; // Make sure this path is correct
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isLoggedIn, userProfile } = useAuth();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] h-[84px] px-10 flex items-center justify-between">
      {/* Left side: Logo */}
      <div className="flex items-center">
        <Link to="/" className="transform scale-[0.9] hover:scale-95 transition-transform duration-200">
          <Logo />
        </Link>
      </div>

      {/* Center: Navigation Items */}
      <nav className="flex items-center space-x-8 mx-auto">
        <Link 
          to="/" 
          className={`text-gray-700 text-xl font-medium hover:text-black transition-colors duration-200 relative group ${
            location.pathname === '/' ? 'text-black' : ''
          }`}
        >
          Home
          <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-200 ${
            location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </Link>
        <Link 
          to="/vehicles" 
          className={`text-gray-700 text-xl font-medium hover:text-black transition-colors duration-200 relative group ${
            location.pathname === '/vehicles' ? 'text-black' : ''
          }`}
        >
          Vehicles
          <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-200 ${
            location.pathname === '/vehicles' ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </Link>
        <Link 
          to="/about" 
          className={`text-gray-700 text-xl font-medium hover:text-black transition-colors duration-200 relative group ${
            location.pathname === '/about' ? 'text-black' : ''
          }`}
        >
          About
          <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-200 ${
            location.pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </Link>
        <Link 
          to="/careers" 
          className={`text-gray-700 text-xl font-medium hover:text-black transition-colors duration-200 relative group ${
            location.pathname === '/careers' ? 'text-black' : ''
          }`}
        >
          Careers
          <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-200 ${
            location.pathname === '/careers' ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </Link>
        <Link 
          to="/contact" 
          className={`text-gray-700 text-xl font-medium hover:text-black transition-colors duration-200 relative group ${
            location.pathname === '/contact' ? 'text-black' : ''
          }`}
        >
          Contact
          <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-200 ${
            location.pathname === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></span>
        </Link>
        
        {isLoggedIn && userProfile?.type === 'Admin' && (
          <Link 
            to="/admin/vehicle-approvals" 
            className={`text-gray-700 text-xl font-medium hover:text-black transition-colors duration-200 relative group ${
              location.pathname === '/admin/vehicle-approvals' ? 'text-black' : ''
            }`}
          >
            Approvals
            <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-200 ${
              location.pathname === '/admin/vehicle-approvals' ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </Link>
        )}
      </nav>

      {/* Right side: User related elements */}
      <div className="flex items-center space-x-6">
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            {userProfile?.type === 'Admin' && (
              <Link 
                to="/admin" 
                className="bg-black text-white text-xl px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                Admin Panel
              </Link>
            )}
            {userProfile?.type === 'Driver' && (
              <Link 
                to="/Driver" 
                className="bg-black text-white text-xl px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                Driver Panel
              </Link>
            )}
            {userProfile?.type === 'Technician' && (
              <Link 
                to="/Tech" 
                className="bg-black text-white text-xl px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                Tech Panel
              </Link>
            )}
            <Link to="/user/general" replace className="group">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200">
                {userProfile?.profilePicture ? (
                  <img 
                    src={`http://localhost:4000/uploads/profile_pictures/${userProfile.profilePicture}`}
                    alt={userProfile?.firstName || 'Profile'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const fallback = e.target.parentElement?.querySelector('.fallback');
                      if (fallback) {
                        fallback.style.display = 'flex';
                        e.target.style.display = 'none';
                      }
                    }}
                  />
                ) : (
                  <div className="fallback w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-xl text-white">
                      {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </div>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-gray-700 text-xl font-medium hover:text-black transition-colors duration-200"
            >
              Sign in
            </Link>
            <Link 
              to="/user/add" 
              className="bg-black text-white text-xl px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
