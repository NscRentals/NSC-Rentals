import { FaEnvelope, FaPhone, FaCheckCircle, FaUserCircle } from "react-icons/fa";
import { Link, Route, Routes } from "react-router-dom";

export default function UserDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-[400px] bg-white p-6 border-r">
        <h2 className="text-2xl font-bold mb-6">My account</h2>
        <nav className="space-y-4">
          <Link to="/user/myAccount" className="block font-semibold text-black">General</Link>
          <Link to="/user/notifications" className="block text-gray-600">Notifications</Link>
          <Link to="/user/clubs" className="block text-gray-600">Clubs</Link>
          <Link to="/user/payment" className="block text-gray-600">Payment & payout</Link>
          <Link to="/user/referrals" className="block text-gray-600">My referrals</Link>
          <Link to="/user/drivers" className="block text-gray-600">Drivers</Link>
          <Link to="/user/delete" className="block text-red-600">Delete account</Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="w-[calc(100vw-400px)] flex-1 p-10">
        <Routes>
          <Route path="/myAccount" element={
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">General</h1>
                {/* Profile Section */}
                <div className="flex flex-col items-center">
                  <FaUserCircle className="text-gray-500 w-20 h-20" />
                  <button className="mt-2 px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded">
                    Change
                  </button>
                </div>
              </div>
              {/* Account Details */}
              <div className="mt-6 bg-white p-6 shadow rounded">
                <div className="border-b pb-4 flex items-center gap-2">
                  <FaEnvelope className="text-gray-500" />
                  <div>
                    <h3 className="text-lg font-bold">Email</h3>
                    <p className="text-gray-700">amindurajamuni@gmail.com</p>
                    <p className="text-sm text-gray-500">not verified</p>
                  </div>
                </div>
                <div className="border-b py-4 flex items-center gap-2">
                  <FaPhone className="text-gray-500" />
                  <div>
                    <h3 className="text-lg font-bold">Cell phone</h3>
                    <p className="text-gray-700">not verified</p>
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  <h3 className="text-lg font-bold text-green-600">Password</h3>
                </div>
              </div>
            </div>
          } />
          <Route path="/notifications" element={<h1>Notifications</h1>} />
        </Routes>
      </main>
    </div>
  );
}
