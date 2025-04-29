import React, { useState } from "react";

const AddBlog = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Replace with your backend endpoint
  const API_URL = "http://localhost:4000/api/blogpost/";

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const token = localStorage.getItem("token"); // Adjust if you store token elsewhere
    if (!image) {
      setMessage("Image is required!");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Blog post submitted successfully!");
        setCaption("");
        setImage(null);
      } else {
        setMessage(data.message || "Submission failed!");
      }
    } catch (err) {
      setMessage("Submission failed!");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "32px 0 32px 64px" }}>
      <div style={{ width: '100%', display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 0, textAlign: "left", width: "100%" }}>Join the Conversation</h1>
        <h2 style={{ fontSize: 36, fontWeight: 400, marginTop: 12, marginBottom: 40, textAlign: "left", width: "100%" }}>
          Share Your Experience with Us!
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 36, width: "100%" }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: 0 }}>
            <label style={{ fontSize: 22, color: '#aaa', marginBottom: 10, display: 'block', textAlign: 'left', width: 400 }}>Image</label>
            <div
              style={{
                width: 400,
                height: 220,
                background: "#ddd",
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                position: "relative",
              }}
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 24 }}
                />
              ) : (
                <svg width="90" height="90" fill="#ccc" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="4" fill="#eee" />
                  <path d="M8 15l3-3 4 4" stroke="#ccc" strokeWidth="2" fill="none" />
                  <circle cx="9" cy="9" r="2" fill="#ccc" />
                </svg>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          </div>
          <div style={{ width: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: 0 }}>
            <label style={{ fontSize: 22, color: '#aaa', marginBottom: 10, display: 'block', textAlign: 'left', width: 400 }}>caption</label>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', width: 'calc(100% - 100px)' }}>
              <textarea
                value={caption}
                onChange={handleCaptionChange}
                style={{
                  flex: 1,
                  height: 110,
                  background: '#ddd',
                  borderRadius: 24,
                  border: 'none',
                  padding: 20,
                  fontSize: 22,
                  color: '#222',
                  resize: 'none',
                  outline: 'none',
                  marginBottom: 0,
                  marginRight: 16
                }}
                placeholder="Share your thoughts..."
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#1a2d13',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 999,
                  padding: '0 32px',
                  height: 56,
                  minWidth: 80,
                  fontSize: 24,
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  boxShadow: '0 2px 12px rgba(26,45,19,0.15)'
                }}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
          {message && (
            <div style={{ color: message.includes("success") ? "#4caf50" : "#ff5252", fontSize: 20, marginTop: 10, textAlign: "left" }}>{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddBlog; 