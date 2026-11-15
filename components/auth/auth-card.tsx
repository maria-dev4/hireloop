import Image from "next/image"

export function AuthCard({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="relative w-full max-w-md">
      {/* Soft glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-primary/10 blur-3xl"
      />
      <div className="relative rounded-2xl border border-white/[0.07] bg-card/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-700 sm:p-8">
        <Image
          src="/images/logo.png"
          alt="HireLoop"
          width={154}
          height={44}
          className="h-8 w-auto"
        />
        <p className="mt-8 font-mono text-[11px] tracking-[0.25em] text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  )
}
