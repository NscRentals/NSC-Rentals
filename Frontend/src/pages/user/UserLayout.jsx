import Header from '../../components/header';
import UserSidebar from './UserSidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function UserLayout() {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-84px)] bg-gray-50">
        <aside className="w-56 md:w-64 bg-white pt-10 md:pt-16 px-2 md:px-4 pb-6 md:pb-8 h-[calc(100vh-84px)] z-40 shadow-lg border-r border-gray-200">
          <UserSidebar />
        </aside>
        {/* Main Content */}
        <div className="flex-grow p-2 md:p-6 bg-white min-h-[calc(100vh-84px)] w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
} 