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
        if (!isLoggedIn || userProfile?.type !== 'admin') {
            navigate('/login');
            return;
        }
        fetchUnverifiedReservations();
    }, [isLoggedIn, userProfile, navigate]);

    const fetchUnverifiedReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please log in to view reservations');
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:4000/api/reservation/unverified', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const unverifiedReservations = response.data.reservations || [];
            setReservations(unverifiedReservations);
            setLoading(false);

            if (unverifiedReservations.length === 0) {
                toast.success('No pending reservations to verify');
            }
        } catch (err) {
            console.error('Error fetching reservations:', err);
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
            const response = await axios.post(
                `http://localhost:4000/api/reservation/${id}/verify`,
                { action: 'approve' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Reservation approved successfully');
            setReservations(prev => prev.map(res => 
                res._id === id ? { ...res, status: 'approved' } : res
            ));
        } catch (err) {
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
            const response = await axios.post(
                `http://localhost:4000/api/reservation/${id}/verify`,
                { action: 'reject' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Reservation rejected successfully');
            setReservations(prev => prev.map(res => 
                res._id === id ? { ...res, status: 'rejected' } : res
            ));
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                logout();
                navigate('/login');
            } else {
                toast.error('Failed to reject reservation');
            }
        }
    };

    if (loading) return (
        <div className="p-8">
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        </div>
    );

    return (
        <div className="p-8">
            <h1 className="text-[38px] font-bold mb-8">Verify Reservations</h1>
            
            {reservations.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                    No pending reservations to verify
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
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
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reservations.map((reservation) => (
                                <tr key={reservation._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {reservation.rId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                                        LKR {reservation.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            reservation.status === 'approved' 
                                                ? 'bg-green-100 text-green-800'
                                                : reservation.status === 'rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {reservation.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {!reservation.status && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(reservation._id)}
                                                    className="text-green-600 hover:text-green-900 mr-4"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(reservation._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
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