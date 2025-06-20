import Header from './header';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isTechnicianRoute = location.pathname.startsWith('/technician/dashboard');
  const isUserDashboardRoute = location.pathname.startsWith('/user');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && !isTechnicianRoute && !isUserDashboardRoute && <Header />}
      <main className={`flex-1 ${!isAdminRoute && !isTechnicianRoute && !isUserDashboardRoute ? 'my-[84px]' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
} 