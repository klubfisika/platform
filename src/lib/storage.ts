import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  type _Object,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getEnv(key: string): string {
  if (typeof process !== "undefined" && process.env[key]) return process.env[key] as string;
  if (typeof import.meta !== "undefined" && (import.meta as any).env?.[key])
    return (import.meta as any).env[key] as string;
  return "";
}

let clientInstance: S3Client | null = null;

function getClient(): S3Client {
  if (!clientInstance) {
    clientInstance = new S3Client({
      endpoint: getEnv("STORAGE_ENDPOINT") || "http://localhost:9005",
      region: getEnv("STORAGE_REGION") || "us-east-1",
      credentials: {
        accessKeyId: getEnv("STORAGE_ACCESS_KEY"),
        secretAccessKey: getEnv("STORAGE_SECRET_KEY"),
      },
      forcePathStyle: true,
    });
  }
  return clientInstance;
}

function getBucket(): string {
  return getEnv("STORAGE_BUCKET") || "kf13-assets";
}

export interface UploadResult {
  key: string;
  url: string;
}

export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string,
): Promise<UploadResult> {
  const client = getClient();
  const bucket = getBucket();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  const publicUrl = getEnv("STORAGE_PUBLIC_URL") || `${getEnv("STORAGE_ENDPOINT")}/${bucket}`;

  return {
    key,
    url: `${publicUrl}/${key}`,
  };
}

export async function getFileUrl(key: string, expiresIn = 3600): Promise<string> {
  const client = getClient();
  const bucket = getBucket();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn });
}

export interface PresignedUpload {
  url: string;
  key: string;
  publicUrl: string;
}

export async function getUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 300,
): Promise<PresignedUpload> {
  const client = getClient();
  const bucket = getBucket();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(client, command, { expiresIn });

  const publicUrl =
    getEnv("STORAGE_PUBLIC_URL") ||
    `${getEnv("STORAGE_ENDPOINT")}/${bucket}`;

  return {
    url,
    key,
    publicUrl: `${publicUrl}/${key}`,
  };
}

export async function deleteFile(key: string): Promise<void> {
  const client = getClient();
  const bucket = getBucket();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export async function listFiles(prefix?: string): Promise<_Object[]> {
  const client = getClient();
  const bucket = getBucket();

  const result = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    }),
  );

  return result.Contents || [];
}

export function generateFileKey(
  userId: string,
  category: string,
  filename: string,
): string {
  const timestamp = Date.now();
  const ext = filename.split(".").pop() || "bin";
  const sanitized = filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .toLowerCase();
  return `${category}/${userId}/${timestamp}-${sanitized}.${ext}`;
}
