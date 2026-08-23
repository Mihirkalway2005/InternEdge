"use client"

/** Typed fetch that throws ApiClientError with server-provided messages. */

/** Data-fetching hook with explicit loading/error/refetch semantics. */

import { useCallback, useEffect, useState } from "react"
import type { ApiErrorPayload } from "@/types"

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message)
    this.name = "ApiClientError"
  }
}
export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, {
      ...options,
      headers:
        options?.body instanceof FormData
          ? options?.headers
          : { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    })
  } catch {
    throw new ApiClientError("Network error — check your connection", 0)
  }

  if (!res.ok) {
    let payload: ApiErrorPayload | null = null
    try {
      payload = ((await res.json()) as ApiErrorPayload)
    } catch {}
    throw new ApiClientError(
      payload?.error ?? `Request failed (${res.status})`,
      res.status,
      payload?.details,
    )
  }
  return (await res.json()) as T
}

export type UseApiState<T,> = {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}
export function useApi<T>(url: string | null): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(Boolean(url))
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!url) return
    let active = true
    setLoading(true)
    setError(null)
    api<T>(url)
      .then((d) => {
        if (active) setData(d)
      })
      .catch((err: Error) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [url, tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])
  return { data, loading, error, refetch }
}

export function daysLeft(dateValue: string | Date | null | undefined): string {
  if (!dateValue) return "Ongoing"
  const diff = new Date(dateValue).getTime() - Date.now()
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000))
  if (days <= 0) return "Closed"
  if (days === 1) return "1 day left"
  return `${days} days left`
}

export function timeAgo(dateValue: string | Date): string {
  const diff = Date.now() - new Date(dateValue).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days < 30 ? `${days}d ago` : new Date(dateValue).toLocaleDateString()
}
