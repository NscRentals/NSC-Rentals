import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserEdit, FaCalendarCheck, FaMoneyBill, FaClock } from "react-icons/fa";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center">Driver Panel</h2>
        <button
          className="flex items-center gap-2 p-3 mb-3 bg-gray-700 rounded-lg hover:bg-gray-600"
          onClick={() => navigate(`/driverprofile/${id}`)}
        >
          <FaUserEdit /> Edit Profile
        </button>
        <button
          className="flex items-center gap-2 p-3 mb-3 bg-gray-700 rounded-lg hover:bg-gray-600"
          onClick={() => navigate(`/driver/reservations/${id}`)}
        >
          <FaCalendarCheck /> Assigned Reservations
        </button>
        <button
          className="flex items-center gap-2 p-3 mb-3 bg-gray-700 rounded-lg hover:bg-gray-600"
          onClick={() => navigate(`/driver/salary/${id}`)}
        >
          <FaMoneyBill /> Salary Details
        </button>
        <button
          className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg hover:bg-gray-600"
          onClick={() => navigate(`/driver/update-availability/${id}`)}
        >
          <FaClock /> Update Availability
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-semibold mb-6">Welcome to the Driver Dashboard</h2>
        <p className="text-gray-600">Manage your profile, reservations, salary details, and availability from here.</p>
      </main>
    </div>
  );
};

export default DriverDashboard;
