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
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

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
          window.location.href = "/deco"; // Redirect back to home page after success
        }
      })
      .catch((error) => {
        console.error("Error adding decoration:", error);
      });
  };

  render() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Decoration</h2>
          <form onSubmit={this.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Type</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="type"
                value={this.state.type}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Price</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="price"
                value={this.state.price}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="description"
                value={this.state.description}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Image URL</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="images"
                value={this.state.images}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Add Decoration
            </button>
          </form>
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
