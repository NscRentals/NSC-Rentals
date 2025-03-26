import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserDashboard from './pages/user/userDashboard';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import {Toaster} from "react-hot-toast";
import AdminPage from './pages/admin/adminDashboard';
import React from "react";
import AdminAddSpareParts from "./components/adminAddSpareParts.jsx";
import AdminUpdateSpareParts from "./components/adminUpdateSpareParts.jsx";
import AdminDeleteSpareParts from "./components/adminDeleteSpareParts.jsx";
import adminViewDetails from "./components/adminViewDetails";


import TechnicianDashboard from './components/techniciansDashboard.jsx';
import TechnicianRegister from './components/technicianRegister.jsx';   

export default function App() {
  return (
    <BrowserRouter path ="/*">
      <Toaster/>
      <Routes>
        <Route path="/user/*" element={<UserDashboard/>} />
        <Route path="/*" element={<HomePage/>} />
        <Route path="/login" element ={<LoginPage></LoginPage>}></Route>
        <Route path="/admin/" element={<AdminPage/>}/>
        <Route path="/adminViewDetails" element={<adminViewDetails />} />



        <Route path="/technician/register" element={<TechnicianRegister/>}/>    
        <Route path="/technician/dashboard" element={<TechnicianDashboard/>}/>    
      

      </Routes>
    </BrowserRouter>
  );
    
}
