import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import VerifyUsers from "./VerifyUsers";
import BlogVerify from "./blogVerify";
import UserManage from "./UserManage";
import Dashboard from "./Dashboard";
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      // Log the logout activity
      await axios.post('http://localhost:4000/api/activities/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error logging logout:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/');
      window.location.reload(); // This will refresh the page to update all components
    }
  };

  // Helper to check if a path is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[380px] bg-white px-12 py-8 fixed left-0 top-0 h-screen">
        <h2 className="text-[38px] font-bold mb-24">Admin Dashboard</h2>
        <nav className="space-y-12">
          <div className="w-fit">
            <Link 
              to="/admin/dashboard" 
              className="block text-[26px] font-medium text-black relative group"
            >
              Dashboard
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/dashboard') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/admin/users" 
              className="block text-[26px] font-medium text-black relative group"
            >
              Users
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/users') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/admin/verifications" 
              className="block text-[26px] font-medium text-black relative group"
            >
              Verifications
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/verifications') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/admin/blogposts" 
              className="block text-[26px] font-medium text-black relative group"
            >
              Blog Posts
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/blogposts') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/admin/vehicles" 
              className="block text-[26px] font-medium text-black relative group"
            >
              Vehicles
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/vehicles') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/admin/reports" 
              className="block text-[26px] font-medium text-black relative group"
            >
              Reports
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/reports') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit mt-24">
            <button 
              onClick={handleLogout}
              className="block text-[26px] font-medium text-red-600 relative group"
            >
              Logout
              <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-600 transition-all group-hover:w-full"></span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Separator Line */}
      <div className="fixed left-[380px] top-0 h-screen w-px bg-gray-200"></div>
      
      {/* Main Content */}
      <div className="flex-1 ml-[380px] p-8 bg-white">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManage />} />
          <Route path="verifications" element={<VerifyUsers />} />
          <Route path="blogposts" element={<BlogVerify />} />
          <Route path="vehicles" element={<h1 style={{ marginBottom: "20px", fontSize: "2.8rem", fontWeight: "bold", letterSpacing: "-1px" }}>Vehicle Management</h1>} />
          <Route path="reports" element={<h1 style={{ marginBottom: "20px", fontSize: "2.8rem", fontWeight: "bold", letterSpacing: "-1px" }}>Reports</h1>} />
        </Routes>
      </div>
    </div>
  );
}