import * as CryptoJS from "crypto-js";

const SALT = "ClipFlowSyncSalt";
const KEY_SIZE = 256 / 32; // 256 bits
const ITERATIONS = 1000;
const IV_SIZE = 128 / 8; // 16 bytes

/**
 * Derives a key from a password using PBKDF2.
 * @param password The password to derive the key from.
 * @param salt The salt to use.
 * @returns The derived key.
 */
const getKey = (password: string, salt: string) => {
  const saltWords = CryptoJS.enc.Utf8.parse(salt);
  return CryptoJS.PBKDF2(password, saltWords, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS,
    hasher: CryptoJS.algo.SHA1,
  });
};

/**
 * Encrypts a text using AES-256-CBC with a given password, matching the Android implementation.
 *
 * @param text The text to encrypt.
 * @param password The password to use for encryption.
 * @returns The Base64 encoded string in the format [IV] + [Encrypted Data].
 */
export const encryptText = (text: string, password: string): string => {
  const key = getKey(password, SALT);
  const iv = CryptoJS.lib.WordArray.random(IV_SIZE);

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const ivAndCiphertext = iv.concat(encrypted.ciphertext);
  return ivAndCiphertext.toString(CryptoJS.enc.Base64);
};

/**
 * Decrypts a text using AES-256-CBC with a given password, matching the Android implementation.
 *
 * @param base64Payload The Base64 encoded string containing [IV] + [Encrypted Data].
 * @param password The password to use for decryption.
 * @returns The decrypted text.
 */
export const decryptText = (base64Payload: string, password: string): string => {
  const key = getKey(password, SALT);

  const ivAndCiphertext = CryptoJS.enc.Base64.parse(base64Payload);

  const iv = CryptoJS.lib.WordArray.create(ivAndCiphertext.words.slice(0, IV_SIZE / 4));
  const ciphertext = CryptoJS.lib.WordArray.create(ivAndCiphertext.words.slice(IV_SIZE / 4));

  const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext } as any, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
