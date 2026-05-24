import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { config } from "./config/env";
import { errorHandler } from "./middleware/error";

import authRoutes from "./modules/auth/auth.routes";
import roomsRoutes from "./modules/rooms/rooms.routes";
import reservationsRoutes from "./modules/reservations/reservations.routes";
import customersRoutes from "./modules/customers/customers.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import publicRoutes from "./modules/public/public.routes";

const app: Application = express() as Application;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: [
      config.frontendUrl,
      "http://localhost:3000",
      /\.vercel\.app$/,        // allow all vercel preview URLs
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(compression() as any);
app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    ts: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

app.get("/", (_req, res) => {
  res.json({ service: "Xain Hotel API", status: "running" });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/public", publicRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Local dev server (skipped on Vercel) ──────────────────────────────────────
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const port = config.port || 4000;
  app.listen(port, () => {
    console.log(`\n🏨  Xain Hotel API  →  http://localhost:${port}`);
    console.log(`   Env:      ${config.nodeEnv}`);
    console.log(`   Frontend: ${config.frontendUrl}\n`);
  });
}

// ── Vercel serverless export ───────────────────────────────────────────────────
export default app;
