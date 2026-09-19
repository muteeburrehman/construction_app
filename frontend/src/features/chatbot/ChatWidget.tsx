import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { MessageCircle, X, Send, ArrowRight } from "lucide-react"

interface Message {
  id: string
  sender: "user" | "bot"
  text: string
  action?: {
    type: "route" | "link"
    label: string
    route?: string
    url?: string
  }
}

export function ChatWidget(): React.JSX.Element {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([
    "What areas in Northern California do you serve?",
    "What is your California contractor license?",
    "How does your pricing and billing work?",
    "Do you build commercial wineries & tasting rooms?",
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef<string>(
    "session_" + Math.random().toString(36).substring(2, 10)
  )

  // Scroll to bottom on message update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  // Fetch live suggestions from database
  useEffect(() => {
    async function loadSuggestions() {
      try {
        const res = await fetch("/api/v1/chat/suggestions/")
        if (res.ok) {
          const data = await res.json()
          if (data.suggestions && data.suggestions.length > 0) {
            setSuggestions(data.suggestions.map((s: { question: string }) => s.question))
          }
        }
      } catch {
        // use fallback default suggestions
      }
    }
    loadSuggestions()
  }, [])

  // Welcome message when opened the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "Welcome to Eric Sherwood Construction. I am your direct assistant, connected directly to our project records, services catalog, and company knowledge base. How can I assist you with your project today?",
        },
      ])
    }
  }, [isOpen, messages.length])

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || inputValue).trim()
    if (!queryText || isLoading) return

    const userMsg: Message = {
      id: "user_" + Date.now(),
      sender: "user",
      text: queryText,
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputValue("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/v1/chat/message/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          session_id: sessionIdRef.current,
        }),
      })

      if (!res.ok) throw new Error("Could not reach assistant.")
      const data = await res.json()

      const botMsg: Message = {
        id: "bot_" + Date.now(),
        sender: "bot",
        text: data.message || "Thank you. Please reach out directly to Eric at (707) 255-3875.",
        action: data.action,
      }

      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "bot_err_" + Date.now(),
          sender: "bot",
          text: "We are pleased to speak with you directly. Please contact Eric Sherwood at (707) 255-3875 or submit your project on our estimate request page.",
          action: { type: "route", label: "Request an Estimate", route: "/contact" },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleActionClick = (action: NonNullable<Message["action"]>) => {
    if (action.type === "route" && action.route) {
      setIsOpen(false)
      navigate(action.route)
    } else if (action.type === "link" && action.url) {
      window.open(action.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, fontFamily: "Archivo, system-ui, sans-serif" }}>
      {/* Expanded Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: 70,
            right: 0,
            width: "min(380px, calc(100vw - 32px))",
            height: "520px",
            maxHeight: "calc(100vh - 100px)",
            background: "#FFFFFF",
            borderRadius: 16,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid #CBD5E1",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              background: "linear-gradient(135deg, #1A3A6B 0%, #2E5BA8 100%)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  color: "#1A3A6B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                ES
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                  Eric Sherwood Assistant
                </div>
                <div style={{ fontSize: 11, opacity: 0.9, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
                  <span>Local Knowledge Base • Active</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                color: "#FFFFFF",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "#F8FAFC",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.sender === "user" ? "flex-end" : "flex-start",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: m.sender === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    background: m.sender === "user" ? "linear-gradient(90deg, #2E5BA8 0%, #1A3A6B 100%)" : "#FFFFFF",
                    color: m.sender === "user" ? "#FFFFFF" : "#1E293B",
                    fontSize: 13,
                    lineHeight: 1.5,
                    border: m.sender === "user" ? "none" : "1px solid #E2E8F0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </div>

                {/* Optional Action Button */}
                {m.action && (
                  <button
                    type="button"
                    onClick={() => handleActionClick(m.action!)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      color: "#1E40AF",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      marginTop: 2,
                    }}
                  >
                    <span>{m.action.label}</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontSize: 12, padding: "4px 8px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E5BA8", animation: "bounce 1s infinite" }} />
                <span>Searching local knowledge...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div
            style={{
              padding: "8px 12px",
              background: "#FFFFFF",
              borderTop: "1px solid #E2E8F0",
              display: "flex",
              gap: 6,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {suggestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                style={{
                  whiteSpace: "nowrap",
                  padding: "4px 10px",
                  borderRadius: 9999,
                  background: "#F1F5F9",
                  border: "1px solid #E2E8F0",
                  color: "#334155",
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            style={{
              padding: "10px 12px",
              background: "#FFFFFF",
              borderTop: "1px solid #E2E8F0",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Ask about our Napa builds, license, rates..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #CBD5E1",
                fontSize: 13,
                outline: "none",
                background: "#FFFFFF",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: inputValue.trim() ? "#2E5BA8" : "#E2E8F0",
                color: inputValue.trim() ? "#FFFFFF" : "#94A3B8",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: inputValue.trim() ? "pointer" : "default",
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Eric Sherwood Assistant"
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1A3A6B 0%, #2E5BA8 100%)",
          color: "#FFFFFF",
          border: "none",
          boxShadow: "0 8px 16px -2px rgba(26, 58, 107, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          transition: "transform 0.15s ease",
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
        {!isOpen && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#10B981",
              border: "2px solid #FFFFFF",
            }}
          />
        )}
      </button>
    </div>
  )
}
