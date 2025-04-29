import React, { useEffect, useState } from "react";

const ShowingBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchVerifiedBlogs();
  }, []);

  const fetchVerifiedBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/blogpost/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        // Only show verified blogs
        setBlogs(data.filter((b) => b.isVerified));
      } else {
        setError(data.message || "Failed to fetch blogs");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/blogpost/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBlogs(blogs.filter((b) => b._id !== id));
        setToast("Blog post deleted!");
        setTimeout(() => setToast(""), 2500);
      } else {
        setError(data.message || "Delete failed");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red", padding: 20 }}>Error: {error}</div>;
  if (blogs.length === 0) return <div style={{ padding: 20 }}>No verified blog posts found.</div>;

  return (
    <div style={{ padding: "0 4vw" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: 32 }}>Verified Blog Posts</h2>
      {blogs.map((post) => (
        <div
          key={post._id}
          style={{
            background: "#dedede",
            borderRadius: 24,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "40px 60px 32px 60px",
            margin: "0 auto 36px auto",
            maxWidth: "100%",
            minHeight: "220px",
            boxSizing: "border-box",
            boxShadow: "none",
            position: "relative",
          }}
        >
          <div style={{ flex: "0 0 180px", marginRight: "40px", textAlign: "center" }}>
            {post.image ? (
              <img
                src={post.image.startsWith("http") ? post.image : `http://localhost:4000/uploads/blog_posts/${post.image}`}
                alt="Blog post"
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  background: "#f3f3f3",
                }}
              />
            ) : (
              <div style={{
                width: "180px",
                height: "180px",
                borderRadius: "12px",
                background: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1.1rem"
              }}>
                Image
              </div>
            )}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: 6 }}>Email:</div>
              <div style={{ marginBottom: 12 }}>{post.email}</div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: 6 }}>Caption:</div>
              <div style={{ whiteSpace: "pre-line" }}>{post.caption}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => handleDelete(post._id)}
                style={{
                  padding: "10px 28px",
                  background: "#984848",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          top: 32,
          right: 32,
          background: "#984848",
          color: "#fff",
          padding: "18px 36px",
          borderRadius: 16,
          fontSize: "1.2rem",
          zIndex: 2000,
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
};

export default ShowingBlogs; 