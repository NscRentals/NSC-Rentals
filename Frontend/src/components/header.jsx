import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Logo from "./Logo"; // Make sure this path is correct

export default function Header() {
  return (
    <header className="bg-white h-[84px] shadow px-10 flex items-center justify-between">
      {/* Logo positioned at ~70px from left */}
      <div className="flex items-center space-x-10 ml-[40px]">
      <Link to="/" className="transform scale-[0.9]">
  <Logo />
</Link>

      </div>

      {/* Right side: Contact Us + User Icon */}
      <div className="flex items-center space-x-6">
        <Link to="/contact" className="text-gray-700 font-semibold hover:text-black">
          Contact Us
        </Link>
        <Link to="/user/general">
          <FaUserCircle className="text-gray-600 w-8 h-8" />
        </Link>
      </div>
    </header>
  );
}
