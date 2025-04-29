import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCheck, FaDownload } from 'react-icons/fa';

const ReservationSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(location.state?.reservation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reservation) {
      setError('No reservation data found');
    }
  }, [reservation]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/reservations', reservation);
      toast.success('Reservation confirmed successfully!');
      navigate('/user/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to confirm reservation');
      toast.error('Failed to confirm reservation');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!reservation) return 0;
    
    const baseAmount = parseFloat(reservation.amount) || 0;
    const decorationAmount = reservation.decorations?.reduce((total, dec) => {
      return total + (parseFloat(dec.price) || 0);
    }, 0) || 0;

    return baseAmount + decorationAmount;
  };

  const handleDownloadPDF = () => {
    if (!reservation) return;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Reservation Summary', 105, 20, { align: 'center' });
    
    // Add reservation details
    doc.setFontSize(12);
    const details = [
      ['Name:', reservation.name],
      ['Email:', reservation.email],
      ['Reservation Type:', reservation.reservationType],
      ['Pickup Location:', reservation.pickupLocation],
      ['Start Time:', new Date(reservation.startTime).toLocaleString()],
      ['End Time:', new Date(reservation.endTime).toLocaleString()],
      ['Vehicle Number:', reservation.vehicleNum],
      ['Base Amount:', `Rs. ${reservation.amount}`]
    ];

    // Add decorations if any
    if (reservation.decorations && reservation.decorations.length > 0) {
      details.push(['Decorations:', '']);
      reservation.decorations.forEach((decoration, index) => {
        details.push([`${index + 1}. ${decoration.name}`, `Rs. ${decoration.price}`]);
      });
    }

    // Add total amount
    details.push(['Total Amount:', `Rs. ${calculateTotalPrice()}`]);

    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Value']],
      body: details,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });

    // Save the PDF
    doc.save(`reservation-${reservation.vehicleNum}.pdf`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/reservation')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Reservation Summary</h1>
            <button
              onClick={() => navigate('/reservation')}
              className="flex items-center text-blue-500 hover:text-blue-600"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {reservation.name}</p>
                  <p><span className="font-medium">Email:</span> {reservation.email}</p>
                  <p><span className="font-medium">Type:</span> {reservation.reservationType}</p>
                  <p><span className="font-medium">Pickup Location:</span> {reservation.pickupLocation}</p>
                  <p><span className="font-medium">Start Time:</span> {new Date(reservation.startTime).toLocaleString()}</p>
                  <p><span className="font-medium">End Time:</span> {new Date(reservation.endTime).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Vehicle Number:</span> {reservation.vehicleNum}</p>
                  <p><span className="font-medium">Base Amount:</span> Rs. {reservation.amount}</p>
                </div>
              </div>
            </div>

            {reservation.decorations && reservation.decorations.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Selected Decorations</h2>
                <div className="space-y-2">
                  {reservation.decorations.map((decoration, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{decoration.name}</span>
                      <span className="font-medium">Rs. {decoration.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">Rs. {calculateTotalPrice()}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                <FaDownload className="mr-2" />
                Download PDF
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex items-center bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? (
                  'Confirming...'
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Confirm Reservation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummary; 