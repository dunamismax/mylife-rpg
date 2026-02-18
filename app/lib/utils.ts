import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function toIsoDate(input: Date): string {
  return input.toISOString().slice(0, 10);
}

export function nowIso(input: Date): string {
  return input.toISOString();
}
