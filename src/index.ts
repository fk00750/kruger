import { GenerateTokenParams } from "./types";
import TimeManager from "./utils/time.manager";
import crypto from "crypto";

/**
 * 
 * Function lacks ending return statement and return type does not include 'undefined'.ts(2366)
interface Promise<T>
 */
async function generateToken({
  _id,
  _secretKey,
  _secretKeyValue,
  _randomSecretKey = false,
  _randomSecretKeyLevel = 1,
  _expirationTime,
}: GenerateTokenParams): Promise<{ token: string; privateKey: string } | null> {
  try {
    if (!_id || !_expirationTime) return null;

    let privateKey: string | null = null;
    let expirationDate: number | null | undefined = null;

    if (_expirationTime === null && _expirationTime === undefined) return null;

    // check if the provided _expirationTime is validit
    const { isTimeValid, timePeriodNumber, timePeriodType } =
      await TimeManager.checkTimeValidity(_expirationTime);

    if (!isTimeValid || timePeriodNumber === null || timePeriodType === null)
      return null;

    expirationDate = await TimeManager.createExpirationDate(
      timePeriodNumber,
      timePeriodType
    );

    if (_secretKey && _secretKeyValue && typeof _secretKeyValue === "string")
      privateKey =
        (_secretKeyValue as unknown as string)?.length > 0
          ? _secretKeyValue
          : null;
    else if (_randomSecretKey && _randomSecretKeyLevel)
      privateKey = await TimeManager.generateRandomSecretKey(
        _randomSecretKeyLevel
      );
    else return null;

    if (!privateKey) return null;

    const payload = {
      _id: _id,
      _expiresIn: expirationDate,
    };

    // Generate an initialization vector (iv) and key for encryption
    const iv = crypto.randomBytes(32);
    const key = crypto.scryptSync(privateKey, "salt", 32);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    // Encrypt the payload
    let encrypted = cipher.update(JSON.stringify(payload), "utf8", "hex");
    encrypted += cipher.final("hex");

    // Get the authentication tag for the cipher
    const authTag = cipher.getAuthTag();

    // Combine IV, encrypted data, and authentication tag to form the token
    const token = `${iv.toString("hex")}.${encrypted}.${authTag.toString(
      "hex"
    )}`;

    if (!token || !privateKey) return null;

    // Return the generated token and private key
    return { token, privateKey };
  } catch (error: any | unknown) {
    console.error(`Error > src > index.js > generateToken : ${error.message}`);
    return null;
  }
}

export { generateToken };
