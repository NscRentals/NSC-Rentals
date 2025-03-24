import React, { Component } from "react";
import axios from "axios";

export default class HomeD extends Component {
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

          console.log(this.state.decorations);
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
      <div className="container">
        <p>All Decorations</p>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Decoration ID</th>
              <th scope="col">Type</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {this.state.decorations.map((decoration, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                  <a href={`/deco/${decoration._id}`} style={{ textDecoration: "none" }}>
                    {decoration.dId}
                  </a>
                </td>
                <td>{decoration.type}</td>
                <td>
                  <a className="btn btn-warning" href={`/edit/${decoration._id}`}>
                    Edit
                  </a>
                  &nbsp;
                  <button className="btn btn-danger" onClick={() => this.deleteDecoration(decoration._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn btn-success">
          <a href="/add" style={{ textDecoration: "none", color: "white" }}>
            Add New Decoration
          </a>
        </button>
      </div>
    );
  }
}



























// import React, { Component } from "react";
// import axios from "axios";

// export default class HomeD extends Component {
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

//   render() {
//     return (
//       <div className="container">
//         <p>All Decorations</p>
//         <table className="table">
//           <thead>
//             <tr>
//               <th scope="col">#</th>
//               <th scope="col">Decoration ID</th>
//               <th scope="col">Type</th>
//               <th scope="col">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {this.state.decorations.map((decorations, index) => (
//               <tr key={index}>
//                 <th scope="row">{index + 1}</th>
//                 <td>
//                   <a href={`/deco/${decorations._id}`} style={{ textDecoration: "none" }}>
//                     {decorations.dId}
//                   </a>
//                 </td>
//                 <td>{decorations.type}</td>
//                 <td>
//                   <a className="btn btn-warning" href="#">
//                     Edit
//                   </a>
//                   &nbsp;
//                   <a className="btn btn-danger" href="#">
//                     Delete
//                   </a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

    

//         <button className="btn btn-success">
//           <a href="/add" style={{ textDecoration: "none", color: "white" }}>
//             Add New Decoration
//           </a>
//         </button>


//       </div>
//     );
//   }
// }





































// import React, { Component } from "react";
// import axios from "axios";

// export default class HomeD extends Component {
//   constructor(props){
//     super(props);

//     this.state = {
//       decorations: []
//     };

//   }

//   componentDidMount() {
//     this.retrieveDecorations();
//   }


//   retrieveDecorations() {
//     axios.get("http://localhost:4000/api/deco/get/")
//       .then(res => {
//         if (res.data.success) {
//           this.setState({ 
//             decorations: res.data.deco 
//           });

//           console.log(this.state.decorations);

//         }
//       })
//       .catch(error => {
//         console.error("Error fetching decorations:", error);
//       });
//   }

//   render() {
//     return (
//       <div className = "container">
//         <p>All Decorations</p>
//         <table class = "table">
//           <thead>
//             <tr>
//               <th scope="col">#</th>
//               <th scope="col">Decoration ID</th>
//               <th scope="col">Type</th>
//               <th scope="col">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {this.state.decorations.map((decorations, index) => (
//               <tr>
//                 <th scope="row">{index+1}</th>
//                 <td>
//                     <a href={'/deco/${decorations.dId}'} style={{tetxtDecoration:'none'}}>
//                         {decorations.dId}
//                     </a>
//                 </td>
//                 <td>{decorations.type}</td>
//                 <td>
//                   <a className = "btn btn-warning" href = "#">
//                     <i className = "fas fa-edit"></i>&nbsp;Edit
//                   </a>
//                   &nbsp;
//                   <a className = "btn btn-danger" href = "#">
//                     <i className = "far fa-trash-alt"></i>&nbsp;Delete
//                   </a>  
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <button className="btn btn-success"><a href="/add" style={{textDecoration:none, color:"white"}}>Create new post</a></button>
//       </div>
//     )
//   }
// }




