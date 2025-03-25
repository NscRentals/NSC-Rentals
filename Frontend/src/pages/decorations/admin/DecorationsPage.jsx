import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class DecorationsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      decorations: [],
    };
  }

  componentDidMount() {
    this.retrieveDecorations();
  }

  retrieveDecorations() {
    axios
      .get("http://localhost:4000/api/deco/get/")
      .then((res) => {
        if (res.data.success) {
          this.setState({
            decorations: res.data.deco,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching decorations:", error);
      });
  }

  deleteDecoration = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this decoration?");
    if (!confirmDelete) return;

    axios
      .delete(`http://localhost:4000/api/deco/delete/${id}`)
      .then((res) => {
        if (res.data.success) {
          alert("Decoration Deleted Successfully!");
          this.setState({
            decorations: this.state.decorations.filter((deco) => deco._id !== id),
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting decoration:", error);
      });
  };

  render() {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white py-4 shadow-md">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold">Wedding Car Decorations</h1>
          </div>
        </header>

        <main className="container mx-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Decorations</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Decoration ID</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.decorations.map((decoration, index) => (
                  <tr key={index} className="text-center border-b">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Link to={`/deco/${decoration._id}`} className="text-blue-500 hover:underline">
                        {decoration.dId}
                      </Link>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{decoration.type}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <a className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 transition" href={`/edit/${decoration._id}`}>
                        Edit
                      </a>
                      &nbsp;
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => this.deleteDecoration(decoration._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
              <a href="/add" className="text-white no-underline">
                Add New Decoration
              </a>
            </button>
          </div>
        </main>
      </div>
    );
  }
}

export default DecorationsPage;







// import React, { Component } from "react";
// import axios from "axios";

// class DecorationsPage extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       decorations: [],
//     };
//   }

//   componentDidMount() {
//     this.retrieveDecorations();
//   }

//   retrieveDecorations() {
//     axios
//       .get("http://localhost:4000/api/deco/get/")
//       .then((res) => {
//         if (res.data.success) {
//           this.setState({
//             decorations: res.data.deco,
//           });

//           console.log(this.state.decorations);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching decorations:", error);
//       });
//   }

//   deleteDecoration = (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this decoration?");
//     if (!confirmDelete) return;

//     axios
//       .delete(`http://localhost:4000/api/deco/delete/${id}`)
//       .then((res) => {
//         if (res.data.success) {
//           alert("Decoration Deleted Successfully!");
//           this.setState({
//             decorations: this.state.decorations.filter((deco) => deco._id !== id),
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error deleting decoration:", error);
//       });
//   };

//   render() {
//     return (
//       <div className="min-h-screen bg-gray-100">
//         <header className="bg-blue-600 text-white py-4 shadow-md">
//           <div className="container mx-auto text-center">
//             <h1 className="text-3xl font-bold">Wedding Car Decorations</h1>
//           </div>
//         </header>

//         <main className="container mx-auto p-6">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Decorations</h2>

//           {/* Cards Container */}
//           <div className="flex flex-wrap justify-center gap-6">
//             {this.state.decorations.map((decoration, index) => (
//               <div key={index} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 max-w-xs">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">{decoration.dId}</h3>
//                 <p className="text-gray-600 mb-4">{decoration.type}</p>

//                 {/* Action Buttons */}
//                 <div className="flex justify-between items-center">
//                   <a
//                     className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
//                     href={`/edit/${decoration._id}`}
//                   >
//                     Edit
//                   </a>
//                   <button
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                     onClick={() => this.deleteDecoration(decoration._id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Add New Decoration Button */}
//           <div className="mt-6 text-center">
//             <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
//               <a href="/add" className="text-white no-underline">
//                 Add New Decoration
//               </a>
//             </button>
//           </div>
//         </main>
//       </div>
//     );
//   }
// }

// export default DecorationsPage;























// import React, { Component } from "react";
// import axios from "axios";

// class DecorationsPage extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       decorations: [],
//     };
//   }

//   componentDidMount() {
//     this.retrieveDecorations();
//   }

//   retrieveDecorations() {
//     axios
//       .get("http://localhost:4000/api/deco/get/")
//       .then((res) => {
//         if (res.data.success) {
//           this.setState({
//             decorations: res.data.deco,
//           });

//           console.log(this.state.decorations);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching decorations:", error);
//       });
//   }

//   deleteDecoration = (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this decoration?");
//     if (!confirmDelete) return;

//     axios
//       .delete(`http://localhost:4000/api/deco/delete/${id}`)
//       .then((res) => {
//         if (res.data.success) {
//           alert("Decoration Deleted Successfully!");
//           this.setState({
//             decorations: this.state.decorations.filter((deco) => deco._id !== id),
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error deleting decoration:", error);
//       });
//   };

//   render() {
//     return (
//       <div className="min-h-screen bg-gray-100">
//         <header className="bg-blue-600 text-white py-4 shadow-md">
//           <div className="container mx-auto text-center">
//             <h1 className="text-3xl font-bold">Wedding Car Decorations</h1>
//           </div>
//         </header>

//         <main className="container mx-auto p-6">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Decorations</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border border-gray-300 px-4 py-2">#</th>
//                   <th className="border border-gray-300 px-4 py-2">Decoration ID</th>
//                   <th className="border border-gray-300 px-4 py-2">Type</th>
//                   <th className="border border-gray-300 px-4 py-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {this.state.decorations.map((decoration, index) => (
//                   <tr key={index} className="text-center border-b">
//                     <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       <a href={`/deco/${decoration._id}`} className="text-blue-500 hover:underline">
//                         {decoration.dId}
//                       </a>
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">{decoration.type}</td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       <a className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 transition" href={`/edit/${decoration._id}`}>
//                         Edit
//                       </a>
//                       &nbsp;
//                       <button
//                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                         onClick={() => this.deleteDecoration(decoration._id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-4">
//             <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
//               <a href="/add" className="text-white no-underline">
//                 Add New Decoration
//               </a>
//             </button>
//           </div>
//         </main>
//       </div>
//     );
//   }
// }

// export default DecorationsPage;
































