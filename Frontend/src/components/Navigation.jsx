import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const navigate = useNavigate();
    const { isLoggedIn, userProfile, logout } = useAuth();
    const driverId = localStorage.getItem('driverId');

    const handleLogout = () => {
        logout();
        localStorage.removeItem('driverId');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-gray-800">
                                NSC Rentals
                            </Link>
                        </div>
                        
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>
                            <Link to="/about" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                About
                            </Link>
                            <Link to="/careers" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Careers
                            </Link>
                            <Link to="/contact" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Contact
                            </Link>
                            
                            {isLoggedIn && (
                                <>
                                    {userProfile?.type === 'admin' ? (
                                        <>
                                            <Link to="/admin" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                                Admin Dashboard
                                            </Link>
                                            <Link to="/admin/drivers/available" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                                Available Drivers
                                            </Link>
                                        </>
                                    ) : (
                                        <Link to={`/dashboard/${driverId}`} className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                            Driver Dashboard
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center">
                        {isLoggedIn ? (
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link to="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 