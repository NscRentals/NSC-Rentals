import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UpdateUserDetails() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: { street: "", city: "", state: "", zipCode: "", country: "" }
    });
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        if (name in formData.address) {
            setFormData({
                ...formData,
                address: { ...formData.address, [name]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");

        axios.put("http://localhost:4000/api/users", formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            toast.success("User details updated successfully!");
            navigate("/user/general");
        })
        .catch(error => {
            toast.error("Error updating user details.");
            console.error("Error updating details:", error);
        });
    }

    return (
        <div className="p-12 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit User Details</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name Inputs */}
                <div className="grid grid-cols-2 gap-6">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Phone Input */}
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {/* Address Inputs */}
                <h3 className="text-xl font-semibold text-gray-700 mt-4">Address</h3>
                <div className="grid grid-cols-2 gap-6">
                    <input
                        type="text"
                        name="street"
                        placeholder="Street"
                        value={formData.address.street}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.address.city}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.address.state}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="text"
                        name="zipCode"
                        placeholder="Zip Code"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.address.country}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-8 mt-6">
                    <button
                        type="submit"
                        className="w-40 py-4 bg-green-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-800 transition"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/user/myAccount")}
                        className="w-40 py-4 bg-gray-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
