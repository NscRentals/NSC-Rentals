import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleOnSubmit} className="w-full max-w-2xl bg-white p-10 rounded-xl shadow-lg border border-gray-300">
                <h1 className="text-gray-800 text-3xl font-semibold text-center mb-6">Register</h1>
                
                <div className="grid grid-cols-2 gap-6">
                    <input type="text" name="firstName" placeholder="First Name"
                        className="input-field p-3 text-lg border border-gray-300 rounded-lg" 
                        value={formData.firstName} onChange={handleChange} required />

                    <input type="text" name="lastName" placeholder="Last Name"
                        className="input-field p-3 text-lg border border-gray-300 rounded-lg" 
                        value={formData.lastName} onChange={handleChange} required />
                </div>

                <input type="email" name="email" placeholder="Email"
                    className="input-field mt-6 p-3 text-lg border border-gray-300 rounded-lg w-full" 
                    value={formData.email} onChange={handleChange} required />

                <input type="password" name="password" placeholder="Password"
                    className="input-field mt-6 p-3 text-lg border border-gray-300 rounded-lg w-full" 
                    value={formData.password} onChange={handleChange} required />

                <input type="text" name="phone" placeholder="Phone Number"
                    className="input-field mt-6 p-3 text-lg border border-gray-300 rounded-lg w-full" 
                    value={formData.phone} onChange={handleChange} required />

                <h2 className="text-gray-800 text-xl font-medium mt-10 mb-4">Address</h2>

                <input type="text" name="address.street" placeholder="Street"
                    className="input-field p-3 text-lg border border-gray-300 rounded-lg w-full" 
                    value={formData.address.street} onChange={handleChange} required />

                <div className="grid grid-cols-2 gap-6 mt-6">
                    <input type="text" name="address.city" placeholder="City"
                        className="input-field p-3 text-lg border border-gray-300 rounded-lg" 
                        value={formData.address.city} onChange={handleChange} required />

                    <input type="text" name="address.state" placeholder="State"
                        className="input-field p-3 text-lg border border-gray-300 rounded-lg" 
                        value={formData.address.state} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                    <input type="text" name="address.zipCode" placeholder="Zip Code"
                        className="input-field p-3 text-lg border border-gray-300 rounded-lg" 
                        value={formData.address.zipCode} onChange={handleChange} required />

                    <input type="text" name="address.country" placeholder="Country"
                        className="input-field p-3 text-lg border border-gray-300 rounded-lg" 
                        value={formData.address.country} onChange={handleChange} required />
                </div>

                <button className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold transition">
                    Register
                </button>
            </form>
        </div>
    );
}
