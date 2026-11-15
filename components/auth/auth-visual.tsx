import Image from "next/image"
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { cn } from "cn"

const highlights = [
  {
    icon: BriefcaseBusinessIcon,
    title: "90,000+ new jobs",
    description: "Curated roles, refreshed daily.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Verified companies",
    description: "Every employer is reviewed.",
  },
]

export function AuthVisual() {
  return (
    <div className="relative flex h-full min-h-svh flex-col overflow-hidden p-10 xl:p-12">
      {/* Brand */}
      <div className="relative z-10">
        <Image
          src="/images/logo.png"
          alt="HireLoop"
          width={154}
          height={44}
          className="h-8 w-auto"
        />
      </div>

      {/* Headline */}
      <div className="relative z-10 mt-14 max-w-md">
        <p className="font-mono text-xs tracking-[0.3em] text-primary uppercase">
          Where careers loop forward
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:animate-in lg:fade-in lg:slide-in-from-left-4 lg:duration-700">
          Your dream job is one loop away.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-balance text-muted-foreground lg:animate-in lg:fade-in lg:slide-in-from-left-4 lg:delay-100 lg:duration-700">
          Join thousands of professionals who found roles at world-class
          companies - faster, with less friction and zero guesswork.
        </p>
      </div>

      {/* Highlights */}
      <div className="relative z-10 mt-10 flex max-w-md flex-col gap-3">
        {highlights.map((item, i) => (
          <div
            key={item.title}
            className={cn(
              "flex items-center gap-3.5 rounded-2xl border border-border/50 bg-card/60 p-4 shadow-lg shadow-black/20 backdrop-blur-md lg:animate-in lg:fade-in lg:slide-in-from-left-4 lg:duration-700",
              i === 0 && "lg:delay-200",
              i === 1 && "lg:delay-300"
            )}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <item.icon className="size-4.5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{item.title}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {item.description}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Globe artwork - cropped so only the starry indigo band and the
          rim glow show (the top halo stays clipped) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 aspect-6/5 overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent),linear-gradient(to_bottom,transparent,black_30%,black)]"
      >
        <Image
          src="/images/globe.png"
          alt=""
          width={1440}
          height={1882}
          className="absolute left-1/2 top-[-75%] h-auto w-[150%] max-w-none -translate-x-1/2 select-none"
        />
      </div>

      {/* Find your dream job */}
      <div className="relative z-10 mt-auto mb-[42%] flex max-w-md items-center gap-4">
        <div className="hidden flex-1 items-center gap-3 rounded-2xl border border-border/50 bg-card/70 p-4 shadow-xl shadow-black/30 backdrop-blur-md sm:flex">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-primary to-primary/70 text-primary-foreground">
            <ArrowRightIcon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">
              Assisting 15,000+ job seekers
            </span>
            <span className="block text-xs text-muted-foreground">
              97% satisfaction rate across the platform.
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
