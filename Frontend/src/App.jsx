import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminUpdateVehicle from './components/adminUpdateVehicle.jsx';
import AdminAddVehicle from './components/adminAddVehicle.jsx';
import VehicleDetails from './components/vehicleDetails.jsx';
import AdminVehicleFleet from './components/adminVehicleFleet.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<AdminVehicleFleet />} />
          <Route path="/add-vehicle" element={<AdminAddVehicle />} />
          <Route path="/update-vehicle/:id" element={<AdminUpdateVehicle />} />
          <Route path="/vehicle-details/:_id" element={<VehicleDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
