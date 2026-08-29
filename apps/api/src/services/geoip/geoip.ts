import { Reader, AddressNotFoundError } from "@maxmind/geoip2-node";
import { logger } from "@repo/logger/config";
import fs from "node:fs";

type GeoIpReader = Awaited<ReturnType<typeof Reader.open>>;

let lookup: GeoIpReader | undefined;

export function initializeGeoIp(databasePath: string): void {
  if (lookup !== undefined) {
    logger.info("GeoIP reader is already initialized");
    return;
  }

  const dbBuffer = fs.readFileSync(databasePath);

  lookup = Reader.openBuffer(dbBuffer);

  logger.info("GeoIP reader initialized");
}

export function getAddressFromIp(ipAddress: string) {
  if (lookup === undefined) {
    throw new Error("GeoIP reader has not been initialized");
  }

  try {
    return lookup.city(ipAddress);
  } catch (error) {
    if (error instanceof AddressNotFoundError) {
      logger.warn(`Could not find address for IP ${ipAddress}`);
      return null;
    }

    throw error;
  }
}
