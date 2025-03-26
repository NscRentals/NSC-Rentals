import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VehicleDetails() {
  const { id } = useParams();      // get 'id' from the URL
  const [vehicle, setVehicle] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:4000/api/vehicles/${id}`)
      .then((res) => {
        console.log('Server data:', res.data);
        setVehicle(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div>
      <h2>Vehicle Details</h2>
      <p>Make: {vehicle.make}</p>
      <p>Model: {vehicle.model}</p>
      {/* etc. */}
    </div>
  );
}

export default VehicleDetails;
