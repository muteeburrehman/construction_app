import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export function ProtectedRoute(): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F9FC",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "3px solid #2E5BA8",
            borderTopColor: "transparent",
            animation: "spin 0.7s linear infinite",
          }}
        />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
