import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserDashboard from './pages/user/userDashboard';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import {Toaster} from "react-hot-toast";
import AdminPage from './pages/admin/adminDashboard';
import AdminUpdateVehicle from './components/adminUpdateVehicle.jsx';
import AdminAddVehicle from './components/adminAddVehicle.jsx';
import VehicleDetails from './components/vehicleDetails.jsx';
import AdminVehicleFleet from './components/adminVehicleFleet.jsx';

function App() {
  return (
    <BrowserRouter path ="/*">
      <Toaster/>
      <Routes>
        <Route path="/user/*" element={<UserDashboard/>} />
        <Route path="/*" element={<HomePage/>} />
        <Route path="/login" element ={<LoginPage></LoginPage>}></Route>
        <Route path="/admin/" element={<AdminPage/>}/>
        <Route path="/" element={<AdminVehicleFleet />} />
          <Route path="/add-vehicle" element={<AdminAddVehicle />} />
          <Route path="/update-vehicle/:id" element={<AdminUpdateVehicle />} />
          <Route path="/vehicle-details/:_id" element={<VehicleDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
