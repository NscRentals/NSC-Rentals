import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShowingBlogs from "./showingBlogs";

const BlogVerify = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("incoming");
  const [zoomedImage, setZoomedImage] = useState(null);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching blog posts...");
      const response = await fetch("http://localhost:4000/api/blogpost/unverified", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Received data:", data);

      if (response.ok) {
        if (Array.isArray(data)) {
          setBlogPosts(data);
        } else {
          console.error("Received data is not an array:", data);
          setError("Invalid data format received from server");
        }
      } else {
        console.error("Failed to fetch blog posts:", data.message);
        setError(data.message || "Failed to fetch blog posts");
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (postId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/blogpost/verify/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (response.ok) {
        setBlogPosts(blogPosts.filter(post => post._id !== postId));
        if (status === "approved") {
          setToast("Post verified!");
          setTimeout(() => setToast(""), 2500);
        }
      } else {
        setError(data.message || "Failed to verify blog post");
      }
    } catch (error) {
      setError("Error connecting to server");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;
  }

  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "2.8rem", fontWeight: "bold", letterSpacing: "-1px" }}>Blog Posts</h1>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "32px" }}>
        <button
          onClick={() => setActiveTab("incoming")}
          style={{
            fontSize: "1.2rem",
            fontWeight: activeTab === "incoming" ? "bold" : "normal",
            background: activeTab === "incoming" ? "#dedede" : "transparent",
            border: "none",
            borderRadius: "8px 8px 0 0",
            padding: "8px 24px",
            marginRight: "8px",
            cursor: "pointer",
            boxShadow: activeTab === "incoming" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
          }}
        >
          Incoming
        </button>
        <span style={{ borderLeft: "2px solid #dedede", height: "32px", margin: "0 8px" }}></span>
        <button
          onClick={() => setActiveTab("viewing")}
          style={{
            fontSize: "1.2rem",
            fontWeight: activeTab === "viewing" ? "bold" : "normal",
            background: activeTab === "viewing" ? "#dedede" : "transparent",
            border: "none",
            borderRadius: "8px 8px 0 0",
            padding: "8px 24px",
            cursor: "pointer",
            boxShadow: activeTab === "viewing" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
          }}
        >
          Viewing
        </button>
      </div>
      {activeTab === "incoming" ? (
        blogPosts.length === 0 ? (
          <div style={{ padding: "20px", background: "#f5f5f5", borderRadius: "16px" }}>
            <p>No unverified blog posts found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {blogPosts.map((post) => (
              <div
                key={post._id}
                style={{
                  background: "#dedede",
                  borderRadius: "24px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "56px calc(8vw + 100px) 44px calc(8vw + 100px)",
                  margin: "0 auto 48px auto",
                  maxWidth: "100%",
                  minHeight: "340px",
                  boxSizing: "border-box",
                  boxShadow: "none",
                  position: "relative",
                }}
              >
                {/* Image Section */}
                <div style={{ flex: "0 0 260px", marginRight: "56px", textAlign: "center" }}>
                  {post.image ? (
                    <img
                      src={post.image}
                      alt="Blog post"
                      style={{
                        width: "260px",
                        height: "260px",
                        objectFit: "cover",
                        borderRadius: "16px",
                        background: "#f3f3f3",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                      }}
                      onClick={() => setZoomedImage(post.image)}
                    />
                  ) : (
                    <div style={{
                      width: "260px",
                      height: "260px",
                      borderRadius: "16px",
                      background: "#e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "1.3rem"
                    }}>
                      Image
                    </div>
                  )}
                </div>
                {/* Details Section */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ marginBottom: "32px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "1.3rem", marginBottom: "10px" }}>Email:</div>
                    <div style={{ marginBottom: "22px", fontSize: "1.1rem" }}>{post.email}</div>
                    <div style={{ fontWeight: "bold", fontSize: "1.3rem", marginBottom: "10px" }}>Caption:</div>
                    <div style={{ whiteSpace: "pre-line", fontSize: "1.1rem" }}>{post.caption}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "24px" }}>
                    <button
                      onClick={() => handleVerify(post._id, "rejected")}
                      style={{
                        padding: "16px 40px",
                        background: "#984848",
                        color: "white",
                        border: "none",
                        borderRadius: "28px",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerify(post._id, "approved")}
                      style={{
                        padding: "16px 40px",
                        background: "#395B36",
                        color: "white",
                        border: "none",
                        borderRadius: "28px",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <ShowingBlogs />
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setZoomedImage(null)}
        >
          <div
            style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={zoomedImage}
              alt="Zoomed Blog"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: "16px",
                boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
              }}
            />
            <button
              onClick={() => setZoomedImage(null)}
              style={{
                position: "absolute",
                top: "-32px",
                right: 0,
                background: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                fontSize: "1.5rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          top: 32,
          right: 32,
          background: "#395B36",
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

export default BlogVerify; 