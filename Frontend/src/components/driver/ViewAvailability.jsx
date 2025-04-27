import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Notification from '../Notification';

const API_BASE_URL = "http://localhost:4000/api";

const ViewAvailability = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isEditing, setIsEditing] = useState(false);
    const [availability, setAvailability] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [updateLoading, setUpdateLoading] = useState(false);

    const driverId = localStorage.getItem('driverId');

    useEffect(() => {
        if (driverId) {
            fetchSchedule();
        } else {
            setError('Please login to view your availability');
            setLoading(false);
        }
    }, [driverId]);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('Fetching schedule for driver:', driverId);
            
            const response = await axios.get(`${API_BASE_URL}/driver/availability/schedule/${driverId}`);
            console.log('Schedule response:', response.data);
            
            if (response.data.success) {
                setSchedule(response.data.data);
                setNotification({
                    message: 'Schedule loaded successfully',
                    type: 'success'
                });
            } else {
                throw new Error(response.data.error || 'Failed to fetch schedule');
            }
        } catch (err) {
            console.error('Error fetching schedule:', err);
            const errorMessage = err.response?.data?.error || 'Failed to fetch schedule';
            setError(errorMessage);
            setNotification({
                message: errorMessage,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDateClick = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const existingAvailability = schedule.find(item => item.date === formattedDate);
        setAvailability(existingAvailability ? existingAvailability.availability : true);
        setIsEditing(true);
        setSelectedDate(date);
    };

    const handleUpdateAvailability = async () => {
        try {
            setUpdateLoading(true);
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            console.log('Updating availability:', {
                driverId,
                date: formattedDate,
                availability
            });

            const response = await axios.post(`${API_BASE_URL}/driver/availability`, {
                driverId,
                date: formattedDate,
                availability
            });

            console.log('Update response:', response.data);
            
            if (response.data.success) {
                // Update local schedule state
                const updatedSchedule = schedule.filter(item => item.date !== formattedDate);
                updatedSchedule.push({
                    _id: response.data.data._id,
                    driverId,
                    date: formattedDate,
                    availability
                });
                setSchedule(updatedSchedule.sort((a, b) => new Date(a.date) - new Date(b.date)));
                
                setNotification({
                    message: `Availability updated for ${format(selectedDate, 'MMMM dd, yyyy')}`,
                    type: 'success'
                });
                setIsEditing(false);
            } else {
                throw new Error(response.data.error || 'Failed to update availability');
            }
        } catch (err) {
            console.error('Error updating availability:', err);
            const errorMessage = err.response?.data?.error || 'Failed to update availability';
            setError(errorMessage);
            setNotification({
                message: errorMessage,
                type: 'error'
            });
        } finally {
            setUpdateLoading(false);
        }
    };

    const tileClassName = ({ date }) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const dateSchedule = schedule.find(item => item.date === formattedDate);
        
        if (dateSchedule) {
            return dateSchedule.availability 
                ? "bg-green-200 hover:bg-green-300"
                : "bg-red-200 hover:bg-red-300";
        }
        return "";
    };

    if (!driverId) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
                Please login to view your availability
            </div>
        );
    }

    return (
        <>
            <Notification message={notification.message} type={notification.type} />
            
            <div className="max-w-7xl mx-auto">
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calendar View */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Calendar</h2>
                        <Calendar
                            onChange={handleDateClick}
                            value={selectedDate}
                            tileClassName={tileClassName}
                            className="mx-auto border-0"
                        />
                        <div className="mt-4 flex gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                                <span>Available</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
                                <span>Not Available</span>
                            </div>
                        </div>
                    </div>

                    {/* Availability Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Availability for {format(selectedDate, 'MMMM dd, yyyy')}
                        </h2>

                        <div className="space-y-6">
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => setAvailability(true)}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                        availability 
                                            ? 'border-green-500 bg-green-50 text-green-700' 
                                            : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded-full ${availability ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <span className="font-medium">Available</span>
                                </button>
                                
                                <button
                                    onClick={() => setAvailability(false)}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                        !availability 
                                            ? 'border-red-500 bg-red-50 text-red-700' 
                                            : 'border-gray-200 hover:border-red-500 hover:bg-red-50'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded-full ${!availability ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                                    <span className="font-medium">Not Available</span>
                                </button>
                            </div>

                            <button
                                onClick={handleUpdateAvailability}
                                disabled={updateLoading}
                                className={`w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors ${
                                    updateLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {updateLoading ? 'Updating...' : 'Update Availability'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Schedule List */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Schedule</h2>
                    <div className="space-y-2">
                        {schedule.length === 0 ? (
                            <p className="text-gray-500">No availability set for upcoming dates.</p>
                        ) : (
                            schedule.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-gray-700 font-medium">
                                        {format(new Date(item.date), 'MMMM dd, yyyy')}
                                    </span>
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                                            item.availability
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {item.availability ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewAvailability; 