import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserDashboard from './pages/user/userDashboard';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import { Toaster } from 'react-hot-toast';
import AdminPage from './pages/admin/adminDashboard';

import DriverRegister from './components/driver/driverRegistration';
import AllDrivers from './components/driver/allDrivers';
import DriverProfile from './components/driver/driverProfile';
import DriverDashboard from './components/driver/driverDash';    
import DriverProfileUpdate from './components/driver/driverProfileupdate';


function App() {
  return (
    <BrowserRouter path ="/*">
      <Toaster/>
      <Routes>
        <Route path="/user/*" element={<UserDashboard/>} />
        <Route path="/*" element={<HomePage/>} />
        <Route path="/login" element ={<LoginPage></LoginPage>}></Route>
        <Route path="/admin/" element={<AdminPage/>}/>
        <Route path="/register" element={<DriverRegister />} />
              <Route path="/drivers" element={<AllDrivers />} />
              <Route path="/dashboard" element={< DriverDashboard />} />   
              <Route path="/driverprofile/:id" element={<DriverProfile />} />     
              <Route path ="/driverprofile/update/:id" element={<DriverProfileUpdate />} />  

      </Routes>
    </BrowserRouter>
  );
}

export default App;
