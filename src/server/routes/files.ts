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
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/upload-url", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, type, size } = req.body;
    
    // Create DB record first
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

export default router;
