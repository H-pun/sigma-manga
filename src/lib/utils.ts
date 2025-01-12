import { clsx, type ClassValue } from "clsx"
import { camelCase, snakeCase } from "lodash";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fungsi untuk mengubah snake_case ke camelCase
export function convertKeysToCamelCase(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => convertKeysToCamelCase(item));
  } else if (data !== null && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        camelCase(key),
        convertKeysToCamelCase(value), // Rekursif untuk nested objects dan array
      ]),
    );
  }
  return data;
}

// Fungsi untuk mengubah camelCase ke snake_case
export function convertKeysToSnakeCase(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => convertKeysToSnakeCase(item));
  } else if (data !== null && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        snakeCase(key),
        convertKeysToSnakeCase(value), // Rekursif untuk nested objects dan array
      ]),
    );
  }
  return data;
}
