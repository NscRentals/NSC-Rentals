import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div className="text-gray-600">
                            © 2024 NSC Rentals. All rights reserved.
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout; 