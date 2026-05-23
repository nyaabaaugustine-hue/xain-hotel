import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await api.post("/api/auth/refresh");
        return api(original);
      } catch {
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
