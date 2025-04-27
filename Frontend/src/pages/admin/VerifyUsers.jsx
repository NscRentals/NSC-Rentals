import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const VerifyUsers = () => {
  const [forms, setForms] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/forms", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForms(response.data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    fetchForms();
  }, []);

  const handleApprove = async (email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:4000/api/forms", 
        { email }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForms(forms.filter(form => form.email !== email));
      toast.success("User verified!");
    } catch (error) {
      console.error("Error approving form:", error);
    }
  };

  const handleReject = async (email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:4000/api/forms/reject", 
        { email }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForms(forms.filter(form => form.email !== email));
    } catch (error) {
      console.error("Error rejecting form:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-8">User Verification Requests</h2>
      <div className="space-y-8">
        {forms.map(form => (
          <div key={form._id} className="bg-[#F6F6F6] rounded-3xl p-10 flex flex-col gap-6 shadow-sm">
            <div className="flex flex-row items-start">
              <div className="flex flex-col gap-2 min-w-[220px]">
                <span className="font-bold">User ID :</span>
                <span className="mb-2">{form._id}</span>
                <span className="font-bold">Name :</span>
                <span className="mb-2">{form.fullName}</span>
                <span className="font-bold">Email :</span>
                <span className="mb-2">{form.email}</span>
                <span className="font-bold">Address :</span>
                <span className="mb-2">{form.address}</span>
              </div>
              <div className="flex flex-row gap-3 ml-auto">
                <div className="flex flex-col gap-2 min-w-[180px]">
                  <span className="font-bold">Image</span>
                  <img 
                    src={`http://localhost:4000/uploads/identity_forms/${form.img1}`} 
                    alt="Front" 
                    className="w-32 h-32 object-contain border rounded-xl bg-white cursor-pointer"
                    onClick={() => setPreviewImg(`http://localhost:4000/uploads/identity_forms/${form.img1}`)}
                  />
                </div>
                <div className="flex flex-col gap-2 min-w-[180px]">
                  <span className="font-bold">Image</span>
                  <img 
                    src={`http://localhost:4000/uploads/identity_forms/${form.img2}`} 
                    alt="Back" 
                    className="w-32 h-32 object-contain border rounded-xl bg-white cursor-pointer"
                    onClick={() => setPreviewImg(`http://localhost:4000/uploads/identity_forms/${form.img2}`)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-2 justify-end">
              <button
                onClick={() => handleReject(form.email)}
                className="px-10 py-3 bg-[#B94A48] text-white rounded-full text-lg font-semibold shadow-sm hover:bg-[#a03d3a]"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(form.email)}
                className="px-10 py-3 bg-[#4A7B3F] text-white rounded-full text-lg font-semibold shadow-sm hover:bg-[#38622e]"
              >
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Image Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setPreviewImg(null)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={previewImg} alt="Preview" className="max-w-[90vw] max-h-[80vh] rounded shadow-lg" />
            <button onClick={() => setPreviewImg(null)} className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-black font-bold text-lg shadow">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyUsers; 