import React, { Component } from "react";
import axios from "axios";

export default class DecoDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      decoration: {},
    };
  }

  componentDidMount() {
    const id = window.location.pathname.split("/")[2]; // Extract ID from URL

    axios
      .get(`http://localhost:4000/api/deco/get/${id}`)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            decoration: res.data.deco,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching decoration details:", error);
      });
  }

  render() {
    const { _id, dId, type } = this.state.decoration;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Decoration Details</h2>
          <div className="border-t border-gray-300 pt-4">
            <p className="text-gray-700"><span className="font-semibold">Decoration ID:</span> {dId || "N/A"}</p>
            <p className="text-gray-700 mt-2"><span className="font-semibold">Type:</span> {type || "N/A"}</p>
          </div>
          {/* Edit Button */}
          <div className="mt-6 text-center">
            <a
              href={`/edit/${_id}`}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Edit Details
            </a>
          </div>
        </div>
      </div>
    );
  }
}










// import React, { Component } from "react";
// import axios from "axios";
// import { useParams, Link } from "react-router-dom";

// class DecoDetails extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       decoration: null,
//     };
//   }

//   componentDidMount() {
//     this.getDecorationDetails();
//   }

//   getDecorationDetails() {
//     const { id } = this.props.params; // Get the ID from URL params
//     axios
//       .get(`http://localhost:4000/api/deco/get/${id}`)
//       .then((res) => {
//         if (res.data.success) {
//           this.setState({
//             decoration: res.data.deco,
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching decoration details:", error);
//       });
//   }

//   render() {
//     const { decoration } = this.state;

//     if (!decoration) {
//       return <p>Loading...</p>;
//     }

//     return (
//       <div className="container">
//         <h2>Decoration Details</h2>
//         <table className="table">
//           <tbody>
//             <tr>
//               <th>Decoration ID</th>
//               <td>{decoration.dId}</td>
//             </tr>
//             <tr>
//               <th>Type</th>
//               <td>{decoration.type}</td>
//             </tr>
//             <tr>
//               <th>Description</th>
//               <td>{decoration.description}</td>
//             </tr>
//             <tr>
//               <th>Price</th>
//               <td>${decoration.price}</td>
//             </tr>
//           </tbody>
//         </table>

//         <Link to="/" className="btn btn-primary">Back to Home</Link>
//       </div>
//     );
//   }
// }

// // Use a wrapper function to get params in class components
// export default (props) => <DecoDetails {...props} params={useParams()} />;







// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const DecoDetails = () => {
//     const { id } = useParams();  // Get the "id" from the URL
//     const [decoration, setDecoration] = useState(null);

//     useEffect(() => {
//         axios.get(`http://localhost:8070/deco/${id}`)
//             .then((res) => {
//                 if (res.data.success) {
//                     setDecoration(res.data.decoration);
//                     console.log(res.data.decoration);
//                 }
//             })
//             .catch((error) => console.error("Error fetching decoration:", error));
//     }, [id]);

//     return (
//         <div>
//             <h2>Decoration Details</h2>
//             {decoration ? (
//                 <div>
//                     <p><strong>Decoration ID:</strong> {decoration.dId}</p>
//                     <p><strong>Type:</strong> {decoration.type}</p>

//                 </div>
//             ) : (
//                 <p>Loading...</p>
//             )}
//         </div>
//     );
// };

// export default DecoDetails;







// import React, { Component } from "react";
// import { useParams } from "react-router-dom";
// import axios from 'axios';

// export default class DecoDetails extends Component {
//     constructor(props){
//         super(props);

//         this.state = {
//             decoration: []
//         };
//     }

//     componentDidMount(){
//         const id = this.props.match.params.id;

//         axios.get(`http://localhost:8070/deco/${id}`).then((res) => {
//             if(res.data.success){
//                 this.setState({
//                     decoration: res.data.decoration
//                 });

//                 console.log(this.state.decoration);
//             }
//         });   
//     }

//     render(){
//          return(
//             <div>
//                 Decoration Details
//             </div>
//          )
//     }
// }







