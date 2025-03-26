import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddSparePart() {
  const navigate = useNavigate();
  const [sparePart, setSparePart] = useState({
    name: "",
    category: "",
    specifications: "",
    quantity: "",
    price: "",
    availability: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setSparePart((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to add a spare part.");
      return;
    }

    axios
      .post("http://localhost:4000/api/maintenance", sparePart, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        alert(res.data.message);
        navigate("/maintainance/adminViewDetails"); // ✅ Redirect after success
      })
      .catch((err) => {
        console.error("Error adding spare part:", err);
        alert("Failed to add spare part. Please try again.");
      });
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Spare Part</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Part Name</label>
          <input
            type="text"
            name="name"
            value={sparePart.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={sparePart.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Specifications</label>
          <textarea
            name="specifications"
            value={sparePart.specifications}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={sparePart.quantity}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={sparePart.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="availability"
            checked={sparePart.availability}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">Available</label>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Spare Part
          </button>
          <button
            type="button"
            onClick={() => navigate("/maintainance/adminViewDetails")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
