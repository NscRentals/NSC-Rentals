import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaTools, FaUserTie, FaHandshake } from 'react-icons/fa';

const Careers = () => {
  const jobListings = [
    {
      title: "Professional Driver",
      icon: <FaCar className="h-8 w-8 text-blue-600" />,
      description: "Join our team as a professional driver. We're looking for experienced drivers who are passionate about providing excellent service.",
      requirements: [
        "Valid driver's license",
        "Clean driving record",
        "Excellent customer service skills",
        "Flexible schedule"
      ],
      action: "Register as Driver"
    },
    {
      title: "Vehicle Technician",
      icon: <FaTools className="h-8 w-8 text-blue-600" />,
      description: "We're seeking skilled technicians to maintain and repair our fleet of vehicles.",
      requirements: [
        "Automotive certification",
        "3+ years experience",
        "Strong diagnostic skills",
        "Team player"
      ],
      action: "Apply Now"
    },
    {
      title: "Customer Service Representative",
      icon: <FaUserTie className="h-8 w-8 text-blue-600" />,
      description: "Help us deliver exceptional customer service to our clients.",
      requirements: [
        "Excellent communication skills",
        "Problem-solving abilities",
        "Customer service experience",
        "Computer proficiency"
      ],
      action: "Apply Now"
    },
    {
      title: "Fleet Manager",
      icon: <FaHandshake className="h-8 w-8 text-blue-600" />,
      description: "Manage and optimize our vehicle fleet operations.",
      requirements: [
        "Fleet management experience",
        "Strong organizational skills",
        "Leadership abilities",
        "Analytical mindset"
      ],
      action: "Apply Now"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Join Our Team
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Be part of a dynamic team that's shaping the future of vehicle rental services
          </p>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {jobListings.map((job, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {job.icon}
                  <h3 className="ml-3 text-xl font-semibold text-gray-900">{job.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                {job.title === "Professional Driver" ? (
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {job.action}
                  </Link>
                ) : (
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {job.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Join NSC Rentals?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Benefits</h3>
              <p className="text-gray-600">
                We offer competitive salaries, health insurance, and other benefits to ensure our team members are well taken care of.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">
                We believe in promoting from within and providing opportunities for professional development and career advancement.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Work-Life Balance</h3>
              <p className="text-gray-600">
                We understand the importance of maintaining a healthy work-life balance and offer flexible scheduling options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers; 