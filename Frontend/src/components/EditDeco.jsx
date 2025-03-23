import React, { Component } from "react";
import axios from "axios";

export default class EditDeco extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dId: "",
      type: "",
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
    };

    axios
      .put(`http://localhost:4000/api/deco/update/${id}`, updatedDeco)
      .then((res) => {
        if (res.data.success) {
          alert("Decoration Updated Successfully!");
          window.location.href = `/deco/${id}`; // Redirect back to details page
        }
      })
      .catch((error) => {
        console.error("Error updating decoration:", error);
      });
  };

  render() {
    return (
      <div className="container">
        <h2>Edit Decoration</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Decoration ID</label>
            <input
              type="text"
              className="form-control"
              name="dId"
              value={this.state.dId}
              onChange={this.handleInputChange}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <input
              type="text"
              className="form-control"
              name="type"
              value={this.state.type}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Update Decoration
          </button>
        </form>
      </div>
    );
  }
}
