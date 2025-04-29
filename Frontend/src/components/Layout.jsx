import Header from './header';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isTechnicianRoute = location.pathname.startsWith('/technician');
  const isUserDashboardRoute = location.pathname.startsWith('/user');
  const isDriverRoute = location.pathname.startsWith('/driver');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && !isTechnicianRoute && !isUserDashboardRoute && !isDriverRoute && <Header />}
      <main className={`flex-1 ${!isAdminRoute && !isTechnicianRoute && !isUserDashboardRoute && !isDriverRoute ? 'mt-[84px]' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
} 