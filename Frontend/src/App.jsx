import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserDashboard from './pages/user/userDashboard';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import {Toaster} from "react-hot-toast";
import AdminPage from './pages/admin/adminDashboard';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminAddSpareParts from "./components/adminAddSpareParts.jsx";
import AdminUpdateSpareParts from "./components/adminUpdateSpareParts.jsx";
import AdminDeleteSpareParts from "./components/adminDeleteSpareParts.jsx";
import adminViewDetails from "./components/adminViewDetails";

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
      </Routes>
    </BrowserRouter>
  );
    
}
