import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const CreateDamageRequest = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to submit a damage request');
        navigate('/login');
        return;
      }      await axios.post(
        'http://localhost:4000/api/damage-requests',
        {
          vehicleId: vehicleId,  // Match the backend's expected field name
          description: formData.description,
          attachments: formData.attachments
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Damage request submitted successfully');
      navigate('/my-damage-requests');
    } catch (error) {
      console.error('Error submitting damage request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit damage request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const token = localStorage.getItem('token');
    
    try {      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);  // Changed from 'files' to 'images' to match backend config
      });

      const response = await axios.post(
        'http://localhost:4000/api/damage-requests/upload',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        attachments: response.data.urls
      }));
      
      toast.success('Files uploaded successfully');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Report Vehicle Damage</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Damage Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            placeholder="Please describe the damage in detail..."
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Attach Photos
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mygreen file:text-white hover:file:bg-green-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-mygreen text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-green-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDamageRequest;
