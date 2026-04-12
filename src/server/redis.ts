import Redis from "ioredis";
import { Queue, Worker, Job } from "bullmq";
import { prisma } from "./db";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Create a singleton Redis connection with fail-fast settings for the preview environment
export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 0, // Fail fast if Redis is not available
  enableOfflineQueue: false,
  lazyConnect: true,
  retryStrategy: (times) => {
    // Only retry 3 times, then stop to avoid flooding logs in environments without Redis
    if (times > 3) return null;
    return Math.min(times * 50, 2000);
  }
});

let isRedisAvailable = false;

redis.on("connect", () => {
  isRedisAvailable = true;
  console.log("🟢 Connected to Redis - Real Queue enabled");
});

redis.on("error", (err) => {
  if (isRedisAvailable) {
    console.warn("⚠️ Redis connection lost:", err.message);
    isRedisAvailable = false;
  }
});

// Real Queue
const realQueue = new Queue("file-processing", { 
  connection: redis,
  defaultJobOptions: { removeOnComplete: true }
});

// Mock Queue for environments without Redis
const mockQueue = {
  add: async (name: string, data: any) => {
    console.log(`[Mock Queue] Adding job: ${name} for file ${data.fileId}`);
    
    // Simulate background processing in-memory
    setTimeout(async () => {
      try {
        console.log(`[Mock Worker] Processing file ${data.fileId}...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await prisma.file.update({
          where: { id: data.fileId },
          data: { status: "COMPLETED" }
        });
        console.log(`[Mock Worker] Completed processing for ${data.fileId}`);
      } catch (err) {
        console.error(`[Mock Worker] Failed to process ${data.fileId}:`, err);
      }
    }, 1000);
    
    return { id: "mock-job-id" };
  }
};

// Exported Queue Service
export const fileProcessingQueue = {
  add: async (name: string, data: any) => {
    if (isRedisAvailable) {
      try {
        return await realQueue.add(name, data);
      } catch (err) {
        console.warn("⚠️ Real Queue failed, falling back to Mock Queue");
        return await mockQueue.add(name, data);
      }
    } else {
      return await mockQueue.add(name, data);
    }
  }
};

// Real Worker
export const fileProcessingWorker = new Worker(
  "file-processing",
  async (job: Job) => {
    console.log(`[Real Worker] Processing job ${job.id} for file ${job.data.fileId}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    await prisma.file.update({
      where: { id: job.data.fileId },
      data: { status: "COMPLETED" }
    });
    
    return { success: true };
  },
  { connection: redis, autorun: false }
);

// Attempt to connect and start real worker if possible
redis.connect().then(() => {
  fileProcessingWorker.run();
}).catch(() => {
  console.log("ℹ️ Redis not found. Using Mock Queue for preview environment.");
});

