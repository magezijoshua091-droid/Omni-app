import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, AuthRequest } from "../auth";
import { fileProcessingQueue } from "../redis";

const router = Router();

router.post("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { action } = req.body; // e.g., "compress", "convert"
    const fileId = req.params.id;

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== req.user!.id) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    // Update status to processing
    await prisma.file.update({
      where: { id: fileId },
      data: { status: "PROCESSING" },
    });

    // Add to BullMQ
    await fileProcessingQueue.add("process-file", {
      fileId,
      userId: req.user!.id,
      action,
      fileUrl: file.url,
    });

    res.json({ message: "File processing started", status: "PROCESSING" });
  } catch (error) {
    console.error("Process error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
