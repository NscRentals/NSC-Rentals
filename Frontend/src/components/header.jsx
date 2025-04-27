import { Link } from "react-router-dom";
import { FaUserCircle, FaCar } from "react-icons/fa";
import Logo from "./Logo"; // Make sure this path is correct
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isLoggedIn, userProfile } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] h-[84px] px-10 flex items-center justify-between">
      {/* Left side: Logo */}
      <div className="flex items-center">
        <Link to="/" className="transform scale-[0.9] hover:scale-95 transition-transform duration-200">
          <Logo />
        </Link>
      </div>

      {/* Center: Navigation Items */}
      <nav className="flex items-center space-x-8">
        <Link 
          to="/cars" 
          className="text-gray-700 text-xl font-medium hover:text-black transition-colors duration-200 relative group"
        >
          Cars
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/about" 
          className="text-gray-700 text-xl font-medium hover:text-black transition-colors duration-200 relative group"
        >
          About
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/contact" 
          className="text-gray-700 text-xl font-medium hover:text-black transition-colors duration-200 relative group"
        >
          Contact
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/register" 
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition-colors duration-200"
        >
          <FaCar className="text-xl" />
          <span>Driver Registration</span>
        </Link>
      </nav>

      {/* Right side: User related elements */}
      <div className="flex items-center space-x-6">
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <Link to="/user/general" className="group">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200">
                {userProfile?.profilePicture ? (
                  <img 
                    src={`http://localhost:4000/uploads/profile_pictures/${userProfile.profilePicture}`}
                    alt={userProfile?.firstName || 'Profile'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.parentElement.querySelector('.fallback').style.display = 'flex';
                      e.target.style.display = 'none';
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
