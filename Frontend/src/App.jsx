import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import NavBar from "./components/navBar.jsx";
import AdminAddSpareParts from "./components/adminAddSpareParts.jsx";
import AdminUpdateSpareParts from "./components/adminUpdateSpareParts.jsx";
import AdminDeleteSpareParts from "./components/adminDeleteSpareParts.jsx";
//import SparePartsDetails from "./components/sparePartsDetails.jsx";
import adminViewDetails from "./components/adminViewDetails";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container">
        <Routes>
         
          <Route path="/adminViewDetails" element={<adminViewDetails />} />
          {/* <Route path="/add-spareParts" element={<AdminAddSpareParts />} /> */}
          {/* <Route path="/update-spareParts/:id" element={<AdminUpdateSpareParts />} /> */}
          {/* <Route path="/delete-spareParts/:id" element={<AdminDeleteSpareParts />} /> */}
          {/* <Route path="/sparePartsDetails" element={<SparePartsDetails />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
