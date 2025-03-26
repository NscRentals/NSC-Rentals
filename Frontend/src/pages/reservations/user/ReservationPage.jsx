import React, { Component } from "react";
import axios from "axios";

export default class ReservationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reservationType: "normal",
      name: "",
      email: "",
      pickupLocation: "",
      weddingDate: "",
      startTime: "",
      endTime: "",
      decorations: false,
      driverReq: false,
      startDate: "",
      endDate: "",
    };
  }

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
  
    const newReservation = {
      rType: this.state.reservationType,  
      email: this.state.email,
      pickupLocation: this.state.pickupLocation,
      driverReq: this.state.driverReq,
    };
  
    // Conditionally add wedding fields
    if (this.state.reservationType === "wedding") {
      newReservation.weddingDate = this.state.weddingDate;
      newReservation.startTime = this.state.startTime;
      newReservation.endTime = this.state.endTime;
      newReservation.decorations = this.state.decorations;
    }
  
    // Conditionally add normal reservation fields
    if (this.state.reservationType === "normal") {
      newReservation.startDate = this.state.startDate;
      newReservation.endDate = this.state.endDate;
      newReservation.startTime = this.state.startTime;
      newReservation.endTime = this.state.endTime;
    }
  
    console.log("Submitting reservation:", newReservation);
  
    axios
      .post("http://localhost:4000/api/reservations/", newReservation)
      .then((res) => {
        if (res.data.success) {
          alert("Reservation Request Sent Successfully!");
          window.location.href = "/"; // Redirect back to home page after success
        }
      })
      .catch((error) => {
        console.error("Error sending reservation request:", error.response?.data || error);
      });
  };
  

  render() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reservation Form</h2>
          <form onSubmit={this.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Pickup Location</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="pickupLocation"
                value={this.state.pickupLocation}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Reservation Type</label>
              <select
                name="reservationType"
                value={this.state.reservationType}
                onChange={this.handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="normal">Normal</option>
                <option value="wedding">Wedding</option>
              </select>
            </div>

            {/* Wedding-specific fields */}
            {this.state.reservationType === "wedding" && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Wedding Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="weddingDate"
                    value={this.state.weddingDate}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="startTime"
                    value={this.state.startTime}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="endTime"
                    value={this.state.endTime}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Want Decorations?</label>
                  <input
                    type="checkbox"
                    name="decorations"
                    checked={this.state.decorations}
                    onChange={this.handleInputChange}
                    className="form-checkbox"
                  />
                </div>

                {/* Add button to go to /decorations */}
                {this.state.decorations && (
                  <div>
                    <a
                      href="/decorations"
                      className="w-full bg-blue-500 text-white py-2 rounded-lg text-center block mt-4"
                    >
                      Go to Decorations
                    </a>
                  </div>
                )}
              </>
            )}

            {/* Normal-specific fields */}
            {this.state.reservationType === "normal" && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="startDate"
                    value={this.state.startDate}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="endDate"
                    value={this.state.endDate}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="startTime"
                    value={this.state.startTime}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="endTime"
                    value={this.state.endTime}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">Want a Driver?</label>
              <input
                type="checkbox"
                name="driverReq"
                checked={this.state.driverReq}
                onChange={this.handleInputChange}
                className="form-checkbox"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Submit Reservation
            </button>
          </form>
        </div>
      </div>
    );
  }
}





// // import React, { useState } from 'react';
// // import { useHistory } from 'react-router-dom';

// // function ReservationPage() {
// //     const [reservationType, setReservationType] = useState('normal');
// //     const [formData, setFormData] = useState({
// //         name: '',
// //         email: '',
// //         pickupLocation: '',
// //         weddingDate: '',
// //         startTime: '',
// //         endTime: '',
// //         decorations: false,
// //         decoType: '',
// //         driverReq: false,
// //         startDate: '',
// //         endDate: '',
// //     });
// //     const history = useHistory();

// //     // Handle input changes for form fields
// //     const handleChange = (e) => {
// //         const { name, value, type, checked } = e.target;
// //         setFormData({
// //             ...formData,
// //             [name]: type === 'checkbox' ? checked : value,
// //         });
// //     };

// //     // Handle form submission
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();

// //         try {
// //             const response = await fetch('/api/reservations', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify(formData),
// //             });

// //             if (response.ok) {
// //                 alert('Reservation submitted successfully!');
// //             } else {
// //                 alert('Failed to submit reservation.');
// //             }
// //         } catch (err) {
// //             console.error('Error submitting reservation:', err);
// //         }
// //     };

// //     // Redirect to decorations page when needed
// //     const handleDecorationClick = () => {
// //         history.push('/decorations');
// //     };

// //     return (
// //         <div>
// //             <h1>Reservation Form</h1>
// //             <form onSubmit={handleSubmit}>
// //                 <div>
// //                     <label>Name:</label>
// //                     <input
// //                         type="text"
// //                         name="name"
// //                         value={formData.name}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                 </div>

// //                 <div>
// //                     <label>Email:</label>
// //                     <input
// //                         type="email"
// //                         name="email"
// //                         value={formData.email}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                 </div>

// //                 <div>
// //                     <label>Pickup Location:</label>
// //                     <input
// //                         type="text"
// //                         name="pickupLocation"
// //                         value={formData.pickupLocation}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                 </div>

// //                 <div>
// //                     <label>Reservation Type:</label>
// //                     <select
// //                         name="rType"
// //                         value={reservationType}
// //                         onChange={(e) => {
// //                             setReservationType(e.target.value);
// //                             setFormData({ ...formData, rType: e.target.value });
// //                         }}
// //                         required
// //                     >
// //                         <option value="normal">Normal</option>
// //                         <option value="wedding">Wedding</option>
// //                     </select>
// //                 </div>

// //                 {/* Wedding-specific fields */}
// //                 {reservationType === 'wedding' && (
// //                     <>
// //                         <div>
// //                             <label>Wedding Date:</label>
// //                             <input
// //                                 type="date"
// //                                 name="weddingDate"
// //                                 value={formData.weddingDate}
// //                                 onChange={handleChange}
// //                                 required
// //                             />
// //                         </div>

// //                         <div>
// //                             <label>Start Time:</label>
// //                             <input
// //                                 type="time"
// //                                 name="startTime"
// //                                 value={formData.startTime}
// //                                 onChange={handleChange}
// //                                 required
// //                             />
// //                         </div>

// //                         <div>
// //                             <label>End Time:</label>
// //                             <input
// //                                 type="time"
// //                                 name="endTime"
// //                                 value={formData.endTime}
// //                                 onChange={handleChange}
// //                                 required
// //                             />
// //                         </div>

// //                         <div>
// //                             <label>Want Decorations?</label>
// //                             <input
// //                                 type="checkbox"
// //                                 name="decorations"
// //                                 checked={formData.decorations}
// //                                 onChange={handleChange}
// //                             />
// //                             {formData.decorations && (
// //                                 <button type="button" onClick={handleDecorationClick}>
// //                                     View All Decorations
// //                                 </button>
// //                             )}
// //                         </div>
// //                     </>
// //                 )}

// //                 {/* Normal-specific fields */}
// //                 {reservationType === 'normal' && (
// //                     <>
// //                         <div>
// //                             <label>Start Date:</label>
// //                             <input
// //                                 type="date"
// //                                 name="startDate"
// //                                 value={formData.startDate}
// //                                 onChange={handleChange}
// //                                 required
// //                             />
// //                         </div>

// //                         <div>
// //                             <label>End Date:</label>
// //                             <input
// //                                 type="date"
// //                                 name="endDate"
// //                                 value={formData.endDate}
// //                                 onChange={handleChange}
// //                                 required
// //                             />
// //                         </div>

// //                         <div>
// //                             <label>Start Time:</label>
// //                             <input
// //                                 type="time"
// //                                 name="startTime"
// //                                 value={formData.startTime}
// //                                 onChange={handleChange}
// //                                 required
// //                             />
// //                         </div>

// //                         <div>
// //                             <label>End Time:</label>
// //                             <input
// //                                 type="time"
// //                                 name="endTime"
// //                                 value={formData.endTime}
// //                                 onChange={handleChange}
// //                                 required
// //                             />
// //                         </div>
// //                     </>
// //                 )}

// //                 {/* Driver requirement field */}
// //                 <div>
// //                     <label>Want a Driver?</label>
// //                     <input
// //                         type="checkbox"
// //                         name="driverReq"
// //                         checked={formData.driverReq}
// //                         onChange={handleChange}
// //                     />
// //                 </div>

// //                 {/* Submit button */}
// //                 <div>
// //                     <button type="submit">Submit Reservation</button>
// //                 </div>
// //             </form>
// //         </div>
// //     );
// // }

// // export default ReservationPage;
