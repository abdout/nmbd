import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Helper function to get the correct path for images from the public directory
 * This ensures consistent paths between development and production on Vercel
 */
export function getImagePath(path: string): string {
  // Remove leading slash if it exists
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Get the base path from environment if available
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // Construct the full path
  return `${basePath}/${normalizedPath}`;
}
