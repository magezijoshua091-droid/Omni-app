import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || "us-east-1";
const bucket = process.env.AWS_BUCKET_NAME || "omni-file-uploads";

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummy-key",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "dummy-secret",
  },
});

export async function generateUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  
  // URL expires in 15 minutes
  return getSignedUrl(s3Client, command, { expiresIn: 900 });
}

export async function generateDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  
  // URL expires in 1 hour
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
