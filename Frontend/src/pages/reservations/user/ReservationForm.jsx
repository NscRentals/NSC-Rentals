import React, { Component } from "react";
import axios from "axios";

export default class ReservationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customerName: "",
      contactNumber: "",
      email: "",
      reservationDate: "",
      weddingCar: "",
      decoration: "",
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const reservationData = { ...this.state };

    axios
      .post("http://localhost:4000/api/reservation/create", reservationData)
      .then((res) => {
        if (res.data.success) {
          alert("Reservation Created Successfully!");
          this.setState({
            customerName: "",
            contactNumber: "",
            email: "",
            reservationDate: "",
            weddingCar: "",
            decoration: "",
          });
        }
      })
      .catch((error) => {
        console.error("Error creating reservation:", error);
      });
  };

  render() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Create Reservation</h2>
          <form onSubmit={this.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={this.state.customerName}
                onChange={this.handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={this.state.contactNumber}
                onChange={this.handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Reservation Date</label>
              <input
                type="date"
                name="reservationDate"
                value={this.state.reservationDate}
                onChange={this.handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Wedding Car</label>
              <select
                name="weddingCar"
                value={this.state.weddingCar}
                onChange={this.handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a Wedding Car</option>
                {/* Replace with dynamic car options */}
                <option value="Car1">Car 1</option>
                <option value="Car2">Car 2</option>
                <option value="Car3">Car 3</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Decoration</label>
              <select
                name="decoration"
                value={this.state.decoration}
                onChange={this.handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Decoration</option>
                {/* Replace with dynamic decoration options */}
                <option value="Decoration1">Decoration 1</option>
                <option value="Decoration2">Decoration 2</option>
                <option value="Decoration3">Decoration 3</option>
              </select>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Create Reservation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
