import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import { Toaster } from 'react-hot-toast';
import AdminPage from './pages/admin/adminDashboard';

import DriverRegister from './components/driver/driverRegistration';
import AllDrivers from './components/driver/allDrivers';
import DriverProfile from './components/driver/driverProfile';
import DriverProfileUpdate from './components/driver/driverProfileupdate';
import Navigation from './components/Navigation';
import DriverDashboard from './components/driver/driverDash';

import './index.css';

import Home from './pages/home/homePage';
import DriverAvailability from './components/driver/DriverAvailability';
import ViewAvailability from './components/driver/ViewAvailability';
import AvailableDrivers from './components/driver/AvailableDrivers';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Toaster/>
        <Routes>
          <Route path="/" element={<Home/>} />  
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/admin/" element={<AdminPage/>}/>
          <Route path="/register" element={<DriverRegister />} />
          <Route path="/drivers" element={<AllDrivers />} />
          <Route path="/driverprofile/:id" element={<DriverProfile />} />     
          <Route path="/driverprofile/update/:id" element={<DriverProfileUpdate />} /> 
          <Route path="/driver/availability" element={<DriverAvailability />} />
          <Route path="/driver/availability/view" element={<ViewAvailability />} />
          <Route path="/admin/drivers/available" element={<AvailableDrivers />} />
          <Route path="/dashboard/:id" element={<DriverDashboard />} />
          <Route path="*" element={<HomePage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
