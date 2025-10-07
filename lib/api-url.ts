export const API_URL =
  (typeof window !== "undefined" && (window as any).API_URL) ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "" // empty falls back to same-origin for relative calls
