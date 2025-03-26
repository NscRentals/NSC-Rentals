// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const DriverRegister = () => {
//   const [formData, setFormData] = useState({
//     DriverName: '',
//     DriverPhone: '',
//     DriverAdd: '',
//     DriverEmail: '',
//     DLNo: '',
//     NICNo: '',
//     DriverPW: ''
//   });
//   const [message, setMessage] = useState('');
//   const [driverID, setDriverID] = useState(null);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:4000/api/driver/register', formData);
//       setMessage(response.data.success);
//       setDriverID(response.data.driverID);
//       setFormData({
//         DriverName: '',
//         DriverPhone: '',
//         DriverAdd: '',
//         DriverEmail: '',
//         DLNo: '',
//         NICNo: '',
//         DriverPW: ''
//       });
//       setTimeout(() => navigate('/drivers'), 2000);
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'An error occurred');
//     }
//   };

//   return (
//     <div className="">
//       <div className="">
//         <h2 className="">Driver Registration</h2>
//         <p className="text-center mb-8">Fill out the form carefully to register the driver</p>
//         {message && <div className="">{message}</div>}
//         {driverID && <div className="">Assigned Driver ID: {driverID}</div>}
        
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="">
//             <div>
//               <label className="">Driver Name</label>
//               <input
//                 type="text"
//                 name="DriverName"
//                 value={formData.DriverName}
//                 onChange={handleChange}
//                 className=""
//                 required
//               />
//             </div>

//             <br></br>

//             <div>
//               <label className="block text-gray-700 font-medium mb-2">Driver Phone</label>
//               <input
//                 type="text"
//                 name="DriverPhone"
//                 value={formData.DriverPhone}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
//                 required
//               />
//             </div>
//           </div>

//           <br></br>

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Address</label>
//             <input
//               type="text"
//               name="DriverAdd"
//               value={formData.DriverAdd}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
//               required
//             />
//           </div>

//           <br></br>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">Email</label>
//               <input
//                 type="email"
//                 name="DriverEmail"
//                 value={formData.DriverEmail}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
//                 required
//               />
//             </div>

//             <br></br>

//             <div>
//               <label className="block text-gray-700 font-medium mb-2">Driving License No</label>
//               <input
//                 type="text"
//                 name="DLNo"
//                 value={formData.DLNo}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
//                 required
//               />
//             </div>
//           </div>

//           <br></br>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">NIC No</label>
//               <input
//                 type="text"
//                 name="NICNo"
//                 value={formData.NICNo}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
//                 required
//               />
//             </div>
//             <br></br>
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">Password</label>
//               <input
//                 type="password"
//                 name="DriverPW"
//                 value={formData.DriverPW}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
//                 required
//               />
//             </div>
//           </div>
          
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105"
//           >
//             Register Driver
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DriverRegister;




import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TechnicianRegister = () => {
  const [formData, setFormData] = useState({
    TechnicianName: '',
    TechnicianAdd: ''
  });

  const [message, setMessage] = useState('');
  const [TechnicianID, technicianDriverID] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/technician/add', formData);
      setMessage(response.data.success);
      setDriverID(response.data.driverID);
      setFormData({
       TechnicianName: '',
    TechnicianAdd: ''
      });

      setTimeout(() => navigate('/technician/find'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-3xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Technician Registration</h2>
        <p className="text-center text-gray-600 mb-8">Fill out the form carefully to signup as a Technician</p>
        {message && <div className="text-center text-green-600 font-semibold mb-4">{message}</div>}
        {driverID && <div className="text-center text-blue-600 font-semibold mb-4">Assigned Technician ID: {driverID}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Technician Name</label>
              <input
                type="text"
                name="TechnicianName"
                value={formData.TechnicianName}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tech Address</label>
              <input
                type="text"
                name="TechnicianAdd"    
                value={formData.TechnicianAdd}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                required
              />
            </div>
          </div>
{/* 
          <div>
            <label className="block text-gray-700 font-medium mb-2">Address</label>
            <input
              type="text"
              name="DriverAdd"
              value={formData.DriverAdd}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="DriverEmail"
                value={formData.DriverEmail}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Driving License No</label>
              <input
                type="text"
                name="DLNo"
                value={formData.DLNo}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">NIC No</label>
              <input
                type="text"
                name="NICNo"
                value={formData.NICNo}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="DriverPW"
                value={formData.DriverPW}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                required
              />
            </div>
          </div> */}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Technician SIgnup
          </button>
        </form>
      </div>
    </div>
  );
};

export default TechnicianRegister;
