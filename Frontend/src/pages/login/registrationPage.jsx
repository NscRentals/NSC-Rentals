import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

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
            // First, register the user
            await axios.post("http://localhost:4000/api/users/", formData);

            // If registration is successful, attempt to log in
            const response = await axios.post("http://localhost:4000/api/users/login", {
                email: formData.email,
                password: formData.password
            });

            const { token } = response.data;

            if (token) {
                // Use the login function from AuthContext
                login(token);
                toast.success(`Welcome ${formData.firstName}!`);
                navigate("/user/dashboard"); // Navigate to user dashboard after registration
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.response?.data?.message || error.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div>
            {/* Fixed Header with blur */}
            <div className="w-full h-[83px] flex items-center sticky top-0 left-0 z-10 px-6 shadow-md backdrop-blur-3xl bg-white/60 border-b border-gray-200">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <RxCross1 
                    className="ml-auto text-4xl cursor-pointer" 
                    onClick={() => navigate('/')}
                />
            </div>

            {/* Scrollable Section */}
            <div className="flex w-full h-[calc(100vh-83px)] overflow-y-auto">
                {/* Left Form Side */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-[830px] min-h-full bg-white flex flex-col justify-center items-center px-6 md:px-10 py-8 border-r border-gray-300"
                >
                    <h1 className="text-5xl font-bold mb-12 w-full text-left ml-[260px]">Sign Up</h1>

                    {/* Info Box */}
                    <div className="w-full max-w-[500px] flex items-start bg-mylightblue rounded-[20px] p-5 text-lg mb-8">
                        <img
                            src="/icons/question.png"
                            alt="Question Icon"
                            className="h-10 w-10 mr-4"
                        />
                        <p className="text-xl">
                            Please fill in your details to create an account. All fields are required.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[500px]">
                        <div>
                            <label className="text-xl font-semibold block mb-2">First Name</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                value={formData.firstName}
                                onChange={handleChange} 
                                required
                                placeholder="Enter your first name"
                                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div>
                            <label className="text-xl font-semibold block mb-2">Last Name</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                value={formData.lastName}
                                onChange={handleChange} 
                                required
                                placeholder="Enter your last name"
                                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xl font-semibold block mb-2">Street</label>
                            <input 
                                type="text" 
                                name="address.street" 
                                value={formData.address.street}
                                onChange={handleChange} 
                                required
                                placeholder="Enter your street address"
                                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div>
                            <label className="text-xl font-semibold block mb-2">City</label>
                            <input 
                                type="text" 
                                name="address.city" 
                                value={formData.address.city}
                                onChange={handleChange} 
                                required
                                placeholder="Enter your city"
                                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div>
                            <label className="text-xl font-semibold block mb-2">State</label>
                            <input 
                                type="text" 
                                name="address.state" 
                                value={formData.address.state}
                                onChange={handleChange} 
                                required
                                placeholder="Enter your state"
                                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div>
                            <label className="text-xl font-semibold block mb-2">Zip Code</label>
                            <input 
                                type="text" 
                                name="address.zipCode" 
                                value={formData.address.zipCode}
                                onChange={handleChange} 
                                required
                                placeholder="Enter your zip code"
                                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div>
                            <label className="text-xl font-semibold block mb-2">Country</label>
                            <input 
                                type="text" 
                                name="address.country" 
                                value={formData.address.country}
                                onChange={handleChange} 
                                required
                                placeholder="Enter your country"
                                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xl font-semibold block mb-2">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email}
                                onChange={handleChange} 
                                required
                                placeholder="Enter your email address"
                                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xl font-semibold block mb-2">Phone</label>
                            <input 
                                type="tel" 
                                name="phone" 
                                value={formData.phone}
                                onChange={handleChange} 
                                required
                                placeholder="Enter your phone number"
                                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="col-span-2 relative">
                            <label className="text-xl font-semibold block mb-2">Password</label>
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password" 
                                value={formData.password}
                                onChange={handleChange} 
                                required
                                placeholder="Create a password"
                                className="w-full h-[50px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black pr-12"
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-[45px] right-4 cursor-pointer"
                            >
                                {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                            </div>
                        </div>
                        <div className="col-span-2 mt-4 text-lg flex items-start gap-2">
                            <input 
                                type="checkbox" 
                                checked={agreed} 
                                onChange={() => setAgreed(!agreed)}
                                className="mt-1"
                            />
                            <span>I agree to the <a href="#" className="text-blue-600 underline">terms and conditions</a>.</span>
                        </div>
                    </div>

                    <div className="flex gap-6 mt-10 w-full h-[80px] max-w-[500px]">
                        <button
                            type="submit"
                            className="bg-mygreen hover:bg-green-800 text-white w-full py-4 text-2xl rounded-full"
                        >
                            Create Account
                        </button>
                        <button
                            type="button"
                            className="border border-mygreen text-green-900 hover:bg-green-100 w-full py-4 text-2xl rounded-full"
                            onClick={() => navigate("/login")}
                        >
                            Log In
                        </button>
                    </div>
                </form>

                {/* Right Side - Social Logins */}
                <div className="w-[calc(100vw-830px)] min-h-full bg-white flex items-center justify-center">
                    <div className="text-left">
                        <h2 className="text-4xl font-bold mb-12">Or sign up with...</h2>
                        
                        {/* Facebook */}
                        <button className="w-[380px] flex items-center mb-9 gap-5 bg-[#4267B2] text-white text-2xl py-5 px-7 rounded-xl shadow-md">
                            <img src="/icons/facebook.svg" alt="Facebook" className="h-9 w-9" />
                            Continue with Facebook
                        </button>

                        {/* Google */}
                        <button className="w-[380px] flex items-center mb-9 gap-5 border border-gray-300 text-2xl py-5 px-7 rounded-xl">
                            <img src="/icons/google.svg" alt="Google" className="h-9 w-9" />
                            Continue with Google
                        </button>

                        {/* Apple */}
                        <button className="w-[380px] flex items-center gap-5 bg-black text-white text-2xl py-5 px-7 rounded-xl">
                            <img src="/icons/apple.svg" alt="Apple" className="h-9 w-9" />
                            Continue with Apple
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

