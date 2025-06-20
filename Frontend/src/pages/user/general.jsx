import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function General() {
    const [user, setUser] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState("not verified");
    const [formObj, setFormObj] = useState(null);
    const navigate = useNavigate();
    const { user: authUser, loading } = useAuth();

    useEffect(() => {
        if (!loading && !authUser) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/users/me");
                setUser(response.data);
                
                // Check verification status
                const verificationResponse = await axios.get("http://localhost:4000/api/users/me/verification");
                setFormObj(verificationResponse.data);
                
                if (verificationResponse.data === null) {
                    setVerificationStatus("not verified");
                } else if (verificationResponse.data.isRejected) {
                    setVerificationStatus("rejected");
                } else if (verificationResponse.data.isVerified) {
                    setVerificationStatus("verified");
                } else {
                    setVerificationStatus("pending");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        if (authUser) {
            fetchUserData();
        }
    }, [authUser, loading, navigate]);

    const handleRetryVerification = async () => {
        try {
            await axios.delete("http://localhost:4000/api/forms/user");
            toast.success("You can now re-submit your verification form.");
            navigate("/user/general/verify");
        } catch (error) {
            toast.error("Failed to reset verification. Please try again.");
        }
    };

    if (loading) return <p className="text-2xl font-semibold text-gray-700">Loading...</p>;
    if (!user) return <p className="text-2xl font-semibold text-gray-700">Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">User Details</h2>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Name</p>
                        <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">NIC</p>
                        <p className="font-medium">{user.nic}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Verification Status</h3>
                <div className="flex items-center space-x-4">
                    <div className={`px-4 py-2 rounded-full ${
                        verificationStatus === "verified" ? "bg-green-100 text-green-800" :
                        verificationStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                        verificationStatus === "rejected" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                    }`}>
                        {verificationStatus === "verified" && "Verified"}
                        {verificationStatus === "pending" && "Pending Verification"}
                        {verificationStatus === "rejected" && "Verification Rejected"}
                        {verificationStatus === "not verified" && "Not Verified"}
                    </div>
                    {verificationStatus === "not verified" && (
                        <button
                            onClick={() => navigate("/user/general/verify")}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Get Verified
                        </button>
                    )}
                    {verificationStatus === "rejected" && (
                        <button
                            onClick={handleRetryVerification}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Retry Verification
                        </button>
                    )}
                </div>
                {formObj?.rejectionReason && verificationStatus === "rejected" && (
                    <div className="mt-4">
                        <p className="text-gray-600">Rejection Reason:</p>
                        <p className="text-red-600">{formObj.rejectionReason}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
