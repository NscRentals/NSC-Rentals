import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Page imports
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import AdminDashboard from './pages/admin/adminDashboard';
import TechDashboard from './pages/technician/techDashboard';
import RegisterPage from './pages/login/registrationPage';
import ContactPage from './pages/home/contact';

// Component imports
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import DriverDashboard from './components/driver/driverDash';
import DriverRegister from './components/driver/driverRegistration';
import AllDrivers from './components/driver/allDrivers';
import DriverProfile from './components/driver/driverProfile';
import DriverProfileUpdate from './components/driver/driverProfileupdate';
import DriverAvailability from './components/driver/DriverAvailability';
import ViewAvailability from './components/driver/ViewAvailability';
import AvailableDrivers from './components/driver/AvailableDrivers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Toaster/>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage/>} />
              <Route path="/contact" element={<ContactPage/>} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/admin/*" element={<AdminDashboard/>}/>
              <Route path="/Tech" element={<TechDashboard/>} />
              <Route path="/register" element={<DriverRegister />} />
              <Route path="/drivers" element={<AllDrivers />} />
              <Route path="/driverprofile/:id" element={<DriverProfile />} />     
              <Route path="/driverprofile/update/:id" element={<DriverProfileUpdate />} /> 
              <Route path="/driver/availability" element={<DriverAvailability />} />
              <Route path="/driver/availability/view" element={<ViewAvailability />} />
              <Route path="/admin/drivers/available" element={<AvailableDrivers />} />
              <Route path="/dashboard/:id" element={<DriverDashboard />} />
              <Route path="/user/add" element={<RegisterPage/>} />
              <Route path="*" element={<HomePage/>} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
