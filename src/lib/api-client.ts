"use client"

import { useEffect, useState } from "react"

export async function apiJson<T>(
  url: string,
  options?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function useApi<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!url) return
    let active = true
    setLoading(true)
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d) setData(d as T)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [url])

  return { data, loading }
}

export function daysLeft(dateValue: string | Date | null | undefined): string {
  if (!dateValue) return "Ongoing"
  const diff = new Date(dateValue).getTime() - Date.now()
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000))
  if (days <= 0) return "Closed"
  return `${days} Days Left`
}
