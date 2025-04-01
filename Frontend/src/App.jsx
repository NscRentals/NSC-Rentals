import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserDashboard from './pages/user/userDashboard';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import {Toaster} from "react-hot-toast";
import AdminPage from './pages/admin/adminDashboard';
import TechDashboard from './pages/technician/techDashboard';
import DriverDashboard from './pages/driver/driverDashboard';
import SignUp from './pages/user/UserSignUp';

function App() {
  return (
    <BrowserRouter path ="/*">
      <Toaster/>
      <Routes>
        <Route path="/user/*" element={<UserDashboard/>} />
        <Route path="/*" element={<HomePage/>} />
        <Route path="/login" element ={<LoginPage></LoginPage>}></Route>
        <Route path="/admin/" element={<AdminPage/>}/>
        <Route path="/Tech" element ={<TechDashboard/>}></Route>
        <Route path="/Driver" element ={<DriverDashboard/>}></Route>
        <Route path="/user/add" element={<SignUp></SignUp>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
