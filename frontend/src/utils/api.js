import axios from "axios";

const API = axios.create({
    baseURL: "https://job-portal-backend-gamma-two.vercel.app/api",
})

//attach token automatically
API.interceptors.request.use((req) => {
    const rawUser = localStorage.getItem("jobportal_user");
    let user = null;

    if (rawUser) {
        try {
            user = JSON.parse(rawUser);
        } catch (error) {
            console.warn("Failed to parse stored user data, clearing invalid localStorage entry:", error);
            localStorage.removeItem("jobportal_user");
        }
    }

    if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }

    return req;
});

export default API;
