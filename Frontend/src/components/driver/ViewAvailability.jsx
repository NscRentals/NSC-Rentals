import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Notification from '../Notification';
import Layout from '../Layout';

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
        if (existingAvailability) {
            setAvailability(existingAvailability.availability);
            setIsEditing(true);
        } else {
            setAvailability(true);
            setIsEditing(false);
        }
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
            <Layout>
                <div className="bg-red-100 text-red-700 p-4 rounded-md">
                    Please login to view your availability
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Notification message={notification.message} type={notification.type} />
            
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Availability Schedule</h1>
                    <p className="text-gray-600">Manage your availability and view your upcoming schedule</p>
                </div>

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
                    </div>

                    {/* Availability Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Availability for {format(selectedDate, 'MMMM dd, yyyy')}
                        </h2>

                        {isEditing ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio text-green-500"
                                            checked={availability}
                                            onChange={() => setAvailability(true)}
                                        />
                                        <span className="ml-2">Available</span>
                                    </label>
                                    
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio text-red-500"
                                            checked={!availability}
                                            onChange={() => setAvailability(false)}
                                        />
                                        <span className="ml-2">Not Available</span>
                                    </label>
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
                        ) : (
                            <div className="text-gray-600">
                                No availability set for this date. Click on a date to set availability.
                            </div>
                        )}
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
        </Layout>
    );
};

export default ViewAvailability; 