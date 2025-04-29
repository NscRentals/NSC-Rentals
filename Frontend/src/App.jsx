import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserDashboard from './pages/user/userDashboard';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import {Toaster} from "react-hot-toast";
import AdminDashboard from './pages/admin/adminDashboard';
import TechDashboard from './pages/technician/techDashboard';
import DriverDashboard from './pages/driver/driverDashboard';
import RegisterPage from './pages/login/registrationPage';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import AddBlog from './pages/user/addBlog';
import Blog from './pages/home/blog';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter path ="/*">
        <Toaster/>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/user/*" element={<UserDashboard/>} />
            <Route path="/*" element={<HomePage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/admin/*" element={<AdminDashboard/>}/>
            <Route path="/Tech" element={<TechDashboard/>} />
            <Route path="/Driver" element={<DriverDashboard/>} />
            <Route path="/user/add" element={<RegisterPage/>} />
            <Route path="/addBlog" element={<AddBlog />} />
            <Route path="/blog" element={<Blog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
