import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DecorationsPage = () => {
  const [decorations, setDecorations] = useState([]);
  const navigate = useNavigate();

  // Fetch decorations
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/deco/get")
      .then((response) => {
        if (response.data.success) {
          setDecorations(response.data.deco);
        }
      })
      .catch((error) => console.error("Error fetching decorations:", error));
  }, []);

  // Navigate to Add Decoration Page
  const handleAddDecorationClick = () => {
    navigate("/add");
  };

  // Navigate to Edit Decoration Page
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  // Delete Decoration
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this decoration?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/api/deco/delete/${id}`);
        alert("Decoration deleted successfully!");
        setDecorations(decorations.filter((deco) => deco._id !== id));
      } catch (error) {
        console.error("Error deleting decoration:", error);
        alert("Failed to delete decoration.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Decorations List</h2>

      {/* Decorations Table */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {decorations.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left text-xs text-gray-500">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Image URL</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {decorations.map((deco) => (
                <tr key={deco.dId} className="border-t">
                  <td className="border border-gray-300 px-4 py-2 text-xs text-gray-500">{deco.dId}</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{deco.type}</td>
                  <td className="border border-gray-300 px-4 py-2">LKR {deco.price}</td>
                  <td className="border border-gray-300 px-4 py-2">{deco.description}</td>
                  <td className="border border-gray-300 px-4 py-2 text-blue-500 break-all">{deco.images}</td>
                  <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(deco._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(deco._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No decorations available.</p>
        )}
      </div>

      {/* Add Decoration Button (Bottom) */}
      <button
        onClick={handleAddDecorationClick}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Add Decoration
      </button>
    </div>
  );
};

export default DecorationsPage;










// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const DecorationsPage = () => {
//   const [decorations, setDecorations] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [newDecoration, setNewDecoration] = useState({
//     type: '',
//     price: '',
//     description: '',
//     images: '',
//   });

//   // Fetch decorations from the server
//   useEffect(() => {
//     const fetchDecorations = async () => {
//       try {
//         const response = await axios.get('/api/decorations/get');
//         if (response.data.success) {
//           setDecorations(response.data.deco);
//         } else {
//           alert('No decorations found!');
//         }
//       } catch (error) {
//         console.error('Error fetching decorations:', error);
//       }
//     };
    
//     fetchDecorations();
//   }, []);

//   // Handle form input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewDecoration((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/decorations/save', newDecoration);
//       if (response.data.success) {
//         setDecorations([...decorations, { ...newDecoration, dId: response.data.dId }]);
//         setShowForm(false); // Close the form after submission
//         alert('Decoration added successfully!');
//       } else {
//         alert('Failed to add decoration!');
//       }
//     } catch (error) {
//       console.error('Error adding decoration:', error);
//       alert('Error adding decoration!');
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Decorations</h1>

//       <button
//         onClick={() => setShowForm(!showForm)}
//         className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6"
//       >
//         {showForm ? 'Cancel' : 'Add Decoration'}
//       </button>

//       {/* Add Decoration Form */}
//       {showForm && (
//         <form onSubmit={handleFormSubmit} className="mb-6 p-6 bg-gray-100 rounded-lg shadow-md">
//           <div className="mb-4">
//             <label htmlFor="type" className="block text-sm font-medium text-gray-700">
//               Decoration Type
//             </label>
//             <input
//               type="text"
//               id="type"
//               name="type"
//               value={newDecoration.type}
//               onChange={handleInputChange}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="price" className="block text-sm font-medium text-gray-700">
//               Price
//             </label>
//             <input
//               type="number"
//               id="price"
//               name="price"
//               value={newDecoration.price}
//               onChange={handleInputChange}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={newDecoration.description}
//               onChange={handleInputChange}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="images" className="block text-sm font-medium text-gray-700">
//               Image URL
//             </label>
//             <input
//               type="text"
//               id="images"
//               name="images"
//               value={newDecoration.images}
//               onChange={handleInputChange}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-md"
//           >
//             Add Decoration
//           </button>
//         </form>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {decorations.map((deco) => (
//           <div key={deco.dId} className="bg-white shadow-lg rounded-lg p-4">
//             <div className="flex justify-center mb-4">
//               <img src={deco.images} alt={deco.type} className="w-48 h-48 object-cover rounded-md" />
//             </div>

//             <div className="text-center">
//               <h3 className="text-xl font-semibold mb-2">{deco.type}</h3>
//               <p className="text-sm text-gray-500">ID: <span className="text-gray-800 font-medium">{deco.dId}</span></p>
//               <p className="mt-2 text-gray-700">{deco.description}</p>
//               <p className="mt-2 text-lg font-semibold text-green-600">${deco.price}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DecorationsPage;











// import React, { Component } from "react";
// import { Link } from "react-router-dom";
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
//       <div className="min-h-screen bg-gray-50">
//         <header className="bg-gray-800 text-white py-4 shadow-md">
//           <div className="container mx-auto text-center">
//             <h1 className="text-3xl font-semibold">Wedding Car Decorations List</h1>
//           </div>
//         </header>

//         <main className="container mx-auto p-6">
//           <h2 className="text-2xl font-medium text-gray-700 mb-4">All Decorations</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-300">
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
//                       <Link to={`/deco/${decoration._id}`} className="text-gray-600 hover:underline">
//                         {decoration.dId}
//                       </Link>
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">{decoration.type}</td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       <a
//                         className="text-gray-600 hover:underline px-3 py-1"
//                         href={`/edit/${decoration._id}`}
//                       >
//                         Edit
//                       </a>
//                       &nbsp;
//                       <button
//                         className="text-gray-600 hover:underline px-3 py-1"
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
//             <button className="text-gray-800 border border-gray-300 px-4 py-2 rounded hover:bg-gray-200 transition">
//               <a href="/add" className="no-underline">
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
