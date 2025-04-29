import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter path ="/*">
        <Toaster/>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/*" element={<HomePage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/user/add" element={<RegisterPage/>} />
            
            {/* Customer Routes */}
            <Route path="/user/*" element={<UserDashboard/>} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminDashboard/>} />
            
            {/* Technician Routes */}
            <Route path="/technician/dashboard/*" element={<TechnicianDashboard/>} />
            
            {/* Driver Routes */}
            <Route path="/Driver" element={<DriverDashboard/>} />
            
            {/* Vehicle Routes */}
            <Route path="/vehicles" element={<VehicleList/>} />
            <Route path="/vehicles/add" element={<AddVehicle/>} />
            <Route path="/vehicles/:id" element={<VehicleDetails/>} />
            <Route path="/vehicles/edit/:id" element={<EditVehicle/>} />
            <Route path="/user/my-vehicles" element={<MyVehicles/>} />

            {/* Damage Request Routes */}
            <Route path="/damage-request/new/:vehicleId" element={<CreateDamageRequest/>} />
            <Route path="/my-damage-requests" element={<UserDamageRequests/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

//comment hello
