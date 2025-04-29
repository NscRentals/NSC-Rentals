import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function DeleteAccount() {
    const [email, setEmail] = useState("");
    const [confirm, setConfirm] = useState(false);
    const navigate = useNavigate();

    async function handleDelete() {
        const token = localStorage.getItem("token");

        try {
            const res = await axios.delete("http://localhost:4000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
                data: { email }
            });

            toast.success(res.data.message || "Account deleted successfully");

            // Remove session and navigate
            localStorage.removeItem("token");
            navigate("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error(error.response?.data?.message || "Failed to delete account");
        }
    }

    return (
        <div className="p-12 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-red-600 mb-6">Delete Account</h1>
            <p className="text-gray-700 text-lg text-center mb-6">
                Are you sure you want to delete your account? This action is <span className="font-semibold text-red-600">permanent</span> and cannot be undone.
            </p>

            <div className="mb-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>

            <div className="flex items-center mb-6">
                <input
                    type="checkbox"
                    id="confirmDelete"
                    checked={confirm}
                    onChange={() => setConfirm(!confirm)}
                    className="w-5 h-5 text-red-600"
                />
                <label htmlFor="confirmDelete" className="ml-3 text-gray-700">
                    I understand that this action cannot be undone.
                </label>
            </div>

            <div className="flex justify-center gap-6">
                <button
                    disabled={!confirm || !email}
                    onClick={handleDelete}
                    className={`w-40 py-3 text-white text-lg font-semibold rounded-lg shadow-md transition
                        ${confirm && email ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    Delete
                </button>

                <button
                    onClick={() => navigate("/user/general")}
                    className="w-40 py-3 bg-gray-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
