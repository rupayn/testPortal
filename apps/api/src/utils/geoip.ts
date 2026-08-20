import fs from "fs";
import path from "path";
import { r2Client } from "../config/r2";
import { envs } from "../config/dotenv";
import { logger } from "@repo/logger/config";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const FILE_NAME = "GeoLite2-City.mmdb";
const DATA_DIR =
  envs.NODE_ENV === "production"
    ? path.resolve(process.cwd(), "data/geoip")
    : path.resolve(process.cwd(), "src/data");

const DATABASE_PATH = path.join(DATA_DIR, FILE_NAME);
const TEMP_DATABASE_PATH = `${DATABASE_PATH}.tmp`;
export async function ensureGeoLiteDatabase() {
  if (fs.existsSync(DATABASE_PATH)) {
    logger.info(`GeoLite database already exists at ${DATABASE_PATH}`);
    return DATABASE_PATH;
  }
  logger.info("Downloading from r2");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {
      recursive: true,
    });
  }
  const response = await r2Client.send(
    new GetObjectCommand({
      Bucket: envs.CLOUDFLARE_S3_R2_BUCKET,
      Key: envs.R2_GEOIP_OBJECT_KEY,
    })
  );
  logger.info("Downloading from r2 complete");
  if (response.Body === undefined) {
    throw new Error("GeoLite2-City.mmdb download returned empty body");
  }
  if (!(response.Body instanceof Readable)) {
    throw new Error("Expected a Node.js Readable stream from R2 response body");
  }
  const body = response.Body as Readable;
  try {
    const writeStream = fs.createWriteStream(TEMP_DATABASE_PATH);

    await new Promise<void>((resolve, reject) => {
      body.pipe(writeStream);
      body.on("error", reject);
      writeStream.on("error", reject);
      writeStream.on("finish", resolve);
    });

    // atomic swap: only now does the "real" file appear
    await fs.promises.rename(TEMP_DATABASE_PATH, DATABASE_PATH);

    logger.info(`GeoLite database saved to ${DATABASE_PATH}`);
    return DATABASE_PATH;
  } catch (err) {
    // clean up partial download so it doesn't get mistaken for a valid file next run
    await fs.promises.rm(TEMP_DATABASE_PATH, { force: true });
    logger.error("Failed to download GeoLite database", err);
    throw err;
  }

}
