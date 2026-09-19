/**
 * Admin API HTTP client with JWT Bearer token injection and auto-handling
 */

const TOKEN_KEY = "esc_admin_access_token"
const REFRESH_KEY = "esc_admin_refresh_token"

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens(access: string, refresh?: string): void {
  localStorage.setItem(TOKEN_KEY, access)
  if (refresh) {
    localStorage.setItem(REFRESH_KEY, refresh)
  }
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken()
  const headers = new Headers(options.headers || {})

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  // Do not set Content-Type if uploading FormData (browser handles boundaries)
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const url = endpoint.startsWith("/") ? endpoint : `/api/v1/admin/${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle unauthorized
  if (response.status === 401) {
    clearTokens()
    if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
      window.location.href = "/admin/login"
    }
    throw new Error("Session expired. Please log in again.")
  }

  if (!response.ok) {
    let errorMsg = `API error: ${response.status} ${response.statusText}`
    try {
      const errData = await response.json()
      if (errData.detail) errorMsg = errData.detail
      else if (errData.message) errorMsg = errData.message
      else errorMsg = JSON.stringify(errData)
    } catch {
      // fallback to status text
    }
    throw new Error(errorMsg)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json() as Promise<T>
}
