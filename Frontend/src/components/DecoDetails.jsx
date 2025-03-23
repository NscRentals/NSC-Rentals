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

    axios.get(`http://localhost:4000/api/deco/get/${id}`)
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
      <div className="container">
        <h2>Decoration Details</h2>
        <table className="table">
          <tbody>
            <tr>
              <th>Decoration ID</th>
              <td>{dId}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{type}</td>
            </tr>
          </tbody>
        </table>

        {/* Edit Button */}
        <a href={`/edit/${_id}`} className="btn btn-warning">
          Edit Details
        </a>
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







