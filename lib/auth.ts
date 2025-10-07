// Token storage helpers (client-side)
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("accessToken")
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("refreshToken")
}

export function setTokens(tokens: { accessToken?: string | null; refreshToken?: string | null }) {
  if (typeof window === "undefined") return
  if (typeof tokens.accessToken !== "undefined" && tokens.accessToken !== null) {
    localStorage.setItem("accessToken", tokens.accessToken)
  }
  if (typeof tokens.refreshToken !== "undefined" && tokens.refreshToken !== null) {
    localStorage.setItem("refreshToken", tokens.refreshToken)
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}
