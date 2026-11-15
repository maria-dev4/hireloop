"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeftIcon, CircleAlertIcon, SendIcon } from "lucide-react"

import { AuthCard } from "@/components/auth/auth-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { cn } from "cn"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string>()
  const [formError, setFormError] = useState<string>()
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_PATTERN.test(email)) {
      setError("Enter a valid email address.")
      return
    }
    setPending(true)
    setFormError(undefined)
    try {
      const { error } = await authClient.requestPasswordReset({ email })
      if (error) setFormError(error.message ?? "Could not send the reset email.")
      else setSent(true)
    } catch {
      setFormError("Network error. Check your connection and retry.")
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthCard
      eyebrow="Password recovery"
      title="Reset your password"
      description="Tell us the email you registered with and we'll send a reset link."
    >
      {sent ? (
        <div className="mt-7">
          <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3.5 text-xs leading-relaxed text-foreground">
            <SendIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              If an account exists for{" "}
              <span className="font-semibold">{email}</span>, a password reset
              link is on its way. Check your inbox - and your spam folder.
            </span>
          </div>
          <Link
            href="/sign-in"
            className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl border border-border/70 bg-input/25 text-sm font-medium outline-none hover:bg-input/50 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeftIcon className="size-4" />
            Back to sign in
          </Link>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="mt-7 grid gap-4">
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs leading-relaxed text-destructive"
            >
              <CircleAlertIcon className="mt-0.5 size-3.5 shrink-0" />
              {formError}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="forgot-email" className="text-xs">
              Email address
            </Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={cn(
                "h-11 rounded-xl bg-input/30",
                error && "border-destructive"
              )}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(undefined)
              }}
              aria-invalid={!!error}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={pending}
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all outline-none hover:bg-primary/85 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
          >
            Send reset link
          </button>
          <Link
            href="/sign-in"
            className="text-center text-xs text-muted-foreground transition-colors outline-none hover:text-foreground"
          >
            Back to sign in
          </Link>
        </form>
      )}
    </AuthCard>
  )
}
