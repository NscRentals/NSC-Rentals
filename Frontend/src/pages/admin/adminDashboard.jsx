import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import UsersManagement from "./UsersManagement";
import UserReservations from "./UserReservations";
import AdminVehicleList from "./AdminVehicleList";
import VehicleUpdateRequests from "./VehicleUpdateRequests";
import AdminVehicleApprovals from "./AdminVehicleApprovals";
import SparePartsInventory from "./SparePartsInventory";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Summary state
  const [summary, setSummary] = useState({
    users: 0,
    vehicles: 0,
    reservations: 0,
    drivers: 0,
    spareParts: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchSummary() {
      try {
        const token = localStorage.getItem('token');
        const [usersRes, vehiclesRes, reservationsRes, driversRes, sparePartsRes] = await Promise.all([
          fetch('http://localhost:4000/api/users/', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:4000/api/vehicles/getVehicles', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:4000/api/reservation/reservations', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:4000/api/driver/', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:4000/api/maintenance/', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const users = await usersRes.json();
        const vehicles = await vehiclesRes.json();
        const reservations = await reservationsRes.json();
        const drivers = await driversRes.json();
        const spareParts = await sparePartsRes.json();
        setSummary({
          users: Array.isArray(users) ? users.length : (users.length || 0),
          vehicles: Array.isArray(vehicles) ? vehicles.length : (vehicles.vehicles?.length || 0),
          reservations: Array.isArray(reservations) ? reservations.length : (reservations.reservation?.length || 0),
          drivers: Array.isArray(drivers) ? drivers.length : (drivers.posts?.length || 0),
          spareParts: Array.isArray(spareParts) ? spareParts.length : (spareParts.spareParts?.length || 0),
          loading: false,
          error: null,
        });
      } catch (error) {
        setSummary((prev) => ({ ...prev, loading: false, error: 'Failed to fetch summary data.' }));
      }
    }
    fetchSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload(); // This will refresh the page to update all components
  };

  // Helper to check if a path is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 md:w-80 xl:w-96 min-w-[200px] max-w-[380px] bg-white px-4 md:px-8 py-4 fixed left-0 top-0 h-screen overflow-y-auto border-r border-gray-200 z-20">
        <h2 className="text-xl md:text-2xl xl:text-3xl font-bold mb-8 md:mb-12">Admin Dashboard</h2>
        <nav className="space-y-8 md:space-y-12 pb-8">
          <div className="w-fit">
            <Link 
              to="/admin/dashboard" 
              className="block text-lg font-medium text-black relative group"
            >
              Dashboard
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/dashboard') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/admin/users" 
              className="block text-lg font-medium text-black relative group"
            >
              Users
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/users') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>

          <div className="w-fit">
            <Link 
              to="/admin/vehicles" 
              className="block text-lg font-medium text-black relative group"
            >
              Vehicles
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/vehicles') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/admin/vehicle-updates" 
              className="block text-lg font-medium text-black relative group"
            >
              Vehicle Updates
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/vehicle-updates') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/admin/spare-parts" 
              className="block text-lg font-medium text-black relative group"
            >
              Spare Parts
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/spare-parts') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/admin/reports" 
              className="block text-lg font-medium text-black relative group"
            >
              Reports
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive('/admin/reports') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          </div>
          <div className="w-fit mt-24">
            <button 
              onClick={handleLogout}
              className="block text-lg font-medium text-red-600 relative group"
            >
              Logout
              <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-600 transition-all group-hover:w-full"></span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Separator Line */}
      <div className="fixed left-64 md:left-80 xl:left-96 top-0 h-screen w-px bg-gray-200 z-30" />
      
      {/* Main Content */}
      <div className="flex-1 ml-64 md:ml-80 xl:ml-96 p-4 md:p-8 bg-white">
        <Routes>
          <Route index element={
            <>
              {/* Summary Section */}
              <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {summary.loading ? (
                  <div className="col-span-3 text-center text-lg">Loading summary...</div>
                ) : summary.error ? (
                  <div className="col-span-3 text-center text-red-600">{summary.error}</div>
                ) : (
                  <>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold">{summary.users}</span>
                      <span className="text-gray-600 mt-2">Users</span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold">{summary.vehicles}</span>
                      <span className="text-gray-600 mt-2">Vehicles</span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold">{summary.reservations}</span>
                      <span className="text-gray-600 mt-2">Reservations</span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold">{summary.drivers}</span>
                      <span className="text-gray-600 mt-2">Drivers</span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold">{summary.spareParts}</span>
                      <span className="text-gray-600 mt-2">Spare Parts</span>
                    </div>
                  </>
                )}
              </div>
            </>
          } />
          <Route path="dashboard" element={
            <>
              {/* Summary Section */}
              <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {summary.loading ? (
                  <div className="col-span-3 text-center text-lg">Loading summary...</div>
                ) : summary.error ? (
                  <div className="col-span-3 text-center text-red-600">{summary.error}</div>
                ) : (
                  <>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold">{summary.users}</span>
                      <span className="text-gray-600 mt-2">Users</span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold">{summary.vehicles}</span>
                      <span className="text-gray-600 mt-2">Vehicles</span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold">{summary.reservations}</span>
                      <span className="text-gray-600 mt-2">Reservations</span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold">{summary.drivers}</span>
                      <span className="text-gray-600 mt-2">Drivers</span>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold">{summary.spareParts}</span>
                      <span className="text-gray-600 mt-2">Spare Parts</span>
                    </div>
                  </>
                )}
              </div>
            </>
          } />
          <Route path="users" element={<UsersManagement />} />
          <Route path="user-reservations/:userId" element={<UserReservations />} />
          <Route path="vehicles" element={<AdminVehicleList />} />
          <Route path="vehicle-updates" element={
            <div className="container mx-auto px-4 py-8">
              <VehicleUpdateRequests />
            </div>
          } />
          <Route path="vehicle-approvals" element={<AdminVehicleApprovals />} />
          <Route path="spare-parts" element={
            <div className="container mx-auto px-4 py-8">
              <SparePartsInventory />
            </div>
          } />
          <Route path="reports" element={<h1>Reports Content</h1>} />
        </Routes>
      </div>
    </div>
  );
}