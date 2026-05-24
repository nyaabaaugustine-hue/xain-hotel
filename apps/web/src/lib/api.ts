import axios from "axios";

// CRITICAL: On Vercel production the frontend uses rewrites (/api/* → backend).
// Cookies only work when requests are same-domain, so we must use relative URLs
// in production (empty baseURL). localhost dev hits the API directly on port 4000.
const isLocalDev =
  typeof window !== "undefined" && window.location.hostname === "localhost";

const baseURL = isLocalDev
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000")
  : ""; // relative — Vercel rewrites proxy /api/* to the backend

const api = axios.create({
  baseURL,
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
