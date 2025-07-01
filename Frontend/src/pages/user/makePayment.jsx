import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';

export default function MakePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservation } = location.state || {};
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reservation) {
      navigate('/my-reservations');
      return;
    }

    fetchPaymentMethods();
  }, [reservation, navigate]);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/payment-methods', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPaymentMethods(response.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching payment methods');
    }
  };

  const handleCouponSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/coupons/validate', 
        { code: couponCode },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        const discountAmount = (reservation.price * response.data.data.discountPercentage) / 100;
        setDiscount(discountAmount);
      }
    } catch (err) {
      setError('Invalid coupon code');
    }
  };

  const handleQRScan = (data) => {
    if (data) {
      setCouponCode(data);
      setShowQRScanner(false);
      handleCouponSubmit();
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Update reservation payment status
      await axios.put(
        `http://localhost:4000/api/reservations/${reservation._id}/pay`,
        {
          paymentMethodId: selectedMethod._id,
          finalAmount: reservation.price - discount
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Send email with bill
      await axios.post(
        'http://localhost:4000/api/reservations/send-bill',
        {
          reservationId: reservation._id,
          amount: reservation.price,
          discount: discount,
          finalAmount: reservation.price - discount,
          paymentMethod: selectedMethod.cardType
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      navigate('/my-reservations');
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!reservation) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Payment</h1>
      
      {/* Reservation Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Reservation details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Reservation #{reservation.rId}</p>
            <p className="text-gray-600">Vehicle: {reservation.vehicleNum}</p>
            <p className="text-gray-600">Service: {reservation.service}</p>
          </div>
          <div>
            <p className="text-gray-600">Start: {new Date(reservation.startDate).toLocaleDateString()}</p>
            <p className="text-gray-600">End: {new Date(reservation.endDate).toLocaleDateString()}</p>
            <p className="text-gray-600">Original Price: ${reservation.price}</p>
          </div>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Use a coupon</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter a coupon code"
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={handleCouponSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-2">Or</p>
          <button
            onClick={() => setShowQRScanner(!showQRScanner)}
            className="text-blue-600 underline"
          >
            Scan QR code
          </button>
        </div>

        {showQRScanner && (
          <div className="mt-4">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={(result, error) => {
                if (!!result) {
                  handleQRScan(result?.text);
                }
                if (!!error) {
                  // Optionally handle error
                }
              }}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Select a payment method</h2>
        <div className="grid gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method._id}
              onClick={() => setSelectedMethod(method)}
              className={`p-4 border rounded-md cursor-pointer ${
                selectedMethod?._id === method._id ? 'border-blue-600 bg-blue-50' : ''
              }`}
            >
              <p className="font-semibold">
                {method.type === 'bank' ? 'Bank Account' : 'Card'}
              </p>
              <p className="text-gray-600">
                {method.type === 'bank'
                  ? method.accountNumber
                  : `xxxx-xxxx-xxxx-${method.cardNumber?.slice(-4)}`}
              </p>
              <p className="text-gray-600">{method.holderName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Total and Pay Button */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Total:</h2>
          <div className="text-right">
            <p className="text-gray-600">Original Price: ${reservation.price}</p>
            <p className="text-green-600">Discount: -${discount}</p>
            <p className="text-xl font-bold">Final Price: ${reservation.price - discount}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || !selectedMethod}
          className={`w-full py-3 rounded-md text-white text-lg font-semibold ${
            loading || !selectedMethod
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800'
          }`}
        >
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </div>
    </div>
  );
} 