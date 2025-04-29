import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyAccount() {
  const [docType, setDocType] = useState("");
  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:4000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setUserData(response.data);
    })
    .catch(error => {
      console.error("Error fetching user details:", error);
      setMessage("Error fetching user details. Please try again.");
    });
  }, []);

  const handleFileChange = (e, side) => {
    if (side === "front") setFrontImg(e.target.files[0]);
    else setBackImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docType || !frontImg || !backImg) {
      setMessage("Please select document type and upload both images.");
      setSuccess(false);
      return;
    }
    if (!userData) {
      setMessage("User data not loaded. Please try again.");
      setSuccess(false);
      return;
    }
    setLoading(true);
    setMessage("");
    setSuccess(false);
    const formData = new FormData();
    formData.append("type", docType);
    formData.append("img1", frontImg);
    formData.append("img2", backImg);
    formData.append("address", userData.address.street || "");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:4000/api/forms", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Verification request sent successfully!");
      setSuccess(true);
      setFrontImg(null);
      setBackImg(null);
      setDocType("");
      setTimeout(() => {
        navigate("/user/general");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send verification request.");
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-84px)] w-full">
      <div className="flex flex-col justify-start items-start w-[700px] p-20 pl-28 bg-white mt-24 ml-0">
        <form
          className="w-full flex flex-col items-start"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl font-bold mb-12">Verify Account</h2>
          <div className="mb-12 w-full">
            <label className="block text-2xl font-semibold mb-6">Document type</label>
            <div className="flex flex-col gap-4 ml-2">
              <label className="flex items-center text-xl">
                <input
                  type="radio"
                  name="docType"
                  value="NIC"
                  checked={docType === "NIC"}
                  onChange={() => setDocType("NIC")}
                  className="mr-4 w-6 h-6"
                />
                NIC
              </label>
              <label className="flex items-center text-xl">
                <input
                  type="radio"
                  name="docType"
                  value="Driver's License"
                  checked={docType === "Driver's License"}
                  onChange={() => setDocType("Driver's License")}
                  className="mr-4 w-6 h-6"
                />
                Driver's License
              </label>
            </div>
          </div>
          <div className="mb-12 w-full">
            <label className="block text-2xl font-semibold mb-6">Images</label>
            <div className="flex flex-row gap-24 justify-start">
              <div className="flex flex-col items-center">
                <span className="mb-4 text-xl">Front</span>
                <label className="w-40 h-40 bg-gray-100 flex flex-col items-center justify-center rounded-md cursor-pointer hover:bg-gray-200">
                  <span className="text-xl font-medium">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "front")}
                  />
                  {frontImg && (
                    <span className="text-sm mt-2 text-gray-500 text-center">{frontImg.name}</span>
                  )}
                </label>
              </div>
              <div className="flex flex-col items-center">
                <span className="mb-4 text-xl">Back</span>
                <label className="w-40 h-40 bg-gray-100 flex flex-col items-center justify-center rounded-md cursor-pointer hover:bg-gray-200">
                  <span className="text-xl font-medium">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "back")}
                  />
                  {backImg && (
                    <span className="text-sm mt-2 text-gray-500 text-center">{backImg.name}</span>
                  )}
                </label>
              </div>
            </div>
          </div>
          {message && (
            <div className={`mb-8 text-left text-xl w-full ${success ? 'text-green-600' : 'text-red-500'}`}>{message}</div>
          )}
          <div className="flex flex-row gap-6 w-full">
            <button
              type="submit"
              className="mt-8 w-48 h-16 bg-black text-white text-2xl rounded-full hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || success}
            >
              {loading ? "Sending..." : success ? "Sent!" : "Send"}
            </button>
            <button
              type="button"
              className="mt-8 w-48 h-16 bg-gray-200 text-black text-2xl rounded-full hover:bg-gray-300 transition-all border border-gray-400"
              onClick={() => navigate("/user/general")}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 