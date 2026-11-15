"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircleIcon, CircleAlertIcon } from "lucide-react"

import { AuthCard } from "@/components/auth/auth-card"
import { GoogleButton } from "@/components/auth/google-button"
import { PasswordInput, SubmitButton } from "@/components/auth/form-controls"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { cn } from "cn"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Account types the user can pick from. These values must match
// the "role" field defined in lib/auth.ts.
const ROLES = [
  { value: "seeker", label: "Job Seeker" },
  { value: "recruiter", label: "Recruiter" },
  { value: "admin", label: "Admin" },
] as const

type Role = (typeof ROLES)[number]["value"]

function passwordScore(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

const strengthMeter = [
  { label: "Weak", className: "bg-destructive text-destructive" },
  { label: "Fair", className: "bg-amber-400 text-amber-400" },
  { label: "Good", className: "bg-chart-2 text-chart-2" },
  { label: "Strong", className: "bg-primary/70 text-primary" },
  { label: "Excellent", className: "bg-primary text-primary" },
]

export function SignUpForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("seeker")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    form?: string
  }>({})
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  const score = useMemo(() => passwordScore(password), [password])

  const setFieldError = (field: "name" | "email" | "password" | "confirmPassword", error?: string) => {
    setErrors((prev) => {
      const next = { ...prev, form: undefined }
      if (error) next[field] = error
      else delete next[field]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {
      name: !name
        ? "Full name is required."
        : name.trim().length < 2
          ? "Enter your full name."
          : undefined,
      email: !email
        ? "Email is required."
        : !EMAIL_PATTERN.test(email)
          ? "Enter a valid email address."
          : undefined,
      password: !password
        ? "Password is required."
        : password.length < 8
          ? "Use at least 8 characters."
          : undefined,
      confirmPassword: !confirmPassword
        ? "Confirm your password."
        : confirmPassword !== password
          ? "Passwords don't match."
          : undefined,
    }
    if (Object.values(next).some(Boolean)) {
      setErrors((prev) => ({ ...prev, ...next }))
      return
    }
    setPending(true)
    setErrors((prev) => ({ ...prev, form: undefined }))
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email,
        password,
        role, // "seeker" | "recruiter" | "admin" -> stored on the user
      })
      if (error) {
        setErrors({ form: error.message ?? "Something went wrong. Try again." })
        return
      }
      // Better Auth signs the user in right after sign-up.
      // Show a success message first, then send them to the home page.
      setSuccess(true)
      setTimeout(() => {
        router.replace("/")
        router.refresh()
      }, 1200)
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
      setErrors((prev) => ({
        ...prev,
        form: error.message ?? "Could not reach Google.",
      }))
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
      eyebrow="Create your loop"
      title="Start your journey"
      description="One account for applications, alerts and offers - free forever."
    >
      <form noValidate onSubmit={handleSubmit} className="mt-7 grid gap-4">
        {success && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2.5 text-xs leading-relaxed text-primary"
          >
            <CheckCircleIcon className="mt-0.5 size-3.5 shrink-0" />
            Account created successfully! Redirecting you to the home page...
          </div>
        )}

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
          <Label htmlFor="name" className="text-xs">
            Full name
          </Label>
          <Input
            id="name"
            placeholder="Jane Cooper"
            autoComplete="name"
            className={cn(
              "h-11 rounded-xl bg-input/30",
              errors.name && "border-destructive"
            )}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setFieldError("name")
            }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-xs">I am signing up as</Label>
          <div
            role="radiogroup"
            aria-label="Account type"
            className="grid grid-cols-3 gap-2"
          >
            {ROLES.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={role === option.value}
                onClick={() => setRole(option.value)}
                className={cn(
                  "h-11 rounded-xl border text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  role === option.value
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border/60 bg-input/30 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-xs">
            Email address
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
          id="new-password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(v) => {
            setPassword(v)
            setFieldError("password")
          }}
          error={errors.password}
        />

        {password && (
          <div aria-hidden="true" className="-mt-1 mb-1 flex items-center gap-2">
            <div className="flex flex-1 gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i < score
                      ? strengthMeter[score - 1].className
                      : "bg-input/60"
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              {strengthMeter[score - 1]?.label ?? strengthMeter[0].label}
            </span>
          </div>
        )}

        <PasswordInput
          id="confirm-password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(v) => {
            setConfirmPassword(v)
            setFieldError("confirmPassword")
          }}
          error={errors.confirmPassword}
        />

        <SubmitButton
          label="Create account"
          pending={pending || success}
          className="mt-2"
        />
      </form>

      <div className="mt-6 flex items-center gap-4">
        <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
        <span className="text-[11px] tracking-widest text-muted-foreground uppercase">
          or
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
      </div>

      <div className="mt-6">
        <GoogleButton
          label="Sign up with Google"
          onClick={handleGoogle}
          pending={googlePending}
        />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already looping with us?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-foreground underline-offset-4 outline-none transition-colors hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
