import { AuthVisual } from "@/components/auth/auth-visual"

const stars =
  "radial-gradient(1px 1px at 12% 20%, rgba(255,255,255,0.6), transparent)," +
  "radial-gradient(1px 1px at 28% 42%, rgba(255,255,255,0.4), transparent)," +
  "radial-gradient(1.5px 1.5px at 44% 12%, rgba(255,255,255,0.5), transparent)," +
  "radial-gradient(1px 1px at 62% 30%, rgba(255,255,255,0.45), transparent)," +
  "radial-gradient(1px 1px at 78% 16%, rgba(255,255,255,0.55), transparent)," +
  "radial-gradient(1.5px 1.5px at 88% 40%, rgba(255,255,255,0.4), transparent)," +
  "radial-gradient(1px 1px at 8% 60%, rgba(255,255,255,0.35), transparent)," +
  "radial-gradient(1px 1px at 92% 68%, rgba(255,255,255,0.35), transparent)"

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-svh overflow-x-clip bg-background text-foreground">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 h-[480px] opacity-50"
          style={{
            backgroundImage: stars,
            maskImage:
              "radial-gradient(ellipse 90% 100% at 50% 0%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 100% at 50% 0%, black 30%, transparent 100%)",
          }}
        />
        <div className="absolute -top-32 right-[-10%] h-96 w-[480px] rounded-full bg-primary/15 blur-[130px]" />
        <div className="absolute bottom-[-15%] left-[-8%] hidden h-96 w-[420px] rounded-full bg-primary/10 blur-[130px] sm:block" />
      </div>

      {/* Brand visual panel */}
      <aside className="relative hidden w-[44%] overflow-hidden border-r border-border/50 bg-card/30 lg:block xl:w-[46%]">
        <AuthVisual />
      </aside>

      {/* Form panel */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        {children}
      </div>
    </div>
  )
}
