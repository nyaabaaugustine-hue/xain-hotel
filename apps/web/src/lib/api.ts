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
    const isAuthEndpoint =
      original.url?.includes('/auth/refresh') ||
      original.url?.includes('/auth/login') ||
      original.url?.includes('/auth/me');

    // Only attempt silent token refresh for 401s on non-auth endpoints
    if (err.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        await api.post("/api/auth/refresh");
        return api(original);
      } catch {
        // Refresh also failed — clear local cache and redirect
        try { localStorage.removeItem("xain_user"); } catch {}
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    // Never redirect on network errors (no response) — API might just be cold-starting
    return Promise.reject(err);
  }
);

export default api;
