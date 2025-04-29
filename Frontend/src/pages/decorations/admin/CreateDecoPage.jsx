import React, { Component } from "react";
import axios from "axios";

export default class CreateDeco extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "",
      price: "",
      description: "",
      images: "",
      errors: {}
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for price field
    if (name === "price") {
      // Only allow numbers and decimal point
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        this.setState({ [name]: value, errors: { ...this.state.errors, [name]: "" } });
      }
    } else {
      this.setState({ [name]: value, errors: { ...this.state.errors, [name]: "" } });
    }
  };

  validateForm = () => {
    const errors = {};
    const { type, price, description, images } = this.state;

    if (!type) errors.type = "Type is required";
    if (!price) errors.price = "Price is required";
    if (price) {
      const numericValue = parseFloat(price);
      if (isNaN(numericValue)) {
        errors.price = "Please enter a valid number";
      } else if (numericValue <= 0) {
        errors.price = "Price must be greater than 0";
      }
    }
    if (!description) errors.description = "Description is required";
    if (!images) errors.images = "Image URL is required";

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.validateForm()) {
      const newDeco = {
        type: this.state.type,
        price: this.state.price,
        description: this.state.description,
        images: this.state.images,
      };

      axios
        .post("http://localhost:4000/api/deco/save", newDeco)
        .then((res) => {
          if (res.data.success) {
            alert("Decoration Added Successfully!");
            window.location.href = "/deco";
          }
        })
        .catch((error) => {
          console.error("Error adding decoration:", error);
        });
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Decoration</h2>
            
            <form onSubmit={this.handleSubmit} className="space-y-6">
              {/* Type Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-mygreen focus:border-transparent`}
                  name="type"
                  value={this.state.type}
                  onChange={this.handleInputChange}
                  placeholder="Enter decoration type"
                  required
                />
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
              </div>

              {/* Price Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (LKR)</label>
                <input
                  type="text"
                  pattern="[0-9]*[.]?[0-9]*"
                  inputMode="decimal"
                  className={`w-full px-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-mygreen focus:border-transparent`}
                  name="price"
                  value={this.state.price}
                  onChange={this.handleInputChange}
                  placeholder="Enter price"
                  required
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-mygreen focus:border-transparent`}
                  name="description"
                  value={this.state.description}
                  onChange={this.handleInputChange}
                  placeholder="Enter decoration description"
                  rows="4"
                  required
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Image URL Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-mygreen focus:border-transparent`}
                  name="images"
                  value={this.state.images}
                  onChange={this.handleInputChange}
                  placeholder="Enter image URL"
                  required
                />
                {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-mygreen text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add Decoration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

















// import React, { Component } from "react";
// import axios from "axios";

// export default class CreateDeco extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       dId: "",
//       type: "",
//     };
//   }

//   handleInputChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   handleSubmit = (e) => {
//     e.preventDefault();

//     const newDeco = {
//       type: this.state.type,
//     };

//     axios
//       .post("http://localhost:4000/api/deco/save", newDeco)
//       .then((res) => {
//         if (res.data.success) {
//           alert("Decoration Added Successfully!");
//           window.location.href = "/"; // Redirect back to home
//         }
//       })
//       .catch((error) => {
//         console.error("Error adding decoration:", error);
//       });
//   };

//   render() {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Decoration</h2>
//           <form onSubmit={this.handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">Type</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 name="type"
//                 value={this.state.type}
//                 onChange={this.handleInputChange}
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
//             >
//               Add Decoration
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }
// }




// // import React, { Component } from "react";
// // import axios from "axios";

// // export default class CreateDeco extends Component {
// //   constructor(props) {
// //     super(props);

// //     this.state = {
// //       dId: "",
// //       type: "",
// //     };
// //   }

// //   handleInputChange = (e) => {
// //     this.setState({ [e.target.name]: e.target.value });
// //   };

// //   handleSubmit = (e) => {
// //     e.preventDefault();

// //     const newDeco = {
// //       type: this.state.type,
// //     };

// //     axios
// //       .post("http://localhost:4000/api/deco/save", newDeco)
// //       .then((res) => {
// //         if (res.data.success) {
// //           alert("Decoration Added Successfully!");
// //           window.location.href = "/"; // Redirect back to home
// //         }
// //       })
// //       .catch((error) => {
// //         console.error("Error adding decoration:", error);
// //       });
// //   };

// //   render() {
// //     return (
// //       <div className="container">
// //         <h2>Add New Decoration</h2>
// //         <form onSubmit={this.handleSubmit}>
// //           {/* Remove dId input field */}
// //           <div className="form-group">
// //             <label>Type</label>
// //             <input
// //               type="text"
// //               className="form-control"
// //               name="type"
// //               value={this.state.type}
// //               onChange={this.handleInputChange}
// //               required
// //             />
// //           </div>
// //           <button type="submit" className="btn btn-success">
// //             Add Decoration
// //           </button>
// //         </form>
// //       </div>
// //     );
// //   }
// // }
