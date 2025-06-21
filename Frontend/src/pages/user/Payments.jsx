import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Payments() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/payment-methods', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPaymentMethods(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:4000/api/payment-methods/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        fetchPaymentMethods();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete payment method');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:4000/api/payment-methods/${id}/default`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        fetchPaymentMethods();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to set default payment method');
    }
  };

  if (loading) {
    return <div className="pt-24 px-12 pb-12">Loading...</div>;
  }

  return (
    <div className="pt-24 px-12 pb-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-[38px] font-bold">Payment Methods</h1>
        <button 
          onClick={() => window.location.href = '/user/payment/add'}
          className="bg-black text-white px-8 py-3 rounded-full text-[18px] hover:opacity-90 transition-opacity"
        >
          Add new method
        </button>
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="space-y-6">
        {paymentMethods.length === 0 ? (
          <p className="text-gray-500">No payment methods added yet.</p>
        ) : (
          paymentMethods.map((method) => (
            <div 
              key={method._id}
              className="border-b border-gray-200 pb-6 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={`/icons/${method.type === 'bank' ? 'bank.png' : 'card.png'}`} 
                  alt={method.type}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <p className="text-[20px] font-medium mb-1">
                    {method.type === 'bank' ? 
                      method.accountNumber : 
                      `xxxx-xxxx-xxxx-${method.cardNumber.slice(-4)}`
                    }
                  </p>
                  <p className="text-gray-600">{method.holderName}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(method._id)}
                className="px-6 py-2 bg-[#E87C7C] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 