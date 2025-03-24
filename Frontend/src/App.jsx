import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import DriverRegister from './components/driver/driverRegistration';
import AllDrivers from './components/driver/allDrivers';
import DriverProfile from './components/driver/driverProfile';
import DriverDashboard from './components/driver/driverDash';    


// import DriverRegister from './componenets/driver/driverRegistration';
// import AllDrivers from './components/driver/allDrivers';



export default class App extends Component {

 /* 
  constructor(props) {
    super(props);
    this.state = {
      drivers:[]
      
    };
  }

  componentDidMount(){
    this.retrieveDrivers();
   // this.DriverRegister();
  }
*/
  


/*
//corrected code for the get driver option
  retrieveDrivers(){
    axios.get('http://localhost:4000/api/driver/')
      .then(res => {
        console.log("API Response:", res.data); // Debugging
  
        if(res.data.success){  // Fix: "sucess" → "success"
          this.setState({
            drivers: res.data.posts
          }, () => {
            console.log("Updated State:", this.state.drivers); // Debugging
          });
        } else {
          console.log("No drivers found.");
        }
      })
      .catch(error => {
        console.error("Fetch Error:", error);
      });
  }
  
*/


/*
  // Delete driver from backend and update state
  deleteDriver(driverId) {
    axios.delete(`http://localhost:4000/api/driver/delete/${driverId}`)
      .then(res => {
        console.log("Delete Response:", res.data); // Debugging

        if (res.data.success) {
          // Remove the driver from the state
          this.setState(prevState => ({
            drivers: prevState.drivers.filter(driver => driver._id !== driverId)
          }), () => {
            console.log("Updated State after Deletion:", this.state.drivers);
          });
        } else {
          console.log("Failed to delete driver.");
        }
      })
      .catch(error => {
        console.error("Delete Error:", error);
      });
  }


*/

  

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
              
               
              
            </Routes>

          </Router> 




        </div>

        
      );
    }



/*
          <p>All Drivers</p>
    
          <table className="driver-table">
            <thead>
              <tr>
                <th scope="col"># ID</th>
                <th scope="col">Driver Name</th>
                <th scope="col">Driver Address</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
    
            <tbody>
              {this.state.drivers.map((driver, index) => (  // Fixed parameter
                <tr>  
                  <th scope="row">{index + 1}</th>
                  <td>{driver.DriverName}</td>  
                  <td>{driver.DriverAdd}</td>
                  <td>
                    <a className="btn btn-warning" href="#">
                      <i className="fas fa-edit"></i>&nbsp;Edit
                    </a>
                    &nbsp;
                    <a className="btn btn-danger" href="#" onClick={() => this.deleteDriver(driver._id)}>
                      <i className="far fa-trash-alt"></i>&nbsp;Delete  
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      );
    }

  }    
    */   
       
     /*
        <div>
          <p>All Drivers</p>
    
          <table className="driver-table">
            <thead>
              <tr>
                <th scope="col"># ID</th>
                <th scope="col">Driver Name</th>
                <th scope="col">Driver Address</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
    
            <tbody>
              {this.state.drivers.map((driver, index) => (  // Fixed parameter
                <tr>  
                  <th scope="row">{index + 1}</th>
                  <td>{driver.DriverName}</td>  
                  <td>{driver.DriverAdd}</td>
                  <td>
                    <a className="btn btn-warning" href="#">
                      <i className="fas fa-edit"></i>&nbsp;Edit
                    </a>
                    &nbsp;
                    <a className="btn btn-danger" href="#">
                      <i className="far fa-trash-alt"></i>&nbsp;Delete  
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      );
    }

*/

  }
