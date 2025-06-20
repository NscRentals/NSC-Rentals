import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { FaUser, FaCar, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:4000/api";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isDriver, setIsDriver] = useState(false);
    const [isTechnician, setIsTechnician] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate inputs
        if (!email || !password) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        try {
            let endpoint;
            if (isDriver) {
                endpoint = `${API_BASE_URL}/driver/login`;
                console.log("Attempting driver login with:", { email });
            } else if (isTechnician) {
                endpoint = `${API_BASE_URL}/technician/login`;
            } else {
                endpoint = `${API_BASE_URL}/users/login`;
            }

            // Store the user type before making the request
            const userType = isDriver ? 'driver' : isTechnician ? 'technician' : 'user';
            localStorage.setItem('userType', userType);

            console.log('Making request to:', endpoint);
            const response = await axios.post(endpoint, {
                email,
                password
            });

            console.log('Response data:', response.data);

            if (!response.data.success && isDriver) {
                throw new Error(response.data.error || "Login failed");
            }

            const { token, driver, user } = response.data;

            if (!token) {
                throw new Error("No token received");
            }

            // Set the token in localStorage
            localStorage.setItem('token', token);
            
            // Set the Authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Handle login based on user type
            if (isDriver) {
                if (!driver || !driver._id) {
                    throw new Error("Driver data not found in response");
                }
                console.log("Driver login successful:", driver);
                localStorage.setItem('driverId', driver._id);
                await login({ ...driver, type: 'driver' });
                navigate('/driver/dashboard');
                toast.success(`Welcome back, ${driver.DriverName}`);
            } else if (isTechnician) {
                await login({ ...user, type: 'technician' });
                navigate("/technician/dashboard");
                toast.success("Login Successful");
            } else if (user && user.type === "admin") {
                await login({ ...user, type: 'admin' });
                navigate("/admin/dashboard");
                toast.success("Welcome back, Admin");
            } else {
                await login({ ...user, type: 'user' });
                navigate("/user/general");
                toast.success("Login Successful");
            }

        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.error 
                || error.response?.data?.message 
                || error.message 
                || "Invalid email or password";
            setError(errorMessage);
            toast.error(errorMessage);
            
            // Clear any stored data on error
            if (isDriver) {
                localStorage.removeItem('driverId');
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            }
        } finally {
            setLoading(false);
        }
    };

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
                    className="w-[830px] min-h-full bg-white flex flex-col justify-center items-center px-10 border-r border-gray-300"
                >
                    <h1 className="text-5xl font-bold mb-12 w-full text-left ml-[260px]">Log In</h1>

                    {/* Login Type Toggle */}
                    <div className="w-full max-w-[500px] flex gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => { setIsDriver(false); setIsTechnician(false); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                                !isDriver && !isTechnician
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <FaUser />
                            <span>User Login</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsDriver(true); setIsTechnician(false); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                                isDriver
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <FaCar />
                            <span>Driver Login</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsTechnician(true); setIsDriver(false); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                                isTechnician
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <FaUserCircle />
                            <span>Technician Login</span>
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className="w-full max-w-[500px] flex items-start bg-mylightblue rounded-[20px] p-5 text-lg mb-8">
                        <img
                            src="/icons/question.png"
                            alt="Question Icon"
                            className="h-10 w-10 mr-4"
                        />
                        <p className="text-xl">
                            {isDriver 
                                ? "Login with your driver account credentials to access the driver dashboard."
                                : isTechnician
                                    ? "Login with your technician account credentials to access the technician dashboard."
                                    : "Don't see your previous login choice? Please use reset password to update your login information."
                            }
                        </p>
                    </div>

                    {/* Email */}
                    <div className="w-full max-w-[500px]">
                        <label className="text-xl font-semibold block mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full mb-5 h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="w-full max-w-[500px]">
                        <label className="text-xl font-semibold block mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full h-[70px] px-4 border bg-white border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="w-full max-w-[500px] text-red-500 text-lg mb-4">
                            {error}
                        </div>
                    )}

                    {/* Forgot Password */}
                    <div className="w-full max-w-[500px] mt-4 text-lg">
                        <span className="text-gray-600">Forgot your </span>
                        <a href="#" className="text-blue-600 underline">password</a>
                        <span>?</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-6 mt-10 w-full h-[80px] max-w-[500px]">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-mygreen hover:bg-green-800 text-white w-full py-4 text-2xl rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                        <button
                            type="button"
                            className="border border-mygreen text-green-900 hover:bg-green-100 w-full py-4 text-2xl rounded-full"
                            onClick={() => navigate(isDriver ? "/register" : isTechnician ? "/technician/signup" : "/user/add")}
                        >
                            Create Account
                        </button>
                    </div>
                </form>

                {/* Right Side - Social Logins */}
                {!isDriver && !isTechnician && (
                    <div className="w-[calc(100vw-830px)] min-h-full bg-white flex items-center justify-center">
                        <div className="text-left">
                            <h2 className="text-4xl font-bold mb-12">Or continue with...</h2>

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
                )}
            </div>
        </div>
    );
}

export default LoginPage; 