import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import DamageRequestsList from './DamageRequestsList';
import TechnicianSchedule from './TechnicianSchedule';
import AcceptedRequests from './AcceptedRequests';
import CompletedRequests from './CompletedRequests';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check if a path is active
  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[380px] bg-white px-12 py-8 fixed left-0 top-0 h-screen overflow-y-auto">
        <h2 className="text-[38px] font-bold mb-24">Technician Dashboard</h2>
        <nav className="space-y-12 pb-8">
          <div className="w-fit">            <Link 
              to="/technician/dashboard/requests"
              className={`block text-[26px] font-medium relative group ${
                isActive('/technician/dashboard/requests') ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Damage Requests
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${
                isActive('/technician/dashboard/requests') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link
              to="/technician/dashboard/schedule"
              className={`block text-[26px] font-medium relative group ${
                isActive('/technician/dashboard/schedule') ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Schedule
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${
                isActive('/technician/dashboard/schedule') ? 'w-full' : 'w-0 group-hover:w-full'              }`}></span>
            </Link>
          </div>          <div className="w-fit">
            <Link 
              to="/technician/dashboard/accepted"
              className={`block text-[26px] font-medium relative group ${
                isActive('/technician/dashboard/accepted') ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              My Assigned Tasks
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${
                isActive('/technician/dashboard/accepted') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/technician/dashboard/completed"
              className={`block text-[26px] font-medium relative group ${
                isActive('/technician/dashboard/completed') ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Completed Requests
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${
                isActive('/technician/dashboard/completed') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
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
      <div className="flex-1 ml-[380px] p-8 bg-white">        <Routes>          <Route index element={<DamageRequestsList />} />
          <Route path="requests" element={<DamageRequestsList />} />
          <Route path="schedule" element={<TechnicianSchedule />} />
          <Route path="accepted" element={<AcceptedRequests />} />
          <Route path="completed" element={<CompletedRequests />} />
        </Routes>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
