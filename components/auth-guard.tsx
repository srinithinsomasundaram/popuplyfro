"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { apiGet, type ApiError } from "@/lib/api"
import { getAccessToken } from "@/lib/auth"

type GuardProps = {
  children: React.ReactNode
  redirectTo?: string
}

export function Protected({ children, redirectTo = "/login" }: GuardProps) {
  const router = useRouter()
  const token = typeof window !== "undefined" ? getAccessToken() : null

  // If no token at all, redirect early to avoid flicker
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!token) {
      router.replace(redirectTo)
    }
  }, [token, redirectTo, router])

  const { data, error, isLoading } = useSWR(token ? "/user/profile" : null, apiGet)

  useEffect(() => {
    const status = (error as ApiError)?.status
    if (status === 401) {
      router.replace(redirectTo)
    }
  }, [error, router, redirectTo])

  if (!token) return null
  if (isLoading) return null
  if (error) return null
  if (!data) return null

  return <>{children}</>
}

export function Guest({ children, redirectTo = "/dashboard" }: GuardProps) {
  const router = useRouter()
  const token = typeof window !== "undefined" ? getAccessToken() : null

  const { data, error } = useSWR(token ? "/user/profile" : null, apiGet)

  useEffect(() => {
    // If we have a valid session, redirect guests away
    if (data?.user) {
      router.replace(redirectTo)
    }
  }, [data, redirectTo, router])

  // If token exists but invalid (401), allow the guest page to render
  if (token && !error && !data) return null

  return <>{children}</>
}
