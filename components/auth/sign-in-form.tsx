"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CircleAlertIcon } from "lucide-react"

import { AuthCard } from "@/components/auth/auth-card"
import { GoogleButton } from "@/components/auth/google-button"
import { PasswordInput, SubmitButton } from "@/components/auth/form-controls"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { cn } from "cn"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    form?: string
  }>({})
  const [pending, setPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  const setFieldError = (field: "email" | "password", error?: string) => {
    setErrors((prev) => {
      if (prev[field] === error) return prev
      const next = { ...prev, form: undefined }
      if (error) next[field] = error
      else delete next[field]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {
      email: !email
        ? "Email is required."
        : !EMAIL_PATTERN.test(email)
          ? "Enter a valid email address."
          : undefined,
      password: !password
        ? "Password is required."
        : password.length < 8
          ? "Password must be at least 8 characters."
          : undefined,
    }
    if (next.email || next.password) {
      setErrors((prev) => ({ ...prev, ...next }))
      return
    }
    setPending(true)
    setErrors((prev) => ({ ...prev, form: undefined }))
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: remember,
      })
      if (error) {
        setErrors({ form: error.message ?? "Something went wrong. Try again." })
        return
      }
      // Refresh router cache so server components see the new session.
      router.replace("/")
      router.refresh()
    } catch {
      setErrors({ form: "Network error. Check your connection and retry." })
    } finally {
      setPending(false)
    }
  }

  async function handleGoogle() {
    setGooglePending(true)
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })
      if (!error) return // A redirect to Google takes over.
      setErrors((prev) => ({ ...prev, form: error.message ?? "Could not reach Google." }))
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: "Could not reach Google. Please retry.",
      }))
    } finally {
      setGooglePending(false)
    }
  }

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to HireLoop"
      description="Access your applications, saved jobs and alerts - all in one loop."
    >
      <form noValidate onSubmit={handleSubmit} className="mt-7 grid gap-4">
        {errors.form && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs leading-relaxed text-destructive"
          >
            <CircleAlertIcon className="mt-0.5 size-3.5 shrink-0" />
            {errors.form}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-xs">
            Work or personal email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={cn(
              "h-11 rounded-xl bg-input/30",
              errors.email && "border-destructive"
            )}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setFieldError("email")
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <PasswordInput
          id="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(v) => {
            setPassword(v)
            setFieldError("password")
          }}
          error={errors.password}
        />

        <div className="flex items-center justify-between gap-3">
          <Label
            htmlFor="remember"
            className="flex cursor-pointer items-center gap-2.5 text-xs text-muted-foreground"
          >
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
            />
            Remember me
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary underline-offset-4 outline-none transition-colors hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitButton label="Sign in" pending={pending} className="mt-2" />
      </form>

      <div className="mt-6 flex items-center gap-4">
        <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
        <span className="text-[11px] tracking-widest text-muted-foreground uppercase">
          or
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
      </div>

      <div className="mt-6">
        <GoogleButton label="Continue with Google" onClick={handleGoogle} pending={googlePending} />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        New to HireLoop?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-foreground underline-offset-4 outline-none transition-colors hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Create an account
        </Link>
      </p>
    </AuthCard>
  )
}
