import React, { Component } from 'react';
import axios from 'axios';

export default class adminVehicleFleet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicles: []
    }
  }

  componentDidMount() {
    this.retrieveVehicles();
  }
  

  retrieveVehicles = () => {
    axios.get('http://localhost:4000/api/vehicles')
      .then(res => {
        console.log('Server data:', res.data);
        this.setState({ vehicles: res.data }); 
      });
  };
  
  render() {
    return (
      <div className="container">

        <h1>Vehicle Fleet</h1>

        <table className= "table">
          <thead>
            <tr>
              <th scope="col">Vehicle ID</th>
              <th scope="col">Owner Type</th>
              <th scope="col">Vehicle Type</th>
              <th scope="col"> Make</th>
              <th scope="col">Model</th>
              <th scope="col">Year</th>
              <th scope="col">Registration Number</th>
              <th scope="col">Availability</th>
              <th scope="col">Daily Price</th>
              <th scope="col">Condition</th>
              <th scope="col">Maintenance Status</th>
            </tr>
          </thead>

          <tbody>
            {this.state.vehicles.map((vehicle, index) => (
              <tr key={index}> 
                <td scope="row">
                  <a href={'/vehicle-details/${vehicle._id}'} style={{textDecoration:'none'}} >{vehicle.vehicleID}</a>
              </td>
                <td scope="row">{vehicle.owner && vehicle.owner.ownerType}</td>
                <td scope="row">{vehicle.vehicleType}</td>
                <td scope="row">{vehicle.make}</td>
                <td scope="row">{vehicle.model}</td>
                <td scope="row">{vehicle.year}</td>
                <td scope="row">{vehicle.registrationNumber}</td>
                <td scope="row">{vehicle.availabilityStatus}</td>
                <td scope="row">{vehicle.pricing && vehicle.pricing.daily}</td>
                <td scope="row">{vehicle.condition}</td>
                <td scope="row">{vehicle.maintenance && vehicle.maintenance.maintenanceStatus}</td>
                <td>
                  <a href="#" className="btn btn-warning">Edit</a>
               </td>
               <td>
                  <a href="#" className="btn btn-danger">Delete</a>
               </td>
             </tr>
            ))}

          </tbody>  
        </table>  

        <button className="btn btn-success"> <a href="/add-vehicle" style={{textDecoration:'none', color:'white'}}> Add vehicle </a> </button>

      </div>
    ) 
  }
}
