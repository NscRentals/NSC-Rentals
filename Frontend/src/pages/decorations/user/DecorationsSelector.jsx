import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DecorationsSelector({ selectedDecorations, setSelectedDecorations }) {
  const [decorations, setDecorations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/deco/get/")
      .then(res => {
        if (res.data.success) setDecorations(res.data.deco);
      });
  }, []);

  const handleAdd = (deco) => {
    if (selectedDecorations.some(d => d._id === deco._id)) return;
    setSelectedDecorations([...selectedDecorations, deco]);
  };

  const handleRemove = (id) => {
    setSelectedDecorations(selectedDecorations.filter(d => d._id !== id));
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Available Decorations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {decorations.map(deco => (
          <div key={deco._id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{deco.type}</div>
              <div className="text-sm text-gray-600">{deco.description}</div>
              <div className="text-blue-600">LKR {deco.price}</div>
            </div>
            <button
              type="button"
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => handleAdd(deco)}
            >
              Add
            </button>
          </div>
        ))}
      </div>
      <h4 className="mt-4 font-semibold">Selected Decorations</h4>
      <ul>
        {selectedDecorations.map(d => (
          <li key={d._id} className="flex justify-between items-center">
            <span>{d.type} - LKR {d.price}</span>
            <button
              type="button"
              className="text-red-500 ml-2"
              onClick={() => handleRemove(d._id)}
            >Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 