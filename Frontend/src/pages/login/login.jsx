import "./login.css";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleOnSubmit(e) {
        e.preventDefault(); // Prevent page refresh on form submit

        try {
            const response = await axios.post("http://localhost:4000/api/users/login", {
                email,
                password
            });

            toast.success("Login Successful");

            const { user, token } = response.data;

            if (token) {
                localStorage.setItem("token", token); // Store JWT token
            }

            // Check the role from the backend response
            const role = user.type;

            // Navigate based on user type
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
    }

    return (
        <div>
            {/* Fixed Header */}
            <div className="w-full h-[83px] flex bg-white items-center fixed top-0 left-0 z-10 px-6">
                <h1 className="text-2xl font-semibold">User Authorization</h1>
                <RxCross1 className="ml-auto text-4xl cursor-pointer" />
            </div>

            {/* Main Content Section */}
            <div className="w-full h-screen flex pt-[100px]"> {/* Adjust padding to match header height */}
                <form 
                    onSubmit={handleOnSubmit} 
                    className="w-[830px] h-screen bg-green-50 flex flex-col justify-center items-center"
                >
                    <h1 className="mb-10 text-2xl">Login</h1>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-[300px] h-[50px] bg-transparent border-b-2 text-2xl outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="mt-6 w-[300px] h-[50px] bg-transparent border-b-2 text-2xl outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="my-10 w-[200px] h-[50px] bg-black backdrop-blur-xl rounded-lg text-white"
                    >
                        Login
                    </button>
                </form>

                {/* Blue background div filling the rest of the space */}
                <div className="w-[calc(100vw-830px)] h-screen bg-blue-50">
                    Home
                </div>
            </div>
        </div>
    );
}
