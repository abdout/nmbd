import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImagePath(path: string): string {
  // If path is already a full URL, return it as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Otherwise, return the path with the public URL prefix
  // You might want to use a different base URL in production vs development
  return process.env.NEXT_PUBLIC_BASE_URL 
    ? `${process.env.NEXT_PUBLIC_BASE_URL}${path}`
    : path;
}
