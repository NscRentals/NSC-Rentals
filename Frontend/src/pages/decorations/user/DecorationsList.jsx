import React, { Component } from "react";
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

  handleAddDecoration = (id) => {
    alert(`Decoration ID: ${id} added successfully!`);
  };

  render() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <header className="bg-gray-800 text-white py-4 shadow-md">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-semibold">Wedding Car Decorations</h1>
          </div>
        </header>

        {/* Decorations List */}
        <main className="container mx-auto p-6">
          <h2 className="text-2xl font-medium text-gray-700 mb-4 text-center">
            Available Decorations
          </h2>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {this.state.decorations.map((decoration, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                {/* Decoration Details */}
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-gray-800">{decoration.type}</h3>
                  <p className="text-sm text-gray-500">{decoration.dId}</p>
                  <p className="text-gray-700 mt-2">{decoration.description}</p>
                  <p className="text-blue-600 font-semibold mt-1">{decoration.price} LKR</p>
                </div>

                {/* Add Button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => this.handleAddDecoration(decoration._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    Add
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
