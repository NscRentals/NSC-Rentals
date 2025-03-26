import axios from "axios";
import { useState, useEffect } from "react";

export default function DeleteSparePart() {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpareParts();
  }, []);

  function fetchSpareParts() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! User may need to log in.");
      return;
    }

    axios
      .get("http://localhost:4000/api/maintenance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSpareParts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching spare parts:", err);
        setLoading(false);
      });
  }

  function handleDelete(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to delete a spare part.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this spare part?"
    );

    if (!confirmDelete) return;

    axios
      .delete(`http://localhost:4000/api/maintenance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        alert(res.data.message);
        setSpareParts((prev) => prev.filter((sparePart) => sparePart._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting spare part:", err);
        alert("Error deleting spare part. Please try again.");
      });
  }

  if (loading) {
    return <h2 className="text-center">Loading spare parts...</h2>;
  }

  return (
    <div className="container">
      <h1 className="text-center">Manage Spare Parts</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Part Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {spareParts.map((sparePart, index) => (
            <tr key={sparePart._id}>
              <th scope="row">{index + 1}</th>
              <td>{sparePart.name}</td>
              <td>{sparePart.category}</td>
              <td>{sparePart.quantity}</td>
              <td>{sparePart.price}</td>
              <td>{sparePart.availability ? "Available" : "Not Available"}</td>
              <td>
                <button
                  onClick={() => handleDelete(sparePart._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
