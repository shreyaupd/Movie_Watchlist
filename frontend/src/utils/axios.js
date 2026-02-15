import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5001",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
