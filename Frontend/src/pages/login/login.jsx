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
        e.preventDefault();

        try {
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
    }

    return (
        <div>
            {/* Fixed Header with blur */}
            <div className="w-full h-[83px] flex items-center fixed top-0 left-0 z-10 px-6 shadow-md backdrop-blur-3xl bg-white/60 border-b border-gray-200">
                <h1 className="text-2xl font-bold">User Authorization</h1>
                <RxCross1 className="ml-auto text-4xl cursor-pointer" />
            </div>

            {/* Scrollable Section */}
            <div className="pt-[83px] flex w-full h-[calc(100vh-83px)] overflow-y-auto">
                {/* Left Form Side */}
                <form
                    onSubmit={handleOnSubmit}
                    className="w-[830px] min-h-full bg-white flex flex-col justify-center items-center px-10 border-r border-gray-300"
                >
                    <h1 className="text-5xl font-bold mb-12 w-full text-left ml-[260px]">Log In</h1>

                    {/* Info Box */}
                    <div className="w-full max-w-[500px] flex items-start bg-mylightblue rounded-[20px] p-5 text-lg mb-8">
                        <img
                            src="/icons/question.png"
                            alt="Question Icon"
                            className="h-10 w-10 mr-4"
                        />
                        <p className="text-xl">
                            Don't see your previous login choice? Please use reset password to update your login information.
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
                        />
                    </div>

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
                            className="bg-mygreen hover:bg-green-800 text-white w-full py-4 text-2xl rounded-full"
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            className="border border-mygreen text-green-900 hover:bg-green-100 w-full py-4 text-2xl rounded-full"
                            onClick={() => navigate("/user/add")}
                        >
                            Create Account
                        </button>
                    </div>
                </form>

                {/* Right Side - Social Logins */}
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
            </div>
        </div>
    );
}
