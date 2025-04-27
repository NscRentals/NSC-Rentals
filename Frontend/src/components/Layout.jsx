import Header from './header';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}
      <main className={`flex-1 ${!isAdminRoute ? 'pt-[84px]' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
} 