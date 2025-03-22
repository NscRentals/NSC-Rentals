import React, { Component } from "react";
import axios from "axios";

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      decorations: []
    };

  }

  componentDidMount() {
    this.retrieveDecorations();
  }


  retrieveDecorations() {
    axios.get("http://localhost:4000/api/deco/get")
      .then(res => {
        if (res.data.success) {
          this.setState({ 
            decorations: res.data.deco 
          });

          console.log(this.state.decorations);

        }
      })
      .catch(error => {
        console.error("Error fetching decorations:", error);
      });
  }

  render() {
    return (
      <div className = "container">
        <p>All Decorations</p>
        <table class = "table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Decoration ID</th>
              <th scope="col">Type</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {this.state.decorations.map((decorations, index) => (
              <tr>
                <th scope="row">{index+1}</th>
                <td>{decorations.dId}</td>
                <td>{decorations.type}</td>
                <td>
                  <a className = "btn btn-warning" href = "#">
                    <i className = "fas fa-edit"></i>&nbsp;Edit
                  </a>
                  &nbsp;
                  <a className = "btn btn-danger" href = "#">
                    <i className = "far fa-trash-alt"></i>&nbsp;Delete
                  </a>  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}