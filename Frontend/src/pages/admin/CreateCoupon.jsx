import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateCoupon = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    couponName: '',
    expiryDate: '',
    discountType: 'fixed',
    discountAmount: '',
    eligibleUsers: 'all',
    loyaltyPoints: '',
    couponCode: '',
    generateQR: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token);

    console.log('Submit button clicked');
    console.log('Form Data:', formData);

    // Validate required fields
    if (!formData.couponName || !formData.couponCode || !formData.expiryDate || !formData.discountAmount) {
      console.log('Validation failed');
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('Validation passed, making API call...');
    const loadingToast = toast.loading('Creating coupon...');

    try {
      const requestBody = {
        couponName: formData.couponName,
        couponCode: formData.couponCode,
        discountType: formData.discountType,
        discountAmount: Number(formData.discountAmount),
        expiryDate: new Date(formData.expiryDate),
        eligibilityType: formData.eligibleUsers,
        minimumLoyaltyPoints: formData.eligibleUsers === 'selected' ? Number(formData.loyaltyPoints) : 0
      };
      
      console.log('Request body:', requestBody);

      const response = await fetch('http://localhost:4000/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success('Coupon created successfully!');
        setTimeout(() => {
          navigate('/admin/coupons');
        }, 1000);
      } else {
        toast.error(data.message || 'Failed to create coupon');
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.dismiss(loadingToast);
      toast.error('An error occurred while creating the coupon');
    }
  };

  return (
    <div className="p-12">
      <div className="flex items-center gap-6 mb-12">
        <button 
          onClick={() => navigate('/admin/coupons')}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      {step === 1 && (
        <div className="space-y-8">
          <h1 className="text-5xl font-bold mb-12">Create a coupon</h1>
          
          <div className="space-y-3 max-w-3xl">
            <label className="block text-2xl">Enter a coupon name</label>
            <input
              type="text"
              name="couponName"
              value={formData.couponName}
              onChange={handleInputChange}
              className="w-full h-14 bg-gray-200 rounded-lg px-6 text-xl"
            />
          </div>

          <div className="space-y-3 max-w-3xl">
            <label className="block text-2xl flex items-center gap-2">
              pick an expiry date
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="w-full h-14 bg-gray-200 rounded-lg px-6 text-xl"
            />
          </div>

          <div className="space-y-4 max-w-3xl">
            <label className="block text-2xl">Select the discount type</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="discountType"
                  value="fixed"
                  checked={formData.discountType === 'fixed'}
                  onChange={handleInputChange}
                  className="w-6 h-6"
                />
                <span className="text-xl">Fixed Discount</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="discountType"
                  value="percentage"
                  checked={formData.discountType === 'percentage'}
                  onChange={handleInputChange}
                  className="w-6 h-6"
                />
                <span className="text-xl">Percentage</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 max-w-3xl">
            <label className="block text-2xl">Enter the amount</label>
            <input
              type="number"
              name="discountAmount"
              value={formData.discountAmount}
              onChange={handleInputChange}
              className="w-full h-14 bg-gray-200 rounded-lg px-6 text-xl"
            />
          </div>

          <div className="flex justify-end max-w-3xl">
            <button
              onClick={handleNext}
              className="bg-black text-white px-10 py-4 rounded-full text-xl hover:opacity-90 transition-opacity"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <h1 className="text-5xl font-bold mb-12">Create a coupon</h1>
          
          <div className="space-y-4 max-w-3xl">
            <label className="block text-2xl">Select eligible users</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="eligibleUsers"
                  value="all"
                  checked={formData.eligibleUsers === 'all'}
                  onChange={handleInputChange}
                  className="w-6 h-6"
                />
                <span className="text-xl">All users</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="eligibleUsers"
                  value="selected"
                  checked={formData.eligibleUsers === 'selected'}
                  onChange={handleInputChange}
                  className="w-6 h-6"
                />
                <span className="text-xl">Selected users</span>
              </label>
            </div>
          </div>

          {formData.eligibleUsers === 'selected' && (
            <div className="space-y-3 max-w-3xl">
              <label className="block text-2xl">
                Specify the minimum number of loyalty points required for a user
                to be included in this category.
              </label>
              <input
                type="number"
                name="loyaltyPoints"
                value={formData.loyaltyPoints}
                onChange={handleInputChange}
                className="w-full h-14 bg-gray-200 rounded-lg px-6 text-xl"
              />
            </div>
          )}

          <div className="flex justify-between max-w-3xl">
            <button
              onClick={handleBack}
              className="bg-gray-200 text-black px-10 py-4 rounded-full text-xl hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="bg-black text-white px-10 py-4 rounded-full text-xl hover:opacity-90 transition-opacity"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <h1 className="text-5xl font-bold mb-12">Create a coupon</h1>
          
          <div className="space-y-3 max-w-3xl">
            <label className="block text-2xl">Enter a code to use as coupon code</label>
            <input
              type="text"
              name="couponCode"
              value={formData.couponCode}
              onChange={handleInputChange}
              className="w-full h-14 bg-gray-200 rounded-lg px-6 text-xl"
            />
          </div>

          <div className="space-y-4 max-w-3xl">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="generateQR"
                checked={formData.generateQR}
                onChange={handleInputChange}
                className="w-6 h-6"
              />
              <span className="text-2xl">Generate a QR code</span>
            </label>

            {formData.generateQR && formData.couponCode && (
              <div className="flex justify-center py-6">
                <QRCodeSVG value={formData.couponCode} size={250} />
              </div>
            )}

            {formData.generateQR && !formData.couponCode && (
              <p className="text-red-500 text-xl">Please enter a coupon code to generate QR code</p>
            )}
          </div>

          <p className="text-gray-600 text-xl max-w-3xl">
            Users will receive the coupon via email and through the web
          </p>

          <div className="flex justify-between max-w-3xl">
            <button
              onClick={handleBack}
              className="bg-gray-200 text-black px-10 py-4 rounded-full text-xl hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              className="bg-black text-white px-10 py-4 rounded-full text-xl hover:opacity-90 transition-opacity"
            >
              Create and send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCoupon; 