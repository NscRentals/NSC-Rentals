import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UpdateProfilePicture() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // State to store image preview
    const navigate = useNavigate();

    // Handle file input change
    function handleFileChange(e) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Create a preview of the image
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);
    }

    // Handle the form submission
    function handleUpload(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("profilePicture", file);

        axios.put("http://localhost:4000/api/users/pic", formData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        })
        .then(() => {
            toast.success("Profile Picture Updated!");
            navigate("/user/general");
        })
        .catch(error => console.error("Error updating profile picture:", error));
    }

    return (
        <div className="p-12 max-w-lg mx-auto bg-white rounded-lg space-y-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Change Profile Picture</h1>
            <form onSubmit={handleUpload} className="space-y-6">
                {/* File input */}
                <div className="flex justify-center">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="file:border file:border-gray-300 file:rounded-lg file:px-6 file:py-4 file:bg-green-700 file:text-white hover:file:bg-green-800 transition"
                    />
                </div>

                {/* Image Preview */}
                {preview && (
                    <div className="flex justify-center">
                        <img 
                            src={preview} 
                            alt="Preview"
                            className="w-40 h-40 rounded-full border-4 border-gray-300 mb-6"
                        />
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-center gap-8">
                    <button
                        type="submit"
                        className="w-40 py-4 bg-green-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-800 transition"
                    >
                        Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/user/general")}
                        className="w-40 py-4 bg-gray-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
