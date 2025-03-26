import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminViewDetails() {
  const [spareParts, setSpareParts] = useState([]);

  useEffect(() => {
    retrieveSpareParts();
  }, []);

  function retrieveSpareParts() {
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
      })
      .catch((err) => {
        console.error("Error fetching spare parts:", err);
      });
  }

  return (
    <div className="container">
      <h1 className="text-center">Spare Parts Inventory</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Part Name</th>
            <th>Category</th>
            <th>Specifications</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {spareParts.map((sparePart, index) => (
            <tr key={sparePart._id}>
              <th scope="row">{index + 1}</th>
              <td>{sparePart.name}</td>
              <td>{sparePart.category}</td>
              <td>{sparePart.specifications}</td>
              <td>{sparePart.quantity}</td>
              <td>{sparePart.price}</td>
              <td>{sparePart.availability ? "Available" : "Not Available"}</td>
              <td>{sparePart.lastUpdated}</td>
              <td>
                <Link
                  to={`/edit-spare-part/${sparePart._id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <Link
                  to={`/maintainance/delete/:id`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-success">
        <Link to={'/maintainance/add'} style={{ textDecoration: "none", color: "white" }}>
          Add new spare part
        </Link>
      </button>
    </div>
  );
}
