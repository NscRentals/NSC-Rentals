import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserDashboard from './pages/user/userDashboard';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import {Toaster} from "react-hot-toast";
import AdminPage from './pages/admin/adminDashboard';
import AdminUpdateVehicle from './pages/fleet/adminUpdateVehicle.jsx';
import AdminAddVehicle from './pages/fleet/adminAddVehicle.jsx';
import VehicleDetails from './pages/fleet/vehicleDetails.jsx';
import AdminVehicleFleet from './pages/fleet/adminVehicleFleet.jsx';
import AddVehicle from './pages/fleet/vehicleAdd.jsx';

function App() {
  return (
    <BrowserRouter path ="/*">
      <Toaster/>
      <Routes>
        <Route path="/user/*" element={<UserDashboard/>} />
        <Route path="/*" element={<HomePage/>} />
        <Route path="/login" element ={<LoginPage></LoginPage>}></Route>
        <Route path="/admin/" element={<AdminPage/>}/>


        <Route path="/fleet" element={<AdminVehicleFleet />} />
        <Route path="/fleet/add" element={<AddVehicle />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
