import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/api",
});

// Add a request interceptor to include the token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken"); // Get token from storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
