import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Page imports
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import AdminDashboard from './pages/admin/adminDashboard';
import TechDashboard from './pages/technician/techDashboard';
import ContactPage from './pages/home/contact';
import About from './pages/about/About';
import Careers from './pages/careers/Careers';
import UserDashboard from './pages/user/userDashboard';
import VehicleList from './pages/vehicles/VehicleList';
import AddVehicle from './pages/vehicles/AddVehicle';
import VehicleDetails from './pages/vehicles/VehicleDetails';
import AdminVehicleApprovals from './pages/admin/AdminVehicleApprovals';
import AdminVehicleList from './pages/admin/AdminVehicleList';
import CreateDamageRequest from './pages/damage/CreateDamageRequest';
import UserDamageRequests from './pages/damage/UserDamageRequests';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import SparePartsInventory from './pages/admin/SparePartsInventory';
import MyVehicles from './pages/vehicles/MyVehicles';
import VehicleUpdateRequests from './pages/admin/VehicleUpdateRequests';
import EditVehicle from './pages/vehicles/EditVehicle';
import TechnicianSignUp from './pages/technician/TechnicianSignUp';
import AllvehicleView from './pages/reservation/AllvehicleView';
import ReservationForm from './pages/reservation/reservation';
import UserViewReservation from './pages/reservation/UserViewReservation';

// Component imports
import Layout from './components/Layout';
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
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<DriverRegister />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              
              {/* Vehicle Routes */}
              <Route path="/vehicles" element={<VehicleList />} />
              <Route path="/vehicles/add" element={<AddVehicle />} />
              <Route path="/vehicles/:id" element={<VehicleDetails />} />
              <Route path="/vehicles/:id/edit" element={<EditVehicle />} />
              <Route path="/my-vehicles" element={<MyVehicles />} />
              
              {/* Reservation Routes */}
              <Route path="/reservations" element={<AllvehicleView />} />
              <Route path="/reservations/new" element={<ReservationForm />} />
              <Route path="/user/reservations" element={<UserViewReservation />} />
              
              {/* Damage Request Routes */}
              <Route path="/damage/new" element={<CreateDamageRequest />} />
              <Route path="/user/damage-requests" element={<UserDamageRequests />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/vehicle-approvals" element={<AdminVehicleApprovals />} />
              <Route path="/admin/vehicles" element={<AdminVehicleList />} />
              <Route path="/admin/spare-parts" element={<SparePartsInventory />} />
              <Route path="/admin/vehicle-updates" element={<VehicleUpdateRequests />} />
              
              {/* Technician Routes */}
              <Route path="/technician" element={<TechnicianDashboard />} />
              <Route path="/technician/signup" element={<TechnicianSignUp />} />
              
              {/* User Routes */}
              <Route path="/user/*" element={<UserDashboard />} />
              
              {/* Driver Routes */}
              <Route path="/driver" element={<DriverDashboard />} />
              <Route path="/driver/register" element={<DriverRegister />} />
              <Route path="/driver/all" element={<AllDrivers />} />
              <Route path="/driver/profile/:id" element={<DriverProfile />} />
              <Route path="/driver/profile/:id/update" element={<DriverProfileUpdate />} />
              <Route path="/driver/availability" element={<DriverAvailability />} />
              <Route path="/driver/availability/view" element={<ViewAvailability />} />
              <Route path="/driver/available" element={<AvailableDrivers />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

//comment hellonn
