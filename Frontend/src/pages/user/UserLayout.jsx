import Header from '../../components/header';
import UserSidebar from './UserSidebar';
import React from 'react';

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-84px)]">
        <UserSidebar />
        {/* Separator Line */}
        <div className="fixed left-56 md:left-64 top-[84px] h-[calc(100vh-84px)] w-px bg-gray-200 z-30"></div>
        {/* Main Content */}
        <div className="flex-1 ml-56 md:ml-64 p-2 md:p-6 bg-white min-h-[calc(100vh-84px)] max-w-3xl mx-auto">
          {children}
        </div>
      </div>
    </>
  );
} 