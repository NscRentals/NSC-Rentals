import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      {/* Navigation Links */}
      <nav className="flex space-x-6">
        <Link to="/" className="text-gray-700 font-semibold hover:text-black">Home</Link>
        <Link to="/contact" className="text-gray-700 font-semibold hover:text-black">Contact Us</Link>
      
      </nav>

      {/* User Profile */}
      <Link to="/profile" className="flex items-center space-x-2">
        <FaUserCircle className="text-gray-600 w-8 h-8" />
        <span className="text-gray-700 font-semibold">Profile</span>
      </Link>
    </header>
  );
}
