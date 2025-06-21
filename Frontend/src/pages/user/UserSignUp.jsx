import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe } from "react-icons/fa";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        type: "Customer",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
        }
    });

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        
        if (name.startsWith("address.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }

    async function handleOnSubmit(e) {
        e.preventDefault();

        try {
            await axios.post("http://localhost:4000/api/users", formData);
            toast.success("Registration Successful! Please log in.");
            navigate("/login");
        } catch (err) {
            console.error("Registration Error:", err);
            toast.error(err.response?.data?.message || "Registration failed!");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="md:flex">
                    {/* Left side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600 mb-8">Fill in your details to get started</p>

                        <form onSubmit={handleOnSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xl font-semibold block mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black mb-5"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xl font-semibold block mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black mb-5"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xl font-semibold block mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black mb-5"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xl font-semibold block mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black mb-5"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xl font-semibold block mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black mb-5"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xl font-semibold block mb-2">Street Address</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black mb-5"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    required
                                    placeholder="Street address"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xl font-semibold block mb-2">City</label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black mb-5"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="City"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xl font-semibold block mb-2">State</label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black mb-5"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        required
                                        placeholder="State"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xl font-semibold block mb-2">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="address.zipCode"
                                        className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black mb-5"
                                        value={formData.address.zipCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="ZIP code"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xl font-semibold block mb-2">Country</label>
                                    <input
                                        type="text"
                                        name="address.country"
                                        className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black mb-5"
                                        value={formData.address.country}
                                        onChange={handleChange}
                                        required
                                        placeholder="Country"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-mygreen hover:bg-green-800 text-white py-4 text-2xl rounded-full mt-6"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                    {/* Right side - Social Logins */}
                    <div className="w-full md:w-1/2 flex items-center justify-center bg-white rounded-3xl shadow-xl p-12">
                        <div className="w-full max-w-[400px] text-center flex flex-col items-center">
                            <h2 className="text-3xl font-bold mb-12">Or sign up with...</h2>
                            <div className="flex flex-col gap-6 w-full">
                                {/* Facebook */}
                                <button className="w-full flex items-center gap-5 bg-[#4267B2] text-white text-xl py-5 px-7 rounded-xl shadow-md justify-center">
                                    <img src="/icons/facebook.svg" alt="Facebook" className="h-8 w-8" />
                                    Continue with Facebook
                                </button>
                                {/* Google */}
                                <button className="w-full flex items-center gap-5 border border-gray-300 text-xl py-5 px-7 rounded-xl justify-center">
                                    <img src="/icons/google.svg" alt="Google" className="h-8 w-8" />
                                    Continue with Google
                                </button>
                                {/* Apple */}
                                <button className="w-full flex items-center gap-5 bg-black text-white text-xl py-5 px-7 rounded-xl justify-center">
                                    <img src="/icons/apple.svg" alt="Apple" className="h-8 w-8" />
                                    Continue with Apple
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
