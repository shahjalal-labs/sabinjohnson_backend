import express, { Application } from "express";
import httpStatus from "http-status";
import cors from "cors";
import router from "./app/routes";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import path from "path";
import prisma from "./shared/prisma";
import { bullBoardRouter } from "./bullBoard";
import basicAuth from "express-basic-auth";
import client from "prom-client";
import { paypalWebhookService } from "./app/modules/ridesharing/ridesharing.service";

const app: Application = express();

// collect default metrics (CPU, memory, event loop)
client.collectDefaultMetrics();
const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
  aggregator: "sum",
  registers: [client.register],
});

// Middleware setup
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("Failed to connect to services:", error);
    process.exit(1);
  }
})();

app.use(cors());

app.post(
  "/api/v1/paypal-payment/webhook",
  express.json({ type: "*/*" }),
  paypalWebhookService,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use((req, res, next) => {
  res.on("finish", () => {
    requestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
  });
  next();
});

// prometheus endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Route handler for root endpoint
app.get("/", (req, res) => {
  res.send({
    Message: "Welcome to Sabin Johnson API",
  });
});
// Route handler for version-1 endpoint
app.get("/api/v1", (req, res) => {
  res.send({
    Message: "Welcome to Sabin Johnson API - Version 1",
  });
});

// Router setup
app.use("/api/v1", router);
app.use(
  "/admin/queues",
  basicAuth({
    users: { admin: process.env.BULLBOARD_PASSWORD || "supersecret" },
    challenge: true,
  }),
  bullBoardRouter,
);

app.get("/api/v1/paypal-payment/success", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "payment-success.html"));
});
app.get("/api/v1/paypal-payment/cancel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "payment-cancel.html"));
});

// Global Error Handler
app.use(GlobalErrorHandler);

// API Not found handler
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
