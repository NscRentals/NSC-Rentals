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
import RegisterPage from './pages/login/registrationPage';
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
          <Toaster/>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage/>} />
              <Route path="/contact" element={<ContactPage/>} />
              <Route path="/about" element={<About/>} />
              <Route path="/careers" element={<Careers/>} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/user/add" element={<RegisterPage/>} />
              
              {/* Customer Routes */}
              <Route path="/user/*" element={<UserDashboard/>} />
              
              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminDashboard/>} />
              <Route path="/admin/vehicle-approvals" element={<AdminVehicleApprovals/>} />
              <Route path="/admin/vehicle-list" element={<AdminVehicleList/>} />
              <Route path="/admin/spare-parts" element={<SparePartsInventory/>} />
              <Route path="/admin/vehicle-updates" element={<VehicleUpdateRequests/>} />
              
              {/* Technician Routes */}
              <Route path="/technician/dashboard/*" element={<TechnicianDashboard/>} />
              <Route path="/technician/signup" element={<TechnicianSignUp/>} />
              <Route path="/Tech" element={<TechDashboard/>} />
              
              {/* Driver Routes */}
              <Route path="/Driver" element={<DriverDashboard/>} />
              <Route path="/register" element={<DriverRegister />} />
              <Route path="/drivers" element={<AllDrivers />} />
              <Route path="/driverprofile/:id" element={<DriverProfile />} />     
              <Route path="/driverprofile/update/:id" element={<DriverProfileUpdate />} /> 
              <Route path="/driver/availability" element={<DriverAvailability />} />
              <Route path="/driver/availability/view" element={<ViewAvailability />} />
              <Route path="/admin/drivers/available" element={<AvailableDrivers />} />
              <Route path="/dashboard/:id" element={<DriverDashboard />} />

              {/* Vehicle Routes */}
              <Route path="/vehicles" element={<VehicleList/>} />
              <Route path="/vehicles/add" element={<AddVehicle/>} />
              <Route path="/vehicles/:id" element={<VehicleDetails/>} />
              <Route path="/vehicles/edit/:id" element={<EditVehicle/>} />

              {/* Reservation Routes */}
              <Route path="/reservation/vehicles" element={<AllvehicleView/>} />
              <Route path="/reservation/:id" element={<ReservationForm/>} />
              <Route path="/reservation/viewReservations" element={<UserViewReservation/>} />

              {/* Damage Request Routes */}
              <Route path="/damage-request/new/:vehicleId" element={<CreateDamageRequest/>} />
              <Route path="/my-damage-requests" element={<UserDamageRequests/>} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

//comment hellonn
