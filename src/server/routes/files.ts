import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, AuthRequest } from "../auth";
import { generateUploadUrl, generateDownloadUrl } from "../s3";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(files);
  } catch (error) {
    console.warn("⚠️ Database connection failed while fetching files, using mock data for demo");
    
    // Fallback mock data for demo purposes
    if (req.user?.email === "demo@omni.ai" || req.user?.id === "demo-user-uuid-1234-5678") {
      const mockFiles = [
        {
          id: "mock-file-1",
          name: "Project_Proposal.pdf",
          type: "application/pdf",
          size: 2400000,
          status: "COMPLETED",
          createdAt: new Date().toISOString(),
          url: "#",
          metadata: { savings: 35, action: "compress" }
        },
        {
          id: "mock-file-2",
          name: "Product_Shot.jpg",
          type: "image/jpeg",
          size: 5600000,
          status: "COMPLETED",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          url: "#",
          metadata: { savings: 62, action: "convert" }
        },
        {
          id: "mock-file-3",
          name: "Quarterly_Report.docx",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 1200000,
          status: "UPLOADED",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          url: "#"
        }
      ];
      res.json(mockFiles);
      return;
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/upload-url", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, type, size } = req.body;
    
    // 1. Check plan limits
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { files: true, subscription: true }
    });

    const fileCount = user?.files.length || 0;
    const totalSize = user?.files.reduce((acc, f) => acc + f.size, 0) || 0;
    const plan = user?.subscription?.plan || "FREE";

    const limits = {
      FREE: { maxFiles: 5, maxSize: 50 * 1024 * 1024 }, // 5 files, 50MB total
      PRO: { maxFiles: 100, maxSize: 5 * 1024 * 1024 * 1024 }, // 100 files, 5GB total
      BUSINESS: { maxFiles: 1000, maxSize: 50 * 1024 * 1024 * 1024 }, // 1000 files, 50GB total
    };

    const currentLimits = limits[plan as keyof typeof limits];

    if (fileCount >= currentLimits.maxFiles) {
      res.status(403).json({ error: `Plan limit reached: Max ${currentLimits.maxFiles} files allowed on ${plan} plan.` });
      return;
    }

    if (totalSize + size > currentLimits.maxSize) {
      res.status(403).json({ error: `Plan limit reached: Max storage exceeded on ${plan} plan.` });
      return;
    }

    // 2. Create DB record
    const file = await prisma.file.create({
      data: {
        userId: req.user!.id,
        name,
        type,
        size,
        url: "", // Will be updated after upload
        status: "UPLOADED",
      },
    });

    const key = `uploads/${req.user!.id}/${file.id}-${name}`;
    const uploadUrl = await generateUploadUrl(key, type);

    // Update file with the S3 key/url
    await prisma.file.update({
      where: { id: file.id },
      data: { url: key },
    });

    res.json({ uploadUrl, file });
  } catch (error) {
    console.error("Upload URL error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/download", requireAuth, async (req: AuthRequest, res) => {
  try {
    const file = await prisma.file.findUnique({
      where: { id: req.params.id },
    });

    if (!file || file.userId !== req.user!.id) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const downloadUrl = await generateDownloadUrl(file.url);
    res.json({ downloadUrl });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/analyze", requireAuth, async (req: AuthRequest, res) => {
  try {
    const file = await prisma.file.findUnique({
      where: { id: req.params.id },
    });

    if (!file || file.userId !== req.user!.id) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    // Simple rule-based suggestions as fallback for backend
    const suggestions = [];
    if (file.type.startsWith("image/")) {
      suggestions.push({ action: "compress", label: "Compress (Save ~40%)" });
      suggestions.push({ action: "convert", label: "Convert to WebP" });
    } else if (file.type === "application/pdf") {
      suggestions.push({ action: "compress", label: "Compress PDF" });
    } else {
      suggestions.push({ action: "analyze", label: "Analyze Content" });
    }
    
    res.json({ suggestions });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
