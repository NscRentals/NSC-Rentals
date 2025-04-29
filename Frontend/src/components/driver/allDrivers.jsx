import React, { Component } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

class AllDrivers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drivers: []
    };
  }

  componentDidMount() {
    this.retrieveDrivers();
  }

  retrieveDrivers = () => {
    axios.get('http://localhost:4000/api/driver/')
      .then(res => {
        console.log("API Response:", res.data);

        if (res.data.success) {
          this.setState({
            drivers: res.data.posts
          }, () => {
            console.log("Updated State:", this.state.drivers);
          });
        } else {
          console.log("No drivers found.");
        }
      })
      .catch(error => {
        console.error("Fetch Error:", error);
      });
  }

  deleteDriver(driverId) {
    axios.delete(`http://localhost:4000/api/driver/delete/${driverId}`)
      .then(res => {
        console.log("Delete Response:", res.data);

        if (res.data.success) {
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

  render() {
    return (
      <div className="container">
        <h2>All Drivers - Admin Panel </h2>

        <button onClick={() => this.props.navigate('/register')} className="btn btn-primary">
          Register New Driver
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Driver ID</th>
              <th>Driver Name</th>
              <th>Driver Phone</th>
              <th>Driver Address</th>
              <th>Driver Email</th>
              <th>DL No</th>
              <th>NIC No</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.drivers.map((driver, index) => (
              <tr key={driver._id}>
                <td>{index + 1}</td>
                <td>{driver.DriverID}</td>
                <td>{driver.DriverName}</td>
                <td>{driver.DriverPhone}</td>
                <td>{driver.DriverAdd}</td>
                <td>{driver.DriverEmail}</td>
                <td>{driver.DLNo}</td>
                <td>{driver.NICNo}</td>
                <td>
                  <button className="btn btn-warning">Edit</button>
                  &nbsp;
                  <button className="btn btn-danger" onClick={() => this.deleteDriver(driver._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

function AllDriversWrapper() {
  const navigate = useNavigate();
  return <AllDrivers navigate={navigate} />;
}

export default AllDriversWrapper;
