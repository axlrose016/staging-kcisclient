import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "dompurify";
import CryptoJS from 'crypto-js';

// import { HeaderData } from "@/app/(authorized)/report/designer/HeaderSettings";

const encode = new TextEncoder();
const SECRET_KEY = process.env.JSON_SECRET_KEY!;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ensureUint8Array(salt: Uint8Array | Record<string, number>): Uint8Array {
  if (salt instanceof Uint8Array) {
    return salt; // already fine
  }

  // Convert object to Uint8Array
  const entries = Object.entries(salt)
    .map(([k, v]) => [parseInt(k), v] as [number, number])
    .sort((a, b) => a[0] - b[0]);

  return new Uint8Array(entries.map(([_, v]) => v));
}

export async function hashPassword(
  password: string,
  salt: Uint8Array
): Promise<string> {
  // Encode the password as bytes
  const passwordBytes = new TextEncoder().encode(password);

  // Combine password and salt
  const combined = new Uint8Array(passwordBytes.length + salt.length);
  combined.set(passwordBytes);
  combined.set(salt, passwordBytes.length);

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", combined);

  // Convert the ArrayBuffer to a base64 string
  const hashArray = new Uint8Array(hashBuffer);
  const hashString = String.fromCharCode(...hashArray);
  const base64Hash = btoa(hashString);

  return base64Hash;
}

export function sanitizeHTML(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["p", "br", "b", "i", "em", "strong"],
    ALLOWED_ATTR: [],
  });
}

export const insertItemAtIndex = <T>(
  arr: T[],
  index: number,
  newItem: T
): T[] => {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
};

export const replaceItemAtIndex = <T>(
  arr: T[],
  index: number,
  newValue: T
): T[] => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

export const removeItemAtIndex = <T>(arr: T[], index: number): T[] => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

export const moveArrayAtIndex = <T>(
  arr: T[] = [],
  index: number,
  toIndex: number
): T[] => {
  let array = [...arr];
  const element = array[index];
  array.splice(index, 1);
  array.splice(toIndex, 0, element);
  return array;
};

export const processExcelFile = async (file: File): Promise<any[]> => {
  try {
    // Dynamically import xlsx to avoid SSR issues
    const XLSX = await import("xlsx");

    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Get the first worksheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as any[][];

    console.log("jsonData", jsonData);
    if (jsonData.length === 0) {
      throw new Error("No data found in the Excel file");
    }

    // Convert data rows to objects using header names
    const data = jsonData
      .flat() // flatten the nested arrays
      .filter((item) => item !== null) // remove nulls
      .map((item) => item.trim()) // trim strings
      .filter((item) => item !== "e"); // optional: remove specific values like "e"
    return data;
  } catch (error) {
    console.error("Error processing Excel file:", error);
    throw error;
  }
};

export const downloadJson = (jsonData: string, fileName: string): void => {
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export function isValidTokenString(str: any): boolean {
  return typeof str === 'string' && str.length > 64;
}

export async function hasOnlineAccess(
  pingUrl = "https://www.google.com/favicon.ico"
) {
  // First, check the basic navigator flag
  if (!navigator.onLine) return false;

  try {
    // Try to ping a known URL or your own backend health check
    await fetch(pingUrl, {
      method: "HEAD",
      mode: "no-cors", // prevent CORS errors (no-cors won't throw if reachable)
      cache: "no-store",
    });

    return true; // If fetch doesn't throw, assume online
  } catch (err) {
    return false;
  }
}

function removeEmptyValues(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== ''
    )
  );
}

export function cleanArray(data: Record<string, any>[]): Record<string, any>[] {
  return data.map(removeEmptyValues);
}

export function encryptJson(jsonData: string){
  return CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
}

export async function encryptJsonAsync(jsonData: string){
  return CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
}

export const decryptJsonAsync = async (encryptedText: string): Promise<string> => {
  try {

    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Failed to decrypt. Possibly wrong key or malformed input.");
    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err);
    return "";
  }
};

export function decryptJson(encryptedText: string){
  try {

    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Failed to decrypt. Possibly wrong key or malformed input.");
    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err);
    return "";
  }
};