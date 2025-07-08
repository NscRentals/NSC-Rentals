import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import React from 'react';

export default function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post('http://localhost:4000/api/activities/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error logging logout:', error);
    } finally {
      sessionStorage.removeItem('token');
      navigate('/');
      window.location.reload();
    }
  };

  const menuItems = [
    { label: 'General', path: '/user/general' },
    { label: 'Reservations', path: '/user/reservations' },
    { label: 'Notifications', path: '/user/notifications' },
    { label: 'Payments', path: '/user/payment' },
    { label: 'Coupons', path: '/user/referrals' },
    { label: 'My vehicles', path: '/user/myvehicles' },
  ];

  return (
    <aside className="w-56 md:w-64 bg-white pt-10 md:pt-16 px-2 md:px-4 pb-6 md:pb-8 fixed left-0 top-[84px] h-[calc(100vh-84px)] z-40 shadow-lg border-r border-gray-200">
      <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-12">My account</h2>
      <nav className="space-y-5 md:space-y-8">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path || (item.path === '/user/reservations' && currentPath.startsWith('/user/reservations'));
          return (
            <div className="w-fit" key={item.label}>
              <Link
                to={item.path}
                className={`block text-base md:text-lg font-medium text-black relative group ${isActive ? 'font-bold' : ''}`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            </div>
          );
        })}
        <div className="w-fit mt-16 md:mt-20">
          <button
            onClick={handleLogout}
            className="block text-base md:text-lg font-medium text-red-600 relative group"
          >
            Logout
            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-600 transition-all group-hover:w-full"></span>
          </button>
        </div>
      </nav>
    </aside>
  );
} 