import express from "express";
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

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(compression());
app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true });
app.use(limiter);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404
app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// Error handler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`\n??  Xain-Hotel API running on http://localhost:${config.port}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Frontend:    ${config.frontendUrl}\n`);
});

export default app;
