import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:4000/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = `${API_BASE_URL}/users/login`;
            const response = await axios.post(endpoint, {
                email,
                password
            });
            const { user, token } = response.data;
            if (token) {
                toast.success("Login Successful");
                await login(token); // Wait for login to complete
                // After login is complete, navigate based on user type
                const userType = user.type.toLowerCase();
                const from = location.state?.from?.pathname;
                setTimeout(() => {
                    if (from) {
                        navigate(from, { replace: true });
                    } else if (userType === "admin") {
                        navigate("/admin/dashboard", { replace: true });
                    } else if (userType === "driver") {
                        localStorage.setItem('driverId', user.id);
                        navigate(`/dashboard/${user.id}`);
                    } else if (userType === "technician") {
                        navigate("/technician/dashboard", { replace: true });
                    } else {
                        navigate("/user/general", { replace: true });
                    }
                }, 100);
            } else {
                toast.error("Login failed - No token received");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Invalid email or password");
        }
    }

    return (
        <div>
            {/* Fixed Header with blur */}
            <div className="w-full h-[83px] flex items-center fixed top-0 left-0 z-10 px-6 shadow-md backdrop-blur-3xl bg-white/60 border-b border-gray-200">
                <h1 className="text-2xl font-bold">User Authorization</h1>
                <RxCross1 
                    className="ml-auto text-4xl cursor-pointer" 
                    onClick={() => navigate('/')}
                />
            </div>

            {/* Scrollable Section */}
            <div className="pt-[83px] flex w-full h-[calc(100vh-83px)] overflow-y-auto">
                {/* Left Form Side */}
                <form
                    onSubmit={handleOnSubmit}
                    className="w-full max-w-xl min-h-full bg-white flex flex-col justify-center items-center px-4 md:px-8 border-r border-gray-300"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 w-full text-left">Log In</h1>

                    {/* Info Box */}
                    <div className="w-full flex items-start bg-mylightblue rounded-2xl p-4 md:p-5 text-base md:text-lg mb-6">
                        <img
                            src="/icons/question.png"
                            alt="Question Icon"
                            className="h-8 w-8 md:h-10 md:w-10 mr-3 md:mr-4"
                        />
                        <p className="text-base md:text-lg">
                            Enter your email and password to log in to your account. You will be redirected to your dashboard based on your role.
                        </p>
                    </div>

                    {/* Email */}
                    <div className="w-full">
                        <label className="text-lg md:text-xl font-semibold block mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full mb-4 h-12 md:h-16 px-3 md:px-4 border bg-white border-gray-300 rounded-xl text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="w-full">
                        <label className="text-lg md:text-xl font-semibold block mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full h-12 md:h-16 px-3 md:px-4 border bg-white border-gray-300 rounded-xl text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="w-full mt-3 text-base md:text-lg">
                        <span className="text-gray-600">Forgot your </span>
                        <a href="#" className="text-blue-600 underline">password</a>
                        <span>?</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 w-full">
                        <button
                            type="submit"
                            className="bg-mygreen hover:bg-green-800 text-white w-full py-3 md:py-4 text-lg md:text-2xl rounded-full"
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            className="border border-mygreen text-green-900 hover:bg-green-100 w-full py-3 md:py-4 text-lg md:text-2xl rounded-full"
                            onClick={() => navigate("/user/add")}
                        >
                            Create Account
                        </button>
                    </div>
                </form>

                {/* Right Side - Social Logins */}
                <div className="flex-1 min-h-full bg-white flex items-center justify-center">
                    <div className="text-left">
                        <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12">Or continue with...</h2>
                        {/* Facebook */}
                        <button className="w-full max-w-xs flex items-center mb-6 md:mb-9 gap-4 md:gap-5 bg-[#4267B2] text-white text-lg md:text-2xl py-4 md:py-5 px-5 md:px-7 rounded-xl shadow-md">
                            <img src="/icons/facebook.svg" alt="Facebook" className="h-7 w-7 md:h-9 md:w-9" />
                            Continue with Facebook
                        </button>
                        {/* Google */}
                        <button className="w-full max-w-xs flex items-center mb-6 md:mb-9 gap-4 md:gap-5 border border-gray-300 text-lg md:text-2xl py-4 md:py-5 px-5 md:px-7 rounded-xl">
                            <img src="/icons/google.svg" alt="Google" className="h-7 w-7 md:h-9 md:w-9" />
                            Continue with Google
                        </button>
                        {/* Apple */}
                        <button className="w-full max-w-xs flex items-center gap-4 md:gap-5 bg-black text-white text-lg md:text-2xl py-4 md:py-5 px-5 md:px-7 rounded-xl">
                            <img src="/icons/apple.svg" alt="Apple" className="h-7 w-7 md:h-9 md:w-9" />
                            Continue with Apple
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
