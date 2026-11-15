"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "cn"

export function PasswordInput({
  id,
  label,
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
}: {
  id: string
  label?: string
  placeholder?: string
  autoComplete: string
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="grid gap-2">
      {label && (
        <Label htmlFor={id} className="justify-between text-xs">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          className={cn(
            "h-11 rounded-xl bg-input/30 pr-11",
            error && "border-destructive"
          )}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {visible ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export function SubmitButton({
  label,
  pending,
  className,
}: {
  label: string
  pending: boolean
  className?: string
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all outline-none hover:bg-primary/85 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {pending && <LoaderCircleIcon className="size-4 animate-spin" />}
      {pending ? "Please wait..." : label}
    </button>
  )
}
