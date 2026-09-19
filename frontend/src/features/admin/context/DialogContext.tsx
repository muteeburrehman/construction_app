import React, { createContext, useContext, useState, useCallback, useRef } from "react"
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Trash2,
  HelpCircle,
} from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastItem {
  id: string
  type: ToastType
  title?: string
  message: string
}

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

export interface AlertOptions {
  title: string
  message: string
  buttonText?: string
  variant?: "error" | "info" | "warning" | "success"
}

interface DialogContextValue {
  toast: {
    success: (message: string, title?: string) => void
    error: (message: string, title?: string) => void
    info: (message: string, title?: string) => void
    warning: (message: string, title?: string) => void
  }
  confirm: (options: ConfirmOptions) => Promise<boolean>
  alert: (options: AlertOptions) => Promise<void>
}

const DialogContext = createContext<DialogContextValue | null>(null)

export function DialogProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  // Toasts state
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // Confirm modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    options: ConfirmOptions
    resolve: (val: boolean) => void
  } | null>(null)

  // Alert modal state
  const [alertState, setAlertState] = useState<{
    isOpen: boolean
    options: AlertOptions
    resolve: () => void
  } | null>(null)

  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = toastTimers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      toastTimers.current.delete(id)
    }
  }, [])

  const addToast = useCallback(
    (type: ToastType, message: string, title?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const newToast: ToastItem = { id, type, title, message }

      setToasts((prev) => [...prev.slice(-4), newToast])

      const timer = setTimeout(() => {
        removeToast(id)
      }, 4500)
      toastTimers.current.set(id, timer)
    },
    [removeToast]
  )

  const toast = {
    success: useCallback((msg: string, title?: string) => addToast("success", msg, title), [addToast]),
    error: useCallback((msg: string, title?: string) => addToast("error", msg, title), [addToast]),
    info: useCallback((msg: string, title?: string) => addToast("info", msg, title), [addToast]),
    warning: useCallback((msg: string, title?: string) => addToast("warning", msg, title), [addToast]),
  }

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      })
    })
  }, [])

  const alert = useCallback((options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        options,
        resolve,
      })
    })
  }, [])

  const handleConfirmAction = (result: boolean) => {
    if (confirmState) {
      confirmState.resolve(result)
      setConfirmState(null)
    }
  }

  const handleAlertAction = () => {
    if (alertState) {
      alertState.resolve()
      setAlertState(null)
    }
  }

  return (
    <DialogContext.Provider value={{ toast, confirm, alert }}>
      {children}

      {/* ─── Floating Toast Notification Container ─── */}
      <div
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const config = {
            success: {
              border: "#86EFAC",
              bg: "#F0FDF4",
              text: "#15803D",
              badgeBg: "#DCFCE7",
              icon: CheckCircle2,
              defaultTitle: "Success",
            },
            error: {
              border: "#FECACA",
              bg: "#FEF2F2",
              text: "#B91C1C",
              badgeBg: "#FEE2E2",
              icon: AlertCircle,
              defaultTitle: "Notice",
            },
            warning: {
              border: "#FDE68A",
              bg: "#FFFBEB",
              text: "#B45309",
              badgeBg: "#FEF3C7",
              icon: AlertTriangle,
              defaultTitle: "Warning",
            },
            info: {
              border: "#BFDBFE",
              bg: "#EFF6FF",
              text: "#1D4ED8",
              badgeBg: "#DBEAFE",
              icon: Info,
              defaultTitle: "Information",
            },
          }[t.type]

          const IconComponent = config.icon

          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 transform translate-x-0"
              style={{
                backgroundColor: config.bg,
                borderColor: config.border,
                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: config.badgeBg, color: config.text }}
              >
                <IconComponent className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className="font-display font-bold text-xs leading-tight mb-0.5"
                  style={{ color: config.text }}
                >
                  {t.title || config.defaultTitle}
                </div>
                <div className="font-body text-xs text-slate-700 leading-snug break-words">
                  {t.message}
                </div>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      {/* ─── Themed Confirmation Modal ─── */}
      {confirmState && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => handleConfirmAction(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: confirmState.options.destructive ? "#FEE2E2" : "#EFF6FF",
                    color: confirmState.options.destructive ? "#DC2626" : "#2E5BA8",
                  }}
                >
                  {confirmState.options.destructive ? (
                    <Trash2 className="w-5 h-5" />
                  ) : (
                    <HelpCircle className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-base text-slate-900 leading-snug mb-1.5">
                    {confirmState.options.title}
                  </h3>
                  <p className="font-body text-xs text-slate-600 leading-relaxed">
                    {confirmState.options.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleConfirmAction(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-display font-semibold text-xs transition-colors cursor-pointer"
              >
                {confirmState.options.cancelText || "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmAction(true)}
                className="px-4 py-2 rounded-xl text-white font-display font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                style={{
                  backgroundColor: confirmState.options.destructive ? "#DC2626" : "#2E5BA8",
                }}
              >
                {confirmState.options.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Themed Alert Modal ─── */}
      {alertState && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={handleAlertAction}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor:
                      alertState.options.variant === "error"
                        ? "#FEE2E2"
                        : alertState.options.variant === "warning"
                        ? "#FEF3C7"
                        : alertState.options.variant === "success"
                        ? "#DCFCE7"
                        : "#EFF6FF",
                    color:
                      alertState.options.variant === "error"
                        ? "#DC2626"
                        : alertState.options.variant === "warning"
                        ? "#D97706"
                        : alertState.options.variant === "success"
                        ? "#16A34A"
                        : "#2E5BA8",
                  }}
                >
                  {alertState.options.variant === "error" ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : alertState.options.variant === "warning" ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : alertState.options.variant === "success" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-base text-slate-900 leading-snug mb-1.5">
                    {alertState.options.title}
                  </h3>
                  <p className="font-body text-xs text-slate-600 leading-relaxed">
                    {alertState.options.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={handleAlertAction}
                className="px-5 py-2 rounded-xl text-white font-display font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                style={{
                  backgroundColor:
                    alertState.options.variant === "error" ? "#DC2626" : "#2E5BA8",
                }}
              >
                {alertState.options.buttonText || "Got it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  )
}

export function useAppDialog(): DialogContextValue {
  const ctx = useContext(DialogContext)
  if (!ctx) {
    throw new Error("useAppDialog must be used within a DialogProvider")
  }
  return ctx
}
