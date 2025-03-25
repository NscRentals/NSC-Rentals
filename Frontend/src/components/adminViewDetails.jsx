import React, { Component } from "react";
import axios from "axios";

export default class adminViewDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spareParts: [],
    };
  }

  componentDidMount() {
    this.retrievespareParts();
  }

  retrievespareParts() {
    axios.get("http://localhost:4000/api/maintenance")
    .then((res) => {
      this.setState({ spareParts: res.data });
      console.log(res.data);
    })
    .catch(err => {
      console.error("Error fetching spare parts:", err);
    });
  
  }

  render() {
    return (
      <div className='container'> 
        
        <h1 className='text-center'>Spare Parts Inventory</h1>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Part Name</th>
              <th>Category</th>
              <th>Specifications</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Last Updated</th>
             
             
            </tr>
          </thead>
          <tbody>
            {this.state.spareParts.map((sparePart,index) => (
             <tr>
                <th scope ='row'>{index+1}</th>
                <td>
                  <a href={ '/sparePart/${sparePart._id}'} style={{textDecoration: 'none'}}>
                  </a>
                </td>
                <td>{sparePart.name}</td>
                <td>{sparePart.category}</td>
                <td>{sparePart.specifications}</td>
                <td>{sparePart.quantity}</td>
                <td>{sparePart.price}</td>
                <td>{sparePart.availability ? "Available" : "Not Available"}</td>
                <td>{sparePart.lastUpdated}</td>
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

        <button className="btn btn success"><a href="/add" style={{textDecoration:'none',color:white}}>Add new spare Part</a></button>
      </div>
    )
  }
}
