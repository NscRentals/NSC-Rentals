import React, { Component } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

class DecorationsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      decorations: [],
      selectedDecorations: JSON.parse(localStorage.getItem('selectedDecorations')) || [],
    };
  }

  componentDidMount() {
    this.retrieveDecorations();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedDecorations !== this.state.selectedDecorations) {
      localStorage.setItem('selectedDecorations', JSON.stringify(this.state.selectedDecorations));
    }
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

  handleAddDecoration = (decoration) => {
    const { selectedDecorations } = this.state;
    const isAlreadySelected = selectedDecorations.some(d => d._id === decoration._id);

    if (isAlreadySelected) {
      alert("This decoration is already selected!");
      return;
    }

    const confirmAdd = window.confirm(
      `Are you sure you want to add ${decoration.type} decoration for LKR ${decoration.price}?`
    );

    if (confirmAdd) {
      this.setState(
        (prevState) => ({
          selectedDecorations: [...prevState.selectedDecorations, decoration],
        }),
        () => {
          const confirmRedirect = window.confirm(
            "Do you want to proceed to the reservation page?"
          );
          if (confirmRedirect) {
            // Pass selected decorations to the reservation page
            this.props.navigate("/reservation/new", {
              state: { 
                selectedDecorations: this.state.selectedDecorations,
                returnTo: '/decorations'
              },
            });
          }
        }
      );
    }
  };

  handleRemoveDecoration = (decorationId) => {
    this.setState(prevState => ({
      selectedDecorations: prevState.selectedDecorations.filter(d => d._id !== decorationId)
    }));
  };

  handleClearDecorations = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all selected decorations?");
    if (confirmClear) {
      this.setState({ selectedDecorations: [] });
      localStorage.removeItem('selectedDecorations');
    }
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

        {/* Selected Decorations Summary */}
        {this.state.selectedDecorations.length > 0 && (
          <div className="container mx-auto p-6">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Selected Decorations</h2>
                <button
                  onClick={this.handleClearDecorations}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Clear All
                </button>
              </div>
              <ul className="space-y-2">
                {this.state.selectedDecorations.map((decoration) => (
                  <li key={decoration._id} className="flex justify-between items-center">
                    <span>{decoration.type}</span>
                    <div className="flex items-center gap-2">
                      <span>LKR {decoration.price}</span>
                      <button
                        onClick={() => this.handleRemoveDecoration(decoration._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 font-semibold">
                Total: LKR{" "}
                {this.state.selectedDecorations.reduce(
                  (sum, d) => sum + parseFloat(d.price),
                  0
                )}
              </div>
            </div>
          </div>
        )}

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
                  <p className="text-blue-600 font-semibold mt-1">LKR {decoration.price}</p>
                </div>

                {/* Add Button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => this.handleAddDecoration(decoration)}
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

// Wrap the component with withRouter to get access to navigate
export default function DecorationsListWithRouter(props) {
  const navigate = useNavigate();
  return <DecorationsList {...props} navigate={navigate} />;
}
