import "./login.css" 
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000/api";

export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("user"); // "user" or "driver"
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email) {
            toast.error("Please enter your email");
            return false;
        }
        if (!password) {
            toast.error("Please enter your password");
            return false;
        }
        return true;
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            let response;
            if (userType === "driver") {
                console.log("Attempting driver login...");
                response = await axios.post(`${API_BASE_URL}/driver/login`, {
                    DriverEmail: email,
                    DriverPW: password
                });
                
                console.log("Driver login response:", response.data);
                
                if (response.data.token) {
                    localStorage.setItem('driverId', response.data.driver._id);
                    localStorage.setItem('driverToken', response.data.token);
                    localStorage.setItem('driverName', response.data.driver.DriverName);
                    toast.success("Driver Login Successful");
                    navigate("/dashboard/" + response.data.driver._id);
                }
            } else {
                console.log("Attempting user login...");
                response = await axios.post(`${API_BASE_URL}/users/login`, {
                    email: email,
                    password: password
                });
                
                console.log("User login response:", response.data);
                
                const user = response.data.user;
                localStorage.setItem('userId', user._id);
                localStorage.setItem('userRole', user.type);
                
                if (user.type === "Customer") {
                    toast.success("User Login Successful");
                    navigate("/user");
                } else if (user.type === "admin") {
                    toast.success("Admin Login Successful");
                    navigate("/admin");
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            const errorMessage = err.response?.data?.error || "Login failed. Please check your credentials.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-image w-full h-screen flex justify-center items-center">
            <form onSubmit={handleOnSubmit}>
                <div className="w-[500px] h-[600px] backdrop-blur-xl flex flex-col justify-center items-center">
                    <h1 className="text-white mb-10 text-2xl">Login</h1>
                    
                    {/* User Type Selection */}
                    <div className="flex space-x-4 mb-6">
                        <label className="text-white">
                            <input
                                type="radio"
                                value="user"
                                checked={userType === "user"}
                                onChange={() => setUserType("user")}
                                className="mr-2"
                            />
                            User
                        </label>
                        <label className="text-white">
                            <input
                                type="radio"
                                value="driver"
                                checked={userType === "driver"}
                                onChange={() => setUserType("driver")}
                                className="mr-2"
                            />
                            Driver
                        </label>
                    </div>

                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-[300px] h-[50px] bg-transparent border-b-2 border-white text-white text-2xl outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="mt-6 w-[300px] h-[50px] bg-transparent border-b-2 border-white text-white text-2xl outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    
                    <button 
                        type="submit"
                        className={`my-10 w-[200px] h-[50px] bg-black text-white backdrop-blur-xl rounded-lg hover:bg-gray-800 transition-colors ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    );
}