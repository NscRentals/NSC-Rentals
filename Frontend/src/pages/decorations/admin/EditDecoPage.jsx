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
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const id = window.location.pathname.split("/")[2];

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
          window.location.href = "/"; // Redirect back to decorations list
        }
      })
      .catch((error) => {
        console.error("Error updating decoration:", error);
      });
  };

  render() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Edit Decoration</h2>
          <form onSubmit={this.handleSubmit} className="space-y-4">
            {/* Decoration ID (Disabled) */}
            <div>
              <label className="block text-gray-700 font-medium">Decoration ID</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg bg-gray-200 text-gray-700 cursor-not-allowed"
                name="dId"
                value={this.state.dId}
                disabled
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-gray-700 font-medium">Type</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="type"
                value={this.state.type}
                onChange={this.handleInputChange}
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium">Price (LKR)</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="price"
                value={this.state.price}
                onChange={this.handleInputChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium">Description</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="description"
                value={this.state.description}
                onChange={this.handleInputChange}
                rows="3"
                required
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-gray-700 font-medium">Image URL</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="images"
                value={this.state.images}
                onChange={this.handleInputChange}
                required
              />
            </div>

            {/* Update Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Update Decoration
            </button>
          </form>
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
