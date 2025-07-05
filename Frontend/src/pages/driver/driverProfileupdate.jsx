import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Notification from '../Notification';

const DriverProfileUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [formData, setFormData] = useState({
        DriverName: "",  
        DriverAdd: "",
        DriverPhone: "",
        DriverEmail: "",
        DLNo: "",
        NICNo: ""
    });

    useEffect(() => {
        fetchDriverData();
    }, [id]);

    const fetchDriverData = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/driver/${id}`);
            setFormData(response.data.driverone);
            setError('');
        } catch (err) {
            setError('Failed to fetch driver data');
            setNotification({
                message: 'Failed to fetch driver data',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://localhost:4000/api/driver/update/${id}`, formData);
            setNotification({
                message: 'Profile updated successfully!',
                type: 'success'
            });
            // Wait for 2 seconds before redirecting
            setTimeout(() => {
                navigate(`/driverprofile/${id}`);
            }, 2000);
        } catch (err) {
            setError('Failed to update profile');
            setNotification({
                message: err.response?.data?.error || 'Failed to update profile',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Notification message={notification.message} type={notification.type} />
            
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Update Driver Profile</h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Name</label>
                        <input
                            type="text"
                            name="DriverName"
                            value={formData.DriverName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Phone</label>
                        <input
                            type="tel"
                            name="DriverPhone"
                            value={formData.DriverPhone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Address</label>
                        <input
                            type="text"
                            name="DriverAdd"
                            value={formData.DriverAdd}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="DriverEmail"
                            value={formData.DriverEmail}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Driver's License Number</label>
                        <input
                            type="text"
                            name="DLNo"
                            value={formData.DLNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">NIC Number</label>
                        <input
                            type="text"
                            name="NICNo"
                            value={formData.NICNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DriverProfileUpdate;