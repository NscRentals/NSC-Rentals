import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MyCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please log in to view your coupons');
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:4000/api/coupons/my-coupons', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.success) {
          setCoupons(response.data.data || []);
        } else {
          setError('No coupons available');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching coupons:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });

        if (err.response?.status === 401) {
          setError('Please log in to view your coupons');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch coupons');
        }
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchCoupons();
    } else {
      navigate('/login');
    }
  }, [navigate, isLoggedIn]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Coupons</h1>
      
      {coupons.length === 0 ? (
        <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
          You don't have any coupons yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div 
              key={coupon._id} 
              className="rounded-[40px] border bg-gray-900 text-gray-200 shadow-md p-6 flex flex-col justify-between min-h-[220px]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-2xl">%</span>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-[20px] font-medium mb-1">{coupon.couponName}</p>
                    <span className="px-2 py-1 rounded-full text-sm bg-green-800 text-white">Available</span>
                  </div>
                  <p className="text-gray-300 mt-1">
                    Code: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{coupon.couponCode}</span>
                  </p>
                  <p className="text-gray-300 mt-1">
                    Discount: {coupon.discountType === 'percentage' 
                      ? `${coupon.discountAmount}%` 
                      : `$${coupon.discountAmount.toFixed(2)}`}
                  </p>
                  <p className="text-gray-300 mt-1">
                    Valid until: {new Date(coupon.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 