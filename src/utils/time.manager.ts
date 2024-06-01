import { TimeValidityResult } from "../interface";
import crypto from "crypto";
import fs from "fs";

class TimeManager {
  static async createExpirationDate(
    timePeriod: number | null,
    timePeriodType: "M" | "H" | "D" | "Y"
  ): Promise<number | undefined> {
    if (!timePeriod || !timePeriodType) return undefined;

    let expireDateMilliseconds: number | undefined;

    switch (timePeriodType) {
      case "M":
        expireDateMilliseconds = timePeriod * 60 * 1000;
        break;
      case "H":
        expireDateMilliseconds = timePeriod * 60 * 60 * 1000;
        break;
      case "D":
        expireDateMilliseconds = timePeriod * 24 * 60 * 60 * 1000;
        break;
      case "Y":
        expireDateMilliseconds = timePeriod * 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        return undefined;
    }

    // Calculate expiration date based on current time and expiration milliseconds
    const currentTime = new Date().getTime();
    const expirationDate = currentTime + expireDateMilliseconds;

    return expirationDate;
  }

  static async checkTimeValidity(
    timePeriod: string
  ): Promise<TimeValidityResult> {
    try {
      const validTimePeriodTypes: string[] = ["M", "H", "D", "Y"];

      if (typeof timePeriod !== "string")
        return {
          isTimeValid: false,
          timePeriodNumber: null,
          timePeriodType: null,
        };

      const splitString = timePeriod.split(/(\d+)/);

      if (!splitString || splitString.length !== 3)
        return {
          isTimeValid: false,
          timePeriodNumber: null,
          timePeriodType: null,
        };

      const timePeriodNumber = parseFloat(splitString[1]);
      const timePeriodString = splitString[2] as "M" | "H" | "D" | "Y";

      if (!timePeriodString || !validTimePeriodTypes.includes(timePeriodString))
        return {
          isTimeValid: false,
          timePeriodNumber: null,
          timePeriodType: null,
        };

      return {
        isTimeValid: true,
        timePeriodNumber: timePeriodNumber,
        timePeriodType: timePeriodString,
      };
    } catch (error) {
      console.log(
        `Error: src > utils > time.manager.ts > TimeManager > checkTimeValidity : ${error.message}`
      );
      return {
        isTimeValid: false,
        timePeriodNumber: null,
        timePeriodType: null,
      };
    }
  }

  static async generateRandomSecretKey(
    securityLevel: 1 | 2 | 3
  ): Promise<string> {
    try {
      // Determine the length of the generated key based on the specified level
      const checkLevel =
        securityLevel === 1 ? 16 : securityLevel === 2 ? 32 : 64;

      // Generate random bytes and convert them to hexadecimal format
      return crypto.randomBytes(checkLevel).toString("hex");
    } catch (error) {
      console.log(
        `Error: src > utils > time.manager.ts > TimeManager > generateRandomSecretKey : ${error.message}`
      );
      return "";
    }
  }

  static async generateAccessPublicAndPrivateKey(
    secretKeyName: string
  ): Promise<void> {
    try {
      const keyPair = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      // Write public key to a .pem file
      fs.writeFileSync(
        __dirname + "/AccessTokenPublicKey.pem",
        keyPair.publicKey
      );

      // Write private key to a .pem file
      fs.writeFileSync(
        __dirname + "/AccessTokenPrivateKey.pem",
        keyPair.privateKey
      );
    } catch (error) {
      console.log(
        `Error: src > utils > time.manager.ts > TimeManager > generateAccessPublicAndPrivateKey : ${error.message}`
      );
    }
  }
}

export default TimeManager;
