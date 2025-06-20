import React from 'react';
import { FaUsers, FaTools, FaCar, FaHandshake } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            About NSC Rentals
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your trusted partner in vehicle rental and maintenance services
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600">
              At NSC Rentals, we are committed to providing exceptional vehicle rental and maintenance services. 
              Our mission is to ensure customer satisfaction through reliable, efficient, and professional service 
              while maintaining the highest standards of safety and quality.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="flex justify-center">
                <FaUsers className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Expert Team</h3>
              <p className="mt-2 text-gray-600">
                Our team of professionals is dedicated to providing the best service experience.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="flex justify-center">
                <FaTools className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Quality Service</h3>
              <p className="mt-2 text-gray-600">
                We maintain the highest standards in vehicle maintenance and repair.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="flex justify-center">
                <FaCar className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Fleet Management</h3>
              <p className="mt-2 text-gray-600">
                Comprehensive fleet management solutions for all your needs.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="flex justify-center">
                <FaHandshake className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Customer Focus</h3>
              <p className="mt-2 text-gray-600">
                Your satisfaction is our top priority in everything we do.
              </p>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-600">
                  We conduct our business with honesty and transparency, building trust with our customers and partners.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our service delivery and operations.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously seek new ways to improve our services and meet evolving customer needs.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety</h3>
                <p className="text-gray-600">
                  We prioritize the safety of our customers, employees, and the community in all our operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 