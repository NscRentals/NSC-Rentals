import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class DecorationsList extends Component {
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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gray-800 text-white py-4 shadow-md">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-semibold">Wedding Car Decorations List</h1>
          </div>
        </header>

        <main className="container mx-auto p-6">
          <h2 className="text-2xl font-medium text-gray-700 mb-4">All Decorations</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {this.state.decorations.map((decoration, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800">{decoration.type}</h3>
                  <p className="text-sm text-gray-500">{decoration.dId}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/edit/${decoration._id}`}
                    className="text-gray-600 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-gray-600 hover:underline text-sm"
                    onClick={() => this.deleteDecoration(decoration._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    );
  }
}

export default DecorationsList;
