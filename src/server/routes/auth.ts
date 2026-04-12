import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma, isDbConfigured } from "../db";
import { generateToken, requireAuth, AuthRequest } from "../auth";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    if (!isDbConfigured) {
      res.status(503).json({ error: "Database not configured. Please use Demo Account." });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Special case for Demo Login
    if (email === "demo@omni.ai" && password === "demo123") {
      let user: any = null;
      
      if (isDbConfigured) {
        try {
          user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            const hashedPassword = await bcrypt.hash("demo123", 10);
            user = await prisma.user.create({
              data: {
                email: "demo@omni.ai",
                password: hashedPassword,
                role: "PRO",
              },
            });
          }
        } catch (dbError) {
          // Silent fallback if DB is configured but unreachable
        }
      }
      
      if (!user) {
        // Fallback to a hardcoded mock user so the demo ALWAYS works
        user = {
          id: "demo-user-uuid-1234-5678",
          email: "demo@omni.ai",
          role: "PRO"
        };
      }
      
      const token = generateToken(user);
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
      return;
    }

    if (!isDbConfigured) {
      res.status(503).json({ error: "Database not configured. Please use Demo Account." });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  // Silent fallback for demo user when DB is not configured
  if (!isDbConfigured && (req.user?.email === "demo@omni.ai" || req.user?.id === "demo-user-uuid-1234-5678")) {
    res.json({
      id: req.user?.id || "demo-user-uuid-1234-5678",
      email: "demo@omni.ai",
      role: "PRO",
      subscription: { plan: "PRO", status: "active" }
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, role: true, subscription: true }
    });
    res.json(user);
  } catch (error) {
    // Fallback for demo user if DB is configured but unreachable
    if (req.user?.email === "demo@omni.ai" || req.user?.id === "demo-user-uuid-1234-5678") {
      res.json({
        id: req.user?.id || "demo-user-uuid-1234-5678",
        email: "demo@omni.ai",
        role: "PRO",
        subscription: { plan: "PRO", status: "active" }
      });
      return;
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
