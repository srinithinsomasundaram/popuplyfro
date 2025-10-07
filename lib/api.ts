import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./auth"

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL as string) ||
  (process.env.NEXT_PUBLIC_API_BASE_URL as string) ||
  "http://localhost:5000"

function toAbsolute(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  if (url.startsWith("/")) return `${API_BASE}${url}`
  return `${API_BASE}/${url}`
}

type InternalInit = RequestInit & { _retry?: boolean }

async function handleResponse(res: Response) {
  if (!res.ok) {
    let message = "Request failed"
    try {
      const data = await res.json()
      message = (data?.message || data?.error || JSON.stringify(data)) ?? message
    } catch {
      try {
        message = await res.text()
      } catch {
        // ignore
      }
    }
    if (res.status === 401) {
      throw new ApiError("Unauthorized", 401, "UNAUTHORIZED")
    }
    throw new ApiError(message, res.status)
  }
  if (res.status === 204) return null
  return res.json()
}

async function doFetch(url: string, init: InternalInit = {}) {
  const absolute = toAbsolute(url)
  // Attach Authorization header if available
  const token = getAccessToken()
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(absolute, {
    ...init,
    headers,
    credentials: "include",
    cache: init.method === "GET" ? "no-store" : undefined,
  } as RequestInit)

  // Attempt single refresh on 401
  if (res.status === 401 && !init._retry) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        const refreshRes = await fetch(toAbsolute("/api/auth/refresh"), {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ token: refreshToken }),
        })
        if (refreshRes.ok) {
          const data = (await refreshRes.json()) as { accessToken?: string; refreshToken?: string }
          if (data?.accessToken) {
            setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken || refreshToken })
            // retry original request once
            return doFetch(url, { ...init, _retry: true })
          }
        }
        // refresh failed -> clear tokens
        clearTokens()
      } catch {
        clearTokens()
      }
    }
  }

  return handleResponse(res)
}

export class ApiError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export async function apiGet<T = any>(url: string, init?: RequestInit): Promise<T> {
  return doFetch(url, { ...(init as InternalInit), method: "GET" })
}

export async function apiPost<T = any>(url: string, body?: any, init?: RequestInit): Promise<T> {
  return doFetch(url, {
    ...(init as InternalInit),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

export async function apiPatch<T = any>(url: string, body?: any, init?: RequestInit): Promise<T> {
  return doFetch(url, {
    ...(init as InternalInit),
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

export async function apiDelete<T = any>(url: string, init?: RequestInit): Promise<T> {
  return doFetch(url, {
    ...(init as InternalInit),
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  })
}
