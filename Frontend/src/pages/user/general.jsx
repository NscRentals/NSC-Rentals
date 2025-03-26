import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa"; // Importing the edit icon from react-icons

export default function General() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:4000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setUser(response.data))
        .catch(error => console.error("Error fetching user details:", error));
    }, []);

    if (!user) return <p className="text-2xl font-semibold text-gray-700">Loading...</p>;

    // Construct the full URL for the profile picture
    const profileImageUrl = user.profilePicture
        ? `http://localhost:4000/uploads/profile_pictures/${user.profilePicture}`
        : "default.png"; // Use "default.png" as fallback if no profile picture exists

    return (
        <div className="p-12 w-full max-w-none mx-auto bg-white rounded-lg relative">
            <h1 className="text-5xl font-bold text-black mb-8">My Account</h1>
            
            {/* Profile Picture positioned on the top-right */}
            <div className="absolute top-8 right-8">
                <img 
                    src={profileImageUrl} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-gray-300 mb-4"
                />
                <button 
                    onClick={() => navigate("/user/general/profile")} 
                    className="absolute bottom-0 right-0 bg-green-700 text-white p-2 rounded-full hover:bg-green-800"
                >
                    <FaEdit className="text-2xl" />
                </button>
            </div>

            {/* User Details */}
            <p className="text-2xl text-gray-800"><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
            <p className="text-2xl text-gray-800"><strong>Email:</strong> {user.email}</p>
            <p className="text-2xl text-gray-800"><strong>Phone:</strong> {user.phone}</p>
            <p className="text-2xl text-gray-800">
                <strong>Address:</strong> {`${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.zipCode}, ${user.address.country}`}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-6">
                <button 
                    onClick={() => navigate("/user/general/password")} 
                    className="px-8 py-4 text-xl text-white bg-black hover:bg-gray-900 rounded-lg shadow-md transition"
                >
                    Change Password
                </button>
                <button 
                    onClick={() => navigate("/user/general/update")} 
                    className="px-8 py-4 text-xl text-white bg-green-700 hover:bg-green-800 rounded-lg shadow-md transition"
                >
                    Edit Details
                </button>
            </div>
        </div>
    );
}
