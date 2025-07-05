import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import React from 'react';

export default function UserSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/activities/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error logging logout:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/');
      window.location.reload();
    }
  };

  return (
    <aside className="w-56 md:w-64 bg-white pt-10 md:pt-16 px-2 md:px-4 pb-6 md:pb-8 fixed left-0 top-[84px] h-[calc(100vh-84px)] z-40 shadow-lg border-r border-gray-200">
      <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-12">My account</h2>
      <nav className="space-y-5 md:space-y-8">
        <div className="w-fit">
          <Link 
            to="/user/general" 
            className="block text-base md:text-lg font-medium text-black relative group"
          >
            General
            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-black"></span>
          </Link>
        </div>
        <div className="w-fit">
          <Link 
            to="/reservation/viewReservations" 
            className="block text-base md:text-lg font-medium text-black relative group"
          >
            Reservations
            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-black transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </div>
        <div className="w-fit">
          <Link 
            to="/user/notifications" 
            className="block text-base md:text-lg font-medium text-black relative group"
          >
            Notifications
            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-black transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </div>
        <div className="w-fit">
          <Link 
            to="/user/payment" 
            className="block text-base md:text-lg font-medium text-black relative group"
          >
            Payments
            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-black transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </div>
        <div className="w-fit">
          <Link 
            to="/user/referrals" 
            className="block text-base md:text-lg font-medium text-black relative group"
          >
            Coupons
            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-black transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </div>
        <div className="w-fit">
          <Link 
            to="/user/drivers" 
            className="block text-base md:text-lg font-medium text-black relative group"
          >
            My vehicles
            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-black transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </div>
        <div className="w-fit mt-16 md:mt-20">
          <button 
            onClick={handleLogout}
            className="block text-base md:text-lg font-medium text-red-600 relative group"
          >
            Logout
            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-600 transition-all duration-200 group-hover:w-full"></span>
          </button>
        </div>
      </nav>
    </aside>
  );
} 