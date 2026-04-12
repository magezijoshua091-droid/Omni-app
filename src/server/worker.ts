import { Worker, Job } from "bullmq";
import { prisma } from "./db";
import { downloadFile, uploadFile } from "./s3";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { redis } from "./redis";

export const fileProcessingWorker = new Worker(
  "file-processing",
  async (job: Job) => {
    const { fileId, action } = job.data;
    console.log(`[Worker] Processing job ${job.id} for file ${fileId} with action ${action}`);

    try {
      // 1. Get file metadata
      const file = await prisma.file.findUnique({ where: { id: fileId } });
      if (!file) throw new Error("File not found");

      await prisma.file.update({
        where: { id: fileId },
        data: { status: "PROCESSING" }
      });

      // 2. Download from S3
      const buffer = await downloadFile(file.url);
      let processedBuffer: Buffer;
      let newKey = file.url;
      let newType = file.type;

      // 3. Process based on action
      if (action === "compress") {
        if (file.type.startsWith("image/")) {
          processedBuffer = await sharp(buffer)
            .jpeg({ quality: 60 })
            .toBuffer();
          newType = "image/jpeg";
          newKey = file.url.replace(/\.[^.]+$/, "") + "-compressed.jpg";
        } else if (file.type === "application/pdf") {
          // Basic PDF compression (re-saving often reduces size slightly)
          const pdfDoc = await PDFDocument.load(buffer);
          const compressedPdfBytes = await pdfDoc.save();
          processedBuffer = Buffer.from(compressedPdfBytes);
          newKey = file.url.replace(".pdf", "-compressed.pdf");
        } else {
          throw new Error("Compression not supported for this file type");
        }
      } else if (action === "convert") {
        if (file.type.startsWith("image/")) {
          processedBuffer = await sharp(buffer)
            .webp()
            .toBuffer();
          newType = "image/webp";
          newKey = file.url.replace(/\.[^.]+$/, "") + ".webp";
        } else {
          throw new Error("Conversion not supported for this file type");
        }
      } else {
        throw new Error("Unknown action");
      }

      // 4. Upload back to S3
      await uploadFile(newKey, processedBuffer!, newType);

      // 5. Update DB
      await prisma.file.update({
        where: { id: fileId },
        data: {
          status: "COMPLETED",
          url: newKey,
          type: newType,
          size: processedBuffer!.length,
          metadata: {
            originalSize: file.size,
            processedSize: processedBuffer!.length,
            savings: Math.round(((file.size - processedBuffer!.length) / file.size) * 100),
            action
          }
        }
      });

      console.log(`[Worker] Successfully processed ${fileId}`);
      return { success: true };
    } catch (err: any) {
      console.error(`[Worker] Failed to process ${fileId}:`, err);
      await prisma.file.update({
        where: { id: fileId },
        data: { status: "FAILED" }
      });
      throw err;
    }
  },
  { connection: redis, autorun: false }
);
