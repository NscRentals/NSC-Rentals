import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const API_BASE_URL = "http://localhost:4000"; // Update this to match your backend URL

const AvailableDrivers = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAllocating, setIsAllocating] = useState(false);

    useEffect(() => {
        console.log("Component mounted, fetching initial data");
        fetchAvailableDrivers(selectedDate);
    }, []);

    const fetchAvailableDrivers = async (date) => {
        setLoading(true);
        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            console.log("Fetching drivers for date:", formattedDate);
            
            const response = await axios.get(`${API_BASE_URL}/driver/availability/available/${formattedDate}`);
            console.log("Drivers response:", response.data);
            
            setDrivers(response.data.data);
            setError('');
        } catch (err) {
            console.error("Error fetching drivers:", err);
            setError(err.response?.data?.error || 'Failed to fetch available drivers');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        console.log("Date selected:", date);
        setSelectedDate(date);
        fetchAvailableDrivers(date);
    };

    const handleAllocateDriver = async (driverId) => {
        setIsAllocating(true);
        try {
            console.log("Allocating driver:", driverId);
            // Add your allocation logic here
            // Example:
            // await axios.post(`${API_BASE_URL}/driver/allocate`, {
            //     driverId,
            //     date: format(selectedDate, 'yyyy-MM-dd')
            // });
            
            // For now, just show a success message
            setError('');
            setTimeout(() => {
                setError('Driver allocation functionality to be implemented');
            }, 3000);
        } catch (err) {
            console.error("Error allocating driver:", err);
            setError(err.response?.data?.error || 'Failed to allocate driver');
        } finally {
            setIsAllocating(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Drivers</h1>

            {/* Calendar Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="mx-auto"
                />
            </div>

            {/* Drivers List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Available Drivers for {format(selectedDate, 'MMMM dd, yyyy')}
                </h2>

                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
                        {error}
                    </div>
                )}

                {!loading && drivers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No drivers available for this date
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {drivers.map((driver) => (
                        <div
                            key={driver._id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-semibold text-lg text-gray-800">
                                {driver.driverId.DriverName}
                            </h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <p>
                                    <span className="font-medium">Phone:</span>{' '}
                                    {driver.driverId.DriverPhone}
                                </p>
                                <p>
                                    <span className="font-medium">Email:</span>{' '}
                                    {driver.driverId.DriverEmail}
                                </p>
                            </div>
                            <button
                                className={`mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors w-full ${
                                    isAllocating ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                onClick={() => handleAllocateDriver(driver.driverId._id)}
                                disabled={isAllocating}
                            >
                                {isAllocating ? 'Allocating...' : 'Allocate Driver'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvailableDrivers; 