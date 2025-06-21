import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddPaymentMethod() {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('bank');
  const [formData, setFormData] = useState({
    holderName: '',
    accountNumber: '',
    bankName: '',
    cardNumber: '',
    cvv: '',
    expiryDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format card number with dashes after every 4 digits
  const formatCardNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    const groups = numbers.match(/.{1,4}/g) || [];
    return groups.join('-').substr(0, 19); // 16 digits + 3 dashes = 19 characters
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentType === 'bank') {
      if (!formData.accountNumber) {
        newErrors.accountNumber = 'Account number is required';
      }
      if (!formData.bankName) {
        newErrors.bankName = 'Bank name is required';
      }
    } else {
      if (!formData.cardNumber || formData.cardNumber.replace(/[^0-9]/g, '').length !== 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!formData.cvv || !/^[0-9]{3}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 digits';
      }
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      }
    }

    if (!formData.holderName) {
      newErrors.holderName = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        
        // Prepare the data based on payment type
        const paymentData = {
          type: paymentType,
          holderName: formData.holderName,
          ...(paymentType === 'bank' 
            ? {
                accountNumber: formData.accountNumber,
                bankName: formData.bankName,
              }
            : {
                cardNumber: formData.cardNumber.replace(/-/g, ''),
                cvv: formData.cvv,
                expiryDate: formData.expiryDate,
              }
          )
        };

        const response = await axios.post(
          'http://localhost:4000/api/payment-methods',
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          // Navigate back to payment methods list
          navigate('/user/payment');
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          submit: error.response?.data?.message || 'Failed to add payment method'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^\d]/g, '').substr(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Get today's date in YYYY-MM-DD format for min date in expiry date picker
  const today = new Date().toISOString().split('T')[0];
  // Get date 10 years from now for max date
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 10);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="pt-24 px-12 pb-12">
      <div className="flex items-center gap-6 mb-12">
        <Link 
          to="/user/payment"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-[38px] font-bold">Add payment method</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex space-x-8">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentType"
              value="bank"
              checked={paymentType === 'bank'}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-5 h-5"
            />
            <span className="text-[20px]">Bank account</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentType"
              value="card"
              checked={paymentType === 'card'}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-5 h-5"
            />
            <span className="text-[20px]">Card</span>
          </label>
        </div>

        {paymentType === 'bank' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-[20px] mb-2">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-lg bg-gray-100"
              />
              {errors.accountNumber && (
                <p className="text-red-500 mt-1">{errors.accountNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-[20px] mb-2">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-lg bg-gray-100"
              />
              {errors.bankName && (
                <p className="text-red-500 mt-1">{errors.bankName}</p>
              )}
            </div>
            <div>
              <label className="block text-[20px] mb-2">Account Holder's Name</label>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-lg bg-gray-100"
              />
              {errors.holderName && (
                <p className="text-red-500 mt-1">{errors.holderName}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-[20px] mb-2">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="xxxx-xxxx-xxxx-xxxx"
                maxLength="19"
                className="w-full h-12 px-4 rounded-lg bg-gray-100"
              />
              {errors.cardNumber && (
                <p className="text-red-500 mt-1">{errors.cardNumber}</p>
              )}
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-[20px] mb-2">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="3"
                  className="w-full h-12 px-4 rounded-lg bg-gray-100"
                />
                {errors.cvv && (
                  <p className="text-red-500 mt-1">{errors.cvv}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-[20px] mb-2">Expiry date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  min={today}
                  max={maxDateString}
                  className="w-full h-12 px-4 rounded-lg bg-gray-100"
                />
                {errors.expiryDate && (
                  <p className="text-red-500 mt-1">{errors.expiryDate}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-[20px] mb-2">Card Holder's Name</label>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-lg bg-gray-100"
              />
              {errors.holderName && (
                <p className="text-red-500 mt-1">{errors.holderName}</p>
              )}
            </div>
          </div>
        )}

        {errors.submit && (
          <p className="text-red-500 mt-4">{errors.submit}</p>
        )}

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`mt-8 px-8 py-3 rounded-full text-[18px] transition-opacity ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-black text-white hover:opacity-90'
          }`}
        >
          {isSubmitting ? 'Adding...' : 'Add method'}
        </button>
      </form>
    </div>
  );
} 