import { S3Client } from "@aws-sdk/client-s3";
import { envs } from "./dotenv";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${envs.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, 
  credentials: {
    accessKeyId: envs.CLOUDFLARE_S3_ACCESS_KEY_ID,
    secretAccessKey: envs.CLOUDFLARE_S3_SECRET_ACCESS_KEY,
  },
});

export const GEOIP_BUCKET = envs.CLOUDFLARE_S3_R2_BUCKET;
