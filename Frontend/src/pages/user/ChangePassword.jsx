import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ChangePassword() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            // Attempt to change the password
            await axios.put("http://localhost:4000/api/users/password", { password }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // If successful, show success message and navigate
            toast.success("Password Changed Successfully");
            navigate("/user/general");
        } catch (error) {
            // Handle error response
            console.error("Error changing password:", error);
            toast.error("Error occurred while changing password");
        }
    }

    return (
        <div className="p-12 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Change Password</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div className="flex justify-center gap-8">
                    <button
                        type="submit"
                        className="w-40 py-4 bg-green-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-800 transition"
                    >
                        Change Password
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/user/general")}
                        className="w-40 py-4 bg-gray-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
