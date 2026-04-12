import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { generateToken, requireAuth, AuthRequest } from "../auth";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
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
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        // Create demo user if it doesn't exist
        const hashedPassword = await bcrypt.hash("demo123", 10);
        user = await prisma.user.create({
          data: {
            email: "demo@omni.ai",
            password: hashedPassword,
            role: "PRO", // Give demo user PRO access
          },
        });
      }
      const token = generateToken(user);
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
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
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, role: true, subscription: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
