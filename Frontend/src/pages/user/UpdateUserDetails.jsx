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
        <div className="min-h-screen bg-white py-16 px-8 sm:px-12 lg:px-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-black mb-16">Edit details</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 text-2xl bg-gray-200 rounded-lg focus:outline-none"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 text-2xl bg-gray-200 rounded-lg focus:outline-none"
                        />
                    </div>

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 text-2xl bg-gray-200 rounded-lg focus:outline-none"
                    />

                    {/* Address Section */}
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold text-black mb-8">Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    name="street"
                                    placeholder="Street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 text-2xl bg-gray-200 rounded-lg focus:outline-none"
                                />
                            </div>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.address.city}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 text-2xl bg-gray-200 rounded-lg focus:outline-none"
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.address.state}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 text-2xl bg-gray-200 rounded-lg focus:outline-none"
                            />
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="Zip code"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 text-2xl bg-gray-200 rounded-lg focus:outline-none"
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.address.country}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 text-2xl bg-gray-200 rounded-lg focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-start space-x-6 mt-16">
                        <button
                            type="button"
                            onClick={() => navigate("/user/general")}
                            className="px-16 py-4 text-2xl bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-16 py-4 text-2xl bg-black text-white rounded-full hover:bg-gray-900 transition-colors duration-200"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
