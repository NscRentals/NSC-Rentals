import React, { Component } from "react";
import axios from "axios";

export default class CreateDeco extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dId: "",
      type: "",
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const newDeco = {
      dId: this.state.dId,
      type: this.state.type,
    };

    axios
      .post("http://localhost:4000/api/deco/save", newDeco)
      .then((res) => {
        if (res.data.success) {
          alert("Decoration Added Successfully!");
          window.location.href = "/"; // Redirect back to home
        }
      })
      .catch((error) => {
        console.error("Error adding decoration:", error);
      });
  };

  render() {
    return (
      <div className="container">
        <h2>Add New Decoration</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Decoration ID</label>
            <input
              type="text"
              className="form-control"
              name="dId"
              value={this.state.dId}
              onChange={this.handleInputChange}
              required
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
            Add Decoration
          </button>
        </form>
      </div>
    );
  }
}

