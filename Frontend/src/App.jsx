import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Component } from "react";
import './App.css';
import UserDashboard from './pages/user/userDashboard';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import {Toaster} from "react-hot-toast";
import AdminPage from './pages/admin/adminDashboard';
import DecorationsPage from "./pages/decorations/admin/DecorationsPage";
import CreateDeco from "./pages/decorations/admin/CreateDecoPage";
import EditDeco from "./pages/decorations/admin/EditDecoPage";

import ReservationForm from "./pages/reservations/user/ReservationForm";
import DecorationsList from './pages/decorations/user/DecorationsList';

function App() {
  return (
    <BrowserRouter path ="/*">
      <Toaster/>
      <Routes>
        <Route path="/user/*" element={<UserDashboard/>} />
        <Route path="/*" element={<HomePage/>} />
        <Route path="/login" element ={<LoginPage></LoginPage>}></Route>
        <Route path="/admin/" element={<AdminPage/>}/>
        <Route path="/" element={<DecorationsPage />} />
        <Route path="/add" element={<CreateDeco />} />
        <Route path="/edit/:id" element={<EditDeco />} />
        <Route path="/reservations" element={<ReservationForm />} />
        <Route path="/decorations" element={<DecorationsList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
