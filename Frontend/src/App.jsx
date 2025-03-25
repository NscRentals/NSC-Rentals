import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import DriverRegister from './components/driver/driverRegistration';
import AllDrivers from './components/driver/allDrivers';
import DriverProfile from './components/driver/driverProfile';
import DriverDashboard from './components/driver/driverDash';    
import DriverProfileUpdate from './components/driver/driverProfileupdate';




export default class App extends Component {

  

     render() {
      
      return (

        //  <div className = "container">

        //           <DriverRegister />

        //  </div>

        <div className = "container"> 

           <Router> 

            <Routes>
             
              <Route path="/register" element={<DriverRegister />} />
              <Route path="/drivers" element={<AllDrivers />} />
              <Route path="/dashboard" element={< DriverDashboard />} />   
              <Route path="/driverprofile/:id" element={<DriverProfile />} />     
              <Route path ="/driverprofile/update/:id" element={<DriverProfileUpdate />} />  
              
               
              
            </Routes>

          </Router> 




        </div>

        
      );
    }

  }