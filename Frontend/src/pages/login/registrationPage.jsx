import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [key]: value
                }
            })); 
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreed) {
            toast.error("You must agree to the terms and conditions");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/api/users/", {
                ...formData,
                type: "Customer" // assuming default
            });

            toast.success("Welcome ${formData.firstName}!");

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Registration failed");
        }

        
        try {

            const email = formData.email;
            const password =formData.password;

            const response = await axios.post("http://localhost:4000/api/users/login", {
                email,
                password
            });

            toast.success("Login Successful");

            const { user, token } = response.data;

            if (token) {
                localStorage.setItem("token", token);
            }

            const role = user.type;

            if (role === "Customer") {
                navigate("/");
            } else if (role === "admin") {
                navigate("/admin");
            } else if (role === "driver") {
                navigate("/Driver");
            } else if (role === "technician") {
                navigate("/Tech");
            } else {
                toast.error("Invalid user role");
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Login failed");
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="w-full h-[83px] flex items-center fixed top-0 left-0 z-10 px-6 shadow-md backdrop-blur-3xl bg-white/60 border-b border-gray-200">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <RxCross1 className="ml-auto text-4xl cursor-pointer" />
            </div>

            {/* Scrollable Body */}
            <div className="pt-[83px] flex w-full h-[calc(100vh-83px)] overflow-y-auto">
                {/* Left Form */}
                <form
                    onSubmit={handleSubmit}
                    className="w-[830px] min-h-full bg-white flex flex-col justify-center items-center px-10 border-r border-gray-300"
                >
                    <h1 className="text-5xl font-bold mb-10 w-full text-left ml-[240px]">Sign Up</h1>

                    <div className="grid grid-cols-2 gap-6 w-full max-w-[500px]">
                        <div>
                            <label className="block font-semibold mb-1">First Name</label>
                            <input type="text" name="firstName" value={formData.firstName}
                                onChange={handleChange} required
                                className="input" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName}
                                onChange={handleChange} required
                                className="input" />
                        </div>
                        <div className="col-span-2">
                            <label className="block font-semibold mb-1">Street</label>
                            <input type="text" name="address.street" value={formData.address.street}
                                onChange={handleChange} required
                                className="input" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">City</label>
                            <input type="text" name="address.city" value={formData.address.city}
                                onChange={handleChange} required
                                className="input" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">State</label>
                            <input type="text" name="address.state" value={formData.address.state}
                                onChange={handleChange} required
                                className="input" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Zip Code</label>
                            <input type="text" name="address.zipCode" value={formData.address.zipCode}
                                onChange={handleChange} required
                                className="input" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Country</label>
                            <input type="text" name="address.country" value={formData.address.country}
                                onChange={handleChange} required
                                className="input" />
                        </div>
                        <div className="col-span-2">
                            <label className="block font-semibold mb-1">Email</label>
                            <input type="email" name="email" value={formData.email}
                                onChange={handleChange} required
                                className="input" />
                        </div>
                        <div className="col-span-2">
                            <label className="block font-semibold mb-1">Phone</label>
                            <input type="tel" name="phone" value={formData.phone}
                                onChange={handleChange} required
                                className="input" />
                        </div>
                        <div className="col-span-2 relative">
                            <label className="block font-semibold mb-1">Password</label>
                            <input type={showPassword ? "text" : "password"}
                                name="password" value={formData.password}
                                onChange={handleChange} required
                                className="input pr-12" />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-[42px] right-4 cursor-pointer"
                            >
                                {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                            </div>
                        </div>
                        <div className="col-span-2 mt-2 text-sm flex items-start gap-2">
                            <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
                            <span>I agree to the <a href="#" className="underline text-blue-600">terms and conditions</a>.</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-8 w-full max-w-[500px] bg-mygreen hover:bg-green-800 text-white text-2xl py-4 rounded-full"
                    >
                        Register
                    </button>
                </form>

                {/* Right Section - Optional */}
                <div className="w-[calc(100vw-830px)] flex items-center justify-center">
                    <div className="text-left">
                        <h2 className="text-4xl font-bold mb-10">Or sign up with...</h2>
                        <button className="social-btn bg-[#4267B2] text-white mb-6">
                            <img src="/icons/facebook.svg" className="h-9 w-9" />
                            Continue with Facebook
                        </button>
                        <button className="social-btn border mb-6">
                            <img src="/icons/google.svg" className="h-9 w-9" />
                            Continue with Google
                        </button>
                        <button className="social-btn bg-black text-white">
                            <img src="/icons/apple.svg" className="h-9 w-9" />
                            Continue with Apple
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Tailwind utility styles
const inputClass = "w-full h-[60px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black";

// Tailwind utility for inputs
const styles = {
    input: inputClass,
};

