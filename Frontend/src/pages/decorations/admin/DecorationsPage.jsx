import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DecorationsPage() {
  const [decorations, setDecorations] = useState([]);
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState("");

  useEffect(() => {
    fetchDecorations();
  }, []);

  const fetchDecorations = () => {
    axios.get("http://localhost:4000/api/deco/get/")
      .then(res => setDecorations(res.data.deco));
  };

  const handleAdd = async () => {
    await axios.post("http://localhost:4000/api/deco/add/", {
      type, price, description, images
    });
    setType(""); setPrice(""); setDescription(""); setImages("");
    fetchDecorations();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/deco/delete/${id}`);
    fetchDecorations();
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Manage Decorations</h2>
      <div className="mb-4">
        <input value={type} onChange={e => setType(e.target.value)} placeholder="Type" className="border p-1 mr-2" />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className="border p-1 mr-2" />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-1 mr-2" />
        <input value={images} onChange={e => setImages(e.target.value)} placeholder="Image URL" className="border p-1 mr-2" />
        <button onClick={handleAdd} className="bg-green-500 text-white px-3 py-1 rounded">Add</button>
      </div>
      <ul>
        {decorations.map(d => (
          <li key={d._id} className="flex justify-between items-center border-b py-2">
            <span>{d.type} - LKR {d.price}</span>
            <button onClick={() => handleDelete(d._id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
