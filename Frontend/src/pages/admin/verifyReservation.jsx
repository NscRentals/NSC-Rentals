import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function VerifyReservation() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userProfile, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('VerifyReservation component mounted');
        console.log('User profile:', userProfile);
        console.log('Is logged in:', isLoggedIn);
        
        if (!isLoggedIn || userProfile?.type !== 'admin') {
            console.log('User not authorized, redirecting to login');
            navigate('/login');
            return;
        }
        fetchUnverifiedReservations();
    }, [isLoggedIn, userProfile, navigate]);

    const fetchUnverifiedReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching unverified reservations...');
            
            if (!token) {
                console.log('No token found, redirecting to login');
                toast.error('Please log in to view reservations');
                navigate('/login');
                return;
            }

            console.log('Making API call to fetch unverified reservations');
            const response = await axios.get('http://localhost:4000/api/reservation/unverified', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('API Response:', response.data);
            const unverifiedReservations = response.data.reservations || [];
            console.log('Number of unverified reservations:', unverifiedReservations.length);
            
            setReservations(unverifiedReservations);
            setLoading(false);

            if (unverifiedReservations.length === 0) {
                toast.success('No pending reservations to verify');
            }
        } catch (err) {
            console.error('Error fetching reservations:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            
            if (err.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                logout();
                navigate('/login');
            } else {
                setError('Failed to fetch reservations');
                toast.error('Failed to fetch reservations');
            }
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Approving reservation:', id);
            
            const response = await axios.post(
                `http://localhost:4000/api/reservation/${id}/verify`,
                { action: 'approve' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Approve response:', response.data);
            toast.success('Reservation approved successfully');
            
            // Remove the approved reservation from the list
            setReservations(prev => prev.filter(res => res._id !== id));
        } catch (err) {
            console.error('Error approving reservation:', err);
            if (err.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                logout();
                navigate('/login');
            } else {
                toast.error('Failed to approve reservation');
            }
        }
    };

    const handleReject = async (id) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Rejecting reservation:', id);
            
            const response = await axios.post(
                `http://localhost:4000/api/reservation/${id}/verify`,
                { action: 'reject' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Reject response:', response.data);
            toast.success('Reservation rejected successfully');
            
            // Remove the rejected reservation from the list
            setReservations(prev => prev.filter(res => res._id !== id));
        } catch (err) {
            console.error('Error rejecting reservation:', err);
            if (err.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                logout();
                navigate('/login');
            } else {
                toast.error('Failed to reject reservation');
            }
        }
    };

    if (loading) return <div className="p-8">Loading reservations...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-[38px] font-bold mb-8">Verify Reservations</h1>
            
            {reservations.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                    No pending reservations to verify
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reservation ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vehicle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Start Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    End Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reservations.map((reservation) => (
                                <tr key={reservation._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {reservation.rId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {reservation.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {reservation.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {reservation.rType}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {reservation.vehicleNum}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(reservation.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(reservation.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${reservation.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-green-600 hover:text-green-900 mr-4"
                                            onClick={() => handleApprove(reservation._id)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleReject(reservation._id)}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 