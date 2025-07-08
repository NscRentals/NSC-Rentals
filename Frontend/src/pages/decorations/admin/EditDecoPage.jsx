import React, { Component } from "react";
import axios from "axios";

export default class EditDeco extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dId: "",
      type: "",
      price: "",
      description: "",
      images: "",
      errors: {}
    };
  }

  componentDidMount() {
    const id = window.location.pathname.split("/")[2]; // Extract ID from URL

    axios
      .get(`http://localhost:4000/api/deco/get/${id}`)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            dId: res.data.deco.dId,
            type: res.data.deco.type,
            price: res.data.deco.price,
            description: res.data.deco.description,
            images: res.data.deco.images,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching decoration details:", error);
      });
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
    const id = window.location.pathname.split("/")[2];

    if (this.validateForm()) {
      const updatedDeco = {
        dId: this.state.dId,
        type: this.state.type,
        price: this.state.price,
        description: this.state.description,
        images: this.state.images,
      };

      axios
        .put(`http://localhost:4000/api/deco/update/${id}`, updatedDeco)
        .then((res) => {
          if (res.data.success) {
            alert("Decoration Updated Successfully!");
            window.location.href = "/deco";
          }
        })
        .catch((error) => {
          console.error("Error updating decoration:", error);
        });
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Decoration</h2>
            
            <form onSubmit={this.handleSubmit} className="space-y-6">
              {/* Decoration ID (Disabled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Decoration ID</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                  name="dId"
                  value={this.state.dId}
                  disabled
                />
              </div>

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

              {/* Update Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-mygreen text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Update Decoration
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

// export default class EditDeco extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       dId: "",
//       type: "",
//     };
//   }

//   componentDidMount() {
//     const id = window.location.pathname.split("/")[2]; // Extract ID from URL

//     axios
//       .get(`http://localhost:4000/api/deco/get/${id}`)
//       .then((res) => {
//         if (res.data.success) {
//           this.setState({
//             dId: res.data.deco.dId,
//             type: res.data.deco.type,
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching decoration details:", error);
//       });
//   }

//   handleInputChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   handleSubmit = (e) => {
//     e.preventDefault();
//     const id = window.location.pathname.split("/")[2];

//     const updatedDeco = {
//       dId: this.state.dId,
//       type: this.state.type,
//     };

//     axios
//       .put(`http://localhost:4000/api/deco/update/${id}`, updatedDeco)
//       .then((res) => {
//         if (res.data.success) {
//           alert("Decoration Updated Successfully!");
//           window.location.href = `/deco/${id}`; // Redirect back to details page
//         }
//       })
//       .catch((error) => {
//         console.error("Error updating decoration:", error);
//       });
//   };

//   render() {
//     return (
//       <div className="container">
//         <h2>Edit Decoration</h2>
//         <form onSubmit={this.handleSubmit}>
//           <div className="form-group">
//             <label>Decoration ID</label>
//             <input
//               type="text"
//               className="form-control"
//               name="dId"
//               value={this.state.dId}
//               onChange={this.handleInputChange}
//               disabled
//             />
//           </div>
//           <div className="form-group">
//             <label>Type</label>
//             <input
//               type="text"
//               className="form-control"
//               name="type"
//               value={this.state.type}
//               onChange={this.handleInputChange}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-success">
//             Update Decoration
//           </button>
//         </form>
//       </div>
//     );
//   }
// }
