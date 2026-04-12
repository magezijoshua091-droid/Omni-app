import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import path from "path";

// Import modular routers
import authRouter from "./src/server/routes/auth";
import fileRouter from "./src/server/routes/files";
import billingRouter from "./src/server/routes/billing";
import processRouter from "./src/server/routes/process";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  
  // Stripe webhooks need raw body, so we conditionally parse JSON
  app.use((req, res, next) => {
    if (req.originalUrl === "/api/billing/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  // --- API ROUTES ---
  
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "Omni API is running",
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Mount modular routers
  app.use("/api/auth", authRouter);
  app.use("/api/files", fileRouter);
  app.use("/api/billing", billingRouter);
  app.use("/api/process", processRouter);

  // --- VITE MIDDLEWARE (FRONTEND) ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Omni Server running on http://localhost:${PORT}`);
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || "development"}`);
    
    // Check for critical infrastructure environment variables
    if (!process.env.DATABASE_URL) console.warn("⚠️  DATABASE_URL is missing. DB operations will fail.");
    if (!process.env.REDIS_URL) console.warn("⚠️  REDIS_URL is missing. Queue processing will fail.");
    if (!process.env.AWS_ACCESS_KEY_ID) console.warn("⚠️  AWS credentials missing. S3 uploads will fail.");
  });
}

startServer().catch(console.error);
