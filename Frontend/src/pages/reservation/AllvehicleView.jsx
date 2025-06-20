import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VehicleView() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(
          "http://localhost:4000/api/vehicles/getVehicles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setVehicles(data.filter(vehicle => vehicle.availabilityStatus === "Available"));
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, [navigate]);

  const handleBookNow = (vehicle) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }
    console.log("Vehicle being booked:", vehicle);
    navigate(`/reservation/${vehicle._id}`, { 
      state: { 
        vehicleDetails: {
          vehicleNum: vehicle.registrationNumber,
          model: vehicle.model,
          registrationNumber: vehicle.registrationNumber
        }
      }
    });
  };

  if (loading)
    return <div className="text-center p-10">Loading vehicles...</div>;

  return (
    <div className="p-20" style={{ marginTop: "-100px" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Vehicles</h1>
        <button
          onClick={() => navigate("/reservation/viewReservations")}
          className="btn btn-success"
        >
          My Bookings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            className="bg-white border border-gray-200 p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
              <span className="text-gray-500">Vehicle Image</span>
            </div>

            <div className="space-y-1 text-sm text-gray-700 mb-4">
              <div className="flex justify-between ">
                <span className="font-semibold mb-2 mt-2">Status:</span>
                <span
                  className={`font-medium ${
                    vehicle.availabilityStatus === "Available"
                      ? "text-green-600"
                      : "text-red-500"
                  } mt-2`}
                >
                  {vehicle.availabilityStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold mb-2">Model:</span>
                <span>{vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold mb-2">Reg. No:</span>
                <span>{vehicle.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold mb-2">Color:</span>
                <span>{vehicle.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold mb-2">Seats:</span>
                <span>{vehicle.seatingCapacity}</span>
              </div>
            </div>

            <button
              onClick={() => handleBookNow(vehicle)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors duration-200"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleView;
