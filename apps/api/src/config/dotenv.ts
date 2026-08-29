interface Env {
  PORT: number;
  NODE_ENV: string;
  CLOUDFLARE_S3_TOKEN: string;
  CLOUDFLARE_S3_ACCESS_KEY_ID: string;
  CLOUDFLARE_S3_SECRET_ACCESS_KEY: string;
  CLOUDFLARE_S3_R2_BUCKET: string;
  CLOUDFLARE_R2_ACCOUNT_ID: string;
  R2_GEOIP_OBJECT_KEY: string;
}
export const envs: Env = {
  PORT: Number(process.env.PORT ?? "3001"),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  CLOUDFLARE_R2_ACCOUNT_ID: process.env.CLOUDFLARE_R2_ACCOUNT_ID ?? "",
  CLOUDFLARE_S3_TOKEN: process.env.CLOUDFLARE_S3_TOKEN ?? "",
  CLOUDFLARE_S3_ACCESS_KEY_ID: process.env.CLOUDFLARE_S3_ACCESS_KEY_ID ?? "",
  CLOUDFLARE_S3_R2_BUCKET: process.env.CLOUDFLARE_S3_R2_BUCKET ?? "",
  CLOUDFLARE_S3_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_S3_SECRET_ACCESS_KEY ?? "",
  R2_GEOIP_OBJECT_KEY: process.env.R2_GEOIP_OBJECT_KEY ?? "GeoLite2-City.mmdb",
};
