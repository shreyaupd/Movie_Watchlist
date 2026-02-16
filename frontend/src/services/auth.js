import { api } from "../utils/axios";
export const loginUser = (email, password) =>
    api.post("/auth/login", { email, name, password });

export const registerUser = (name, email, password) =>
    api.post("/auth/register", { name, email, password });

export const logoutUser = () =>
    api.post("/auth/logout");
//this auth.js file is responsible for making API calls related to authentication, such as login, registration, and logout. It uses the axios instance defined in utils/axios.js to send HTTP requests to the backend server. Each function corresponds to a specific authentication action and returns the response from the server.