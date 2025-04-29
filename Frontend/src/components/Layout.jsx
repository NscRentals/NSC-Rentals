import Header from './header';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isTechnicianRoute = location.pathname.startsWith('/technician/dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && !isTechnicianRoute && <Header />}
      <main className={`flex-1 ${!isAdminRoute && !isTechnicianRoute ? 'my-[84px]' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
} 