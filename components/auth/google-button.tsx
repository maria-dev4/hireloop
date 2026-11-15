import { LoaderCircleIcon } from "lucide-react"

import { cn } from "cn"

export function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("size-4.5", className)}
    >
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.15 3.5 2.7.24.02c2.2-2 3.5-5 3.5-8.6Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-.9 7.9-2.6l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.9-2.1-6.9-5l-.14.01-3.6 2.8-.05.13C3.3 21.3 7.3 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.1 14.7c-.2-.7-.4-1.5-.4-2.4 0-.9.1-1.7.4-2.4l-.01-.16-3.6-2.8-.1.1A11.4 11.4 0 0 0 0 12.3c0 1.9.4 3.7 1.2 5.3l3.9-3Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7c2.2 0 3.7 1 4.6 1.8l3.4-3.3C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.2 7l3.9 3c1-2.9 3.7-5.2 6.9-5.2Z"
      />
    </svg>
  )
}

export function GoogleButton({
  label,
  onClick,
  pending,
}: {
  label: string
  onClick: () => void
  pending: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border/70 bg-input/25 text-sm font-medium transition-all outline-none hover:bg-input/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? (
        <LoaderCircleIcon className="size-4 animate-spin" />
      ) : (
        <GoogleLogo />
      )}
      {label}
    </button>
  )
}
