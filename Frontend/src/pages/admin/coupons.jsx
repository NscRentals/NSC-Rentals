import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf";
import axios from 'axios';

const Coupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching coupons with token:', token); // Debug log

      const response = await axios.get('http://localhost:4000/api/coupons/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Response:', response.data); // Debug log

      if (response.data.success) {
        setCoupons(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch coupons');
        toast.error(response.data.message || 'Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error); // Debug log
      setError(error.response?.data?.message || 'Failed to fetch coupons');
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:4000/api/coupons/${id}/deactivate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Coupon deactivated successfully');
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:4000/api/coupons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const downloadPDF = (coupon) => {
    try {
      const doc = new jsPDF();
      
      // Set title
      doc.setFontSize(20);
      doc.text('Coupon Details', 20, 20);
      
      // Set normal font size for content
      doc.setFontSize(12);
      
      // Add basic info
      let y = 40;
      const lineHeight = 10;
      
      doc.text(`Coupon Name: ${coupon.couponName}`, 20, y);
      y += lineHeight;
      
      doc.text(`Coupon Code: ${coupon.couponCode}`, 20, y);
      y += lineHeight;
      
      doc.text(`Discount: ${coupon.discountAmount}${coupon.discountType === 'percentage' ? '%' : ' LKR'}`, 20, y);
      y += lineHeight;
      
      doc.text(`Expiry Date: ${new Date(coupon.expiryDate).toLocaleDateString()}`, 20, y);
      y += lineHeight;
      
      doc.text(`Status: ${coupon.isActive ? 'Active' : 'Inactive'}`, 20, y);
      y += lineHeight;
      
      doc.text(`Eligibility Type: ${coupon.eligibilityType}`, 20, y);
      y += lineHeight;
      
      if (coupon.eligibilityType === 'selected') {
        doc.text(`Minimum Loyalty Points: ${coupon.minimumLoyaltyPoints}`, 20, y);
        y += lineHeight;
      }

      // Add eligible users section if any
      if (coupon.eligibleUsers?.length > 0) {
        y += lineHeight;
        doc.setFontSize(16);
        doc.text('Eligible Users:', 20, y);
        y += lineHeight;
        doc.setFontSize(12);
        
        coupon.eligibleUsers.forEach(user => {
          if (y > 270) { // Check if we need a new page
            doc.addPage();
            y = 20;
          }
          doc.text(`${user.firstName} ${user.lastName} - ${user.email}`, 20, y);
          y += lineHeight;
        });
      }

      // Add usage history if any
      if (coupon.usedBy?.length > 0) {
        y += lineHeight;
        doc.setFontSize(16);
        doc.text('Usage History:', 20, y);
        y += lineHeight;
        doc.setFontSize(12);
        
        coupon.usedBy.forEach(usage => {
          if (y > 270) { // Check if we need a new page
            doc.addPage();
            y = 20;
          }
          doc.text(`${usage.userId.firstName} ${usage.userId.lastName} - ${new Date(usage.usedAt).toLocaleDateString()}`, 20, y);
          y += lineHeight;
        });
      }

      // Save the PDF
      doc.save(`coupon-${coupon.couponCode}-details.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return <div className="pt-24 px-12 pb-12">Loading...</div>;
  }

  return (
    <div className="pt-24 px-12 pb-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-[38px] font-bold">Coupons</h1>
        <button 
          onClick={() => navigate('/admin/coupons/create')}
          className="bg-black text-white px-8 py-3 rounded-full text-[18px] hover:opacity-90 transition-opacity"
        >
          Create new coupon
        </button>
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.length === 0 ? (
          <p className="text-gray-500 col-span-full">No coupons available.</p>
        ) : (
          coupons.map((coupon) => (
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
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      coupon.isActive ? 'bg-green-800 text-white' : 'bg-red-800 text-white'
                    }`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-300">
                    {coupon.discountAmount}{coupon.discountType === 'percentage' ? '%' : ' LKR'} • 
                    Expires: {new Date(coupon.expiryDate).toLocaleDateString()} • 
                    Used: {coupon.usedBy?.length || 0} times
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => downloadPDF(coupon)}
                  className="px-6 py-2 bg-[#4A90E2] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  PDF
                </button>
                {coupon.isActive && (
                  <button
                    onClick={() => handleDeactivate(coupon._id)}
                    className="px-6 py-2 bg-[#F5A623] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Deactivate
                  </button>
                )}
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="px-6 py-2 bg-[#E87C7C] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Coupons; 