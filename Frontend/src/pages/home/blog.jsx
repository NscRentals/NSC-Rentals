import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const [current, setCurrent] = useState(0);
  const [hover, setHover] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/blogpost/');
      const data = await response.json();
      if (response.ok) {
        setBlogPosts(data);
      } else {
        setError(data.message || 'Failed to fetch blog posts');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const prevPost = () => {
    setHover(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? blogPosts.length - 1 : prev - 1));
      setHover(false);
    }, 200);
  };

  const nextPost = () => {
    setHover(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === blogPosts.length - 1 ? 0 : prev + 1));
      setHover(false);
    }, 200);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-red-500 text-xl">{error}</div>
    </div>;
  }

  if (blogPosts.length === 0) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">No blog posts available</div>
    </div>;
  }

  const post = blogPosts[current];

  return (
    <>
      <div className="min-h-[120vh] bg-black flex flex-col items-center justify-start pt-20 pb-[300px]">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-16 w-full text-left px-8">Customer Diaries..</h1>
        <p className="text-white text-2xl font-poppins font-normal mb-12 w-full text-left px-8">
          From first impressions to lasting connections,<br />
          thank you for being part of our journey!
        </p>
        <div className="relative w-full flex justify-center items-center mt-8">
          <button
            onClick={prevPost}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-20 w-20 bg-white rounded-full focus:outline-none group shadow-lg"
          >
            <img src="/images/left.png" alt="Left Arrow" className="w-10 h-10" />
          </button>
          <div
            className={`bg-white shadow-lg p-6 w-full flex flex-col items-center transition-all duration-300 ${
              hover ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
            }`}
            style={{ minHeight: '650px' }}
          >
            <div className="w-full max-w-5xl mx-auto">
              <div className="flex items-center mb-4 w-full">
                <img
                  src="/images/user.png"
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-bold text-2xl text-gray-900">{post.name}</div>
                  <div className="text-gray-700 text-xl">{post.caption}</div>
                </div>
              </div>
              <div className="w-full aspect-[16/9] overflow-hidden mt-5">
                <img
                  src={post.image}
                  alt="Blog visual"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-[20px]"
                />
              </div>
            </div>
          </div>
          <button
            onClick={nextPost}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-20 w-20 bg-white rounded-full focus:outline-none group shadow-lg"
          >
            <img src="/images/right.PNG" alt="Right Arrow" className="w-10 h-10" />
          </button>
        </div>
      </div>
      <div className="w-full bg-[#dbdbdb] flex flex-col items-start px-8 py-24 min-h-[260px]">
        <div className="w-full max-w-4xl flex flex-col items-start">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">Have a memorable moment with us?</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-black mb-10">We'd love to hear it!</h3>
          <button
            onClick={() => navigate('/addBlog')}
            className="bg-black text-white text-2xl md:text-3xl rounded-full px-12 py-7 font-normal shadow-lg hover:scale-105 transition-all mt-2"
          >
            Add a memory
          </button>
        </div>
      </div>
    </>
  );
};

export default Blog; 