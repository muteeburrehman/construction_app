import React, { createContext, useContext, useState, useEffect } from "react"
import { getAccessToken, setTokens, clearTokens, adminFetch } from "../api/adminClient"
import type { UserProfile } from "../types"

interface AuthContextType {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [token, setToken] = useState<string | null>(getAccessToken())
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadUser() {
      const currentToken = getAccessToken()
      if (!currentToken) {
        setIsLoading(false)
        return
      }

      try {
        const profile = await adminFetch<UserProfile>("/api/v1/auth/me/")
        setUser(profile)
        setToken(currentToken)
      } catch {
        clearTokens()
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (username: string, password: string): Promise<void> => {
    const res = await fetch("/api/v1/auth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      let errMsg = "Invalid credentials. Please try again."
      try {
        const data = await res.json()
        if (data.detail) errMsg = data.detail
      } catch {
        // use default message
      }
      throw new Error(errMsg)
    }

    const data = await res.json()
    setTokens(data.access, data.refresh)
    setToken(data.access)
    if (data.user) {
      setUser(data.user)
    } else {
      const profile = await adminFetch<UserProfile>("/api/v1/auth/me/")
      setUser(profile)
    }
  }

  const logout = (): void => {
    clearTokens()
    setToken(null)
    setUser(null)
    window.location.href = "/admin/login"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
