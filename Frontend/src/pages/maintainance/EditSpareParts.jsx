import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditSparePart() {
  const { id } = useParams(); // Get spare part ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sparePart, setSparePart] = useState({
    name: "",
    category: "",
    specifications: "",
    quantity: "",
    price: "",
    availability: false,
  });

  useEffect(() => {
    if (id) {
      fetchSparePart();
    }
  }, [id]);

  function fetchSparePart() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! User may need to log in.");
      return;
    }

    axios
      .get(`http://localhost:4000/api/maintenance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSparePart(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching spare part:", err);
        setLoading(false);
      });
  }

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

    axios
      .put(`http://localhost:4000/api/maintenance/${id}`, sparePart, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        alert(res.data.message);
        navigate("/maintainance/adminViewDetails"); // Redirect to spare parts list
      })
      .catch((err) => {
        console.error("Error updating spare part:", err);
      });
  }

  if (loading) {
    return <h2 className="text-center">Loading...</h2>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Spare Part</h2>
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
  <select
    name="category"
    value={sparePart.category}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
    required
  >
    <option value="">Select Category</option>
    <option value="Suspension">Suspension</option>
    <option value="Engine">Engine</option>
    <option value="Brakes">Brakes</option>
    <option value="Electrical">Electrical</option>

  </select>
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Spare Part
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
