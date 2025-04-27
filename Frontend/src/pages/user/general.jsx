import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function General() {
    const [user, setUser] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState("not verified");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:4000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setUser(response.data);
            // Check verification status using the new endpoint
            axios.get("http://localhost:4000/api/forms/user", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                console.log("Form response:", res.data);
                if (res.data === null) {
                    setVerificationStatus("not verified");
                } else if (res.data.isVerified) {
                    setVerificationStatus("verified");
                } else {
                    setVerificationStatus("pending");
                }
            })
            .catch(error => {
                console.error("Error fetching verification status:", error);
                setVerificationStatus("not verified");
            });
        })
        .catch(error => console.error("Error fetching user details:", error));
    }, []);

    if (!user) return <p className="text-2xl font-semibold text-gray-700">Loading...</p>;

    return (
        <div className="p-12 w-full max-w-none mx-auto bg-white relative">
            {/* Profile Picture */}
            <div className="absolute right-12 top-12">
                <div 
                    onClick={() => navigate("/user/general/profile")} 
                    className="cursor-pointer"
                >
                    {user.profilePicture ? (
                        <img 
                            src={`http://localhost:4000/uploads/profile_pictures/${user.profilePicture}`}
                            alt={user.firstName || 'Profile'} 
                            className="w-[70px] h-[70px] rounded-full object-cover"
                            onError={(e) => {
                                e.target.parentElement.querySelector('.fallback').style.display = 'flex';
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="fallback w-[70px] h-[70px] rounded-full bg-gray-800 flex items-center justify-center">
                            <span className="text-3xl text-white">
                                {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* User Details in Grid Layout */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-16 max-w-4xl mt-24">
                {/* Name Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Name</h2>
                    <p className="text-[28px] font-extralight">{`${user.firstName} ${user.lastName}`}</p>
                </div>

                {/* Email Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Email</h2>
                    <p className="text-[28px] font-extralight">{user.email}</p>
                </div>

                {/* Phone Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Phone</h2>
                    <p className="text-[28px] font-extralight">{user.phone}</p>
                </div>

                {/* Address Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Address</h2>
                    <p className="text-[28px] font-extralight">{`${user.address.street}, ${user.address.city}, ${user.address.country}`}</p>
                </div>

                {/* Edit Details Link */}
                <div>
                    <button 
                        onClick={() => navigate("/user/general/update")}
                        className="text-[28px] font-extralight text-gray-700 hover:text-black transition-colors"
                    >
                        Edit Details
                    </button>
                </div>

                {/* Password Link */}
                <div>
                    <button 
                        onClick={() => navigate("/user/general/password")}
                        className="text-[28px] font-extralight text-gray-700 hover:text-black transition-colors"
                    >
                        Password
                    </button>
                </div>

                {/* Verified Status Section */}
                <div className="col-span-2 mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Verified Status</h2>
                    {verificationStatus === "pending" && (
                        <p className="text-[28px] font-extralight text-blue-500">pending</p>
                    )}
                    {verificationStatus === "not verified" && (
                        <p className="text-[28px] font-extralight text-red-500">not verified</p>
                    )}
                    {verificationStatus === "verified" && (
                        <p className="text-[28px] font-extralight text-green-600">verified</p>
                    )}
                    <button 
                        className="text-[28px] font-extralight text-gray-700 hover:text-black transition-colors mt-3"
                        onClick={() => navigate("/user/general/verify")}
                        disabled={verificationStatus === "pending" || verificationStatus === "verified"}
                    >
                        Verify your account
                    </button>
                </div>
            </div>
        </div>
    );
}
