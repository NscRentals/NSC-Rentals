import { Link, Route, Routes } from "react-router-dom";
import General from "./general";
import Header from "../../components/header";
import UpdateProfilePicture from "./UpdateProfilePicture";
import ChangePassword from "./ChangePassword";
import UpdateUserDetails from "./UpdateUserDetails";
import DeleteAccount from "./DeleteAccount";

export default function UserDashboard() {
  return (
    <div>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-[400px] bg-white p-6 border-r">
          <h2 className="text-2xl font-bold mb-6">My account</h2>
          <nav className="space-y-4">
            <Link to="/user/general" className="block font-semibold text-black">General</Link>
            <Link to="/user/notifications" className="block text-gray-600">Reservations</Link>
            <Link to="/user/clubs" className="block text-gray-600">Notifications</Link>
            <Link to="/user/payment" className="block text-gray-600">Payment & payout</Link>
            <Link to="/user/referrals" className="block text-gray-600">Coupons</Link>
            <Link to="/user/drivers" className="block text-gray-600">My Vehicles</Link>
            <Link to="/user/general/delete" className="block text-red-600">Delete account</Link>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="w-[calc(100vw-400px)] flex-1 p-10 bg-white">
          <Routes>
            <Route path="general" element={<General />} />
            <Route path="general/profile" element={<UpdateProfilePicture></UpdateProfilePicture>}></Route>
            <Route path="general/password" element={<ChangePassword/>}/>
            <Route path="general/update" element ={<UpdateUserDetails></UpdateUserDetails>}></Route>
            <Route path="general/delete" element ={<DeleteAccount></DeleteAccount>}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}
