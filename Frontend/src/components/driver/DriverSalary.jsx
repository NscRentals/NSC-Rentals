import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const DriverSalary = ({ driverId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState({});

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const storedDriverId = localStorage.getItem('driverId');
        
        if (!storedDriverId) {
          setError('Please login to view your salary');
          setLoading(false);
          return;
        }

        console.log('Fetching reservations for driver:', storedDriverId);
        const response = await axios.get(
          `http://localhost:4000/api/reservation/reservations/driver/${storedDriverId}`
        );

        console.log('Reservations response:', response.data);

        if (response.data.success) {
          // Filter only completed reservations
          const completedReservations = response.data.reservations.filter(
            res => res.status === 'completed'
          );
          setReservations(completedReservations);

          // Calculate total earnings (25% of total amount)
          const total = completedReservations.reduce((sum, res) => {
            return sum + (parseFloat(res.amount) * 0.25);
          }, 0);
          setTotalEarnings(total);

          // Calculate monthly earnings
          const monthly = completedReservations.reduce((acc, res) => {
            const month = format(new Date(res.wanteddate), 'MMMM yyyy');
            const amount = parseFloat(res.amount) * 0.25;
            acc[month] = (acc[month] || 0) + amount;
            return acc;
          }, {});
          setMonthlyEarnings(monthly);
        } else {
          setError('Failed to fetch reservations');
        }
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError(err.response?.data?.message || 'Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-32">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Salary Details</h2>
      
      {/* Total Earnings Card */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Earnings</h3>
        <p className="text-3xl font-bold text-blue-700">Rs. {totalEarnings.toFixed(2)}</p>
        <p className="text-sm text-blue-600 mt-2">Based on 25% of completed trips</p>
      </div>

      {/* Monthly Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(monthlyEarnings).map(([month, amount]) => (
            <div key={month} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{month}</span>
              <span className="font-semibold text-gray-900">Rs. {amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Completed Reservations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Completed Trips</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Earnings (25%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.slice(0, 5).map((reservation) => (
                <tr key={reservation._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(reservation.wanteddate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                    <div className="text-sm text-gray-500">{reservation.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rs. {parseFloat(reservation.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                    Rs. {(parseFloat(reservation.amount) * 0.25).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverSalary; 