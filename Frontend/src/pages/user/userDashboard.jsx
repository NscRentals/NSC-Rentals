import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import General from "./general";
import UpdateProfilePicture from "./UpdateProfilePicture";
import ChangePassword from "./ChangePassword";
import UpdateUserDetails from "./UpdateUserDetails";
import DeleteAccount from "./DeleteAccount";
import VerifyAccount from "./VerifyAccount";
import AddPaymentMethod from "./addPaymentMethod";
import Payments from "./Payments";
import MyReservations from "./myReservations";
import MyCoupons from "./myCoupons";
import MakePayment from "./makePayment";
import axios from 'axios';

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(`/user/${path}`);
  };

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

  return (
    <div className="flex min-h-[calc(100vh-84px)]">
      {/* Sidebar */}
      <aside className="w-[380px] bg-white pt-24 px-12 pb-12 fixed left-0 top-[84px] h-[calc(100vh-84px)]">
        <h2 className="text-[38px] font-bold mb-24">My account</h2>
        <nav className="space-y-12">
          <div className="w-fit">
            <Link 
              to="/user/general" 
              className="block text-[26px] font-medium text-black relative group"
            >
              General
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all duration-200 ${isActive('general') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/user/notifications" 
              className="block text-[26px] font-medium text-black relative group"
            >
              Reservations
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all duration-200 ${isActive('notifications') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/user/clubs" 
              className="block text-[26px] font-medium text-black relative group"
            >
              Notifications
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all duration-200 ${isActive('clubs') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/user/payment" 
              className="block text-[26px] font-medium text-black relative group"
            >
              Payments
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all duration-200 ${isActive('payment') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/user/coupons" 
              className="block text-[26px] font-medium text-black relative group"
            >
              Coupons
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all duration-200 ${isActive('coupons') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>
          <div className="w-fit">
            <Link 
              to="/user/drivers" 
              className="block text-[26px] font-medium text-black relative group"
            >
              My vehicles
              <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all duration-200 ${isActive('drivers') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>
          <div className="w-fit mt-24">
            <button 
              onClick={handleLogout}
              className="block text-[26px] font-medium text-red-600 relative group"
            >
              Logout
              <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-600 transition-all duration-200 group-hover:w-full"></span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Separator Line */}
      <div className="fixed left-[380px] top-[104px] h-[calc(100vh-124px)] w-px bg-gray-200"></div>
      
      {/* Main Content */}
      <div className="flex-1 ml-[380px] p-8 bg-white">
        <Routes>
          <Route path="general" element={<General />} />
          <Route path="general/profile" element={<UpdateProfilePicture />} />
          <Route path="general/password" element={<ChangePassword />} />
          <Route path="general/update" element={<UpdateUserDetails />} />
          <Route path="general/delete" element={<DeleteAccount />} />
          <Route path="general/verify" element={<VerifyAccount />} />
          <Route path="payment" element={<Payments />} />
          <Route path="payment/add" element={<AddPaymentMethod />} />
          <Route path="notifications" element={<MyReservations />} />
          <Route path="coupons" element={<MyCoupons />} />
          <Route path="make-payment" element={<MakePayment />} />
        </Routes>
      </div>
    </div>
  );
}
