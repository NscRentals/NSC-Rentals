import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const DriverHeader = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const driverId = localStorage.getItem('driverId');

    const handleLogout = () => {
        logout();
        localStorage.removeItem('driverId');
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Left side - Logo/Brand */}
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-gray-800">NSC Rentals</h1>
                    </div>

                    {/* Right side - Navigation */}
                    <nav className="flex items-center space-x-6">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                        >
                            <FaHome className="text-lg" />
                            <span>Website Home</span>
                        </button>

                        <button
                            onClick={() => navigate(`/dashboard/${driverId}`)}
                            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                        >
                            <FaTachometerAlt className="text-lg" />
                            <span>Dashboard</span>
                        </button>

                        <button
                            onClick={() => navigate(`/driverprofile/${driverId}`)}
                            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                        >
                            <FaUser className="text-lg" />
                            <span>Profile</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                        >
                            <FaSignOutAlt className="text-lg" />
                            <span>Logout</span>
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default DriverHeader; 