"use client"

import useSWR, { mutate } from "swr"
import { API_URL } from "@/lib/api-url"

type UserProfile = {
  id: string
  name: string
  email: string
  tier?: string
  [k: string]: any
}

const fetcher = async (url: string): Promise<UserProfile | null> => {
  const token = typeof window !== "undefined" && (localStorage.getItem("accessToken") || localStorage.getItem("token"))

  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(`${API_URL}${url}`, { headers })

  if (res.status === 401) return null
  if (!res.ok) {
    // optional debug, remove after verification
    console.log("[v0] useAuth fetcher failed", res.status, await res.text())
    throw new Error(`Failed to load ${url}: ${res.status}`)
  }
  return res.json()
}

export function useAuth() {
  const { data, error, isLoading } = useSWR<UserProfile | null>("/user/profile", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const setUser = (next: UserProfile | null) => {
    mutate("/user/profile", next, false)
  }

  return {
    user: data ?? null,
    loading: isLoading,
    error: error as Error | undefined,
    setUser,
  }
}
