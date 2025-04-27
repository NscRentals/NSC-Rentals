import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import {Toaster} from "react-hot-toast";
import AdminDashboard from './pages/admin/adminDashboard';
import TechDashboard from './pages/technician/techDashboard';
import DriverDashboard from './pages/driver/driverDashboard';
import RegisterPage from './pages/login/registrationPage';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
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
