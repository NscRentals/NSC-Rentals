import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('driverId');
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    const driverId = localStorage.getItem('driverId');

    const handleLogout = () => {
        localStorage.clear();
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
                        
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>
                            
                            {isLoggedIn && (
                                <>
                                    {isAdmin ? (
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
                                <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600">
                                    Register as Driver
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