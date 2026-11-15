import Image from "next/image"
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  SearchIcon,
  SparklesIcon,
  UserSearchIcon,
} from "lucide-react"

const trendingSearches = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

const stats = [
  { value: "50K", label: "Active Jobs", icon: BriefcaseBusinessIcon },
  { value: "12K", label: "Companies", icon: Building2Icon },
  { value: "2M", label: "Job Seekers", icon: UserSearchIcon },
  { value: "97%", label: "Satisfaction Rate", icon: SparklesIcon },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Headline block */}
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center pt-20 text-center sm:pt-24 lg:pt-28">
          {/* Badge */}
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="hidden h-px w-10 bg-gradient-to-r from-transparent to-border sm:block"
            />
            <div className="relative flex items-center gap-2.5 rounded-full border border-border/60 bg-card/80 py-1.5 pr-4 pl-1.5 shadow-sm backdrop-blur-md">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary shadow-[0_0_14px_2px] shadow-primary/35 ring-1 ring-primary/40">
                <BriefcaseBusinessIcon className="size-4" />
              </span>
              <span className="text-sm font-semibold">90,000+</span>
              <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                New jobs this month
              </span>
            </div>
            <span
              aria-hidden="true"
              className="hidden h-px w-10 bg-gradient-to-l from-transparent to-border sm:block"
            />
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[54px]">
            Find Your Dream Job Today
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role -
            faster.
          </p>

          {/* Search bar */}
          <div className="relative mt-8 w-full max-w-2xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-primary/10 blur-2xl"
            />
            <form
              action="/"
              method="get"
              className="relative flex w-full flex-col gap-1 rounded-2xl border border-border/60 bg-card/70 p-2 shadow-lg shadow-black/30 backdrop-blur-md sm:flex-row sm:items-center"
            >
              <label className="relative flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 focus-within:bg-muted/40">
                <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="sr-only">Job title, skill or company</span>
                <input
                  type="search"
                  name="q"
                  placeholder="Job title, skill or company"
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <span
                aria-hidden="true"
                className="hidden h-6 w-px shrink-0 bg-border sm:block"
              />
              <label className="relative flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 focus-within:bg-muted/40">
                <BriefcaseBusinessIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="sr-only">Location or Remote</span>
                <input
                  type="search"
                  name="location"
                  placeholder="Location or Remote"
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <button
                type="submit"
                aria-label="Search jobs"
                className="flex h-10 w-full shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_16px_2px] shadow-primary/50 transition-colors outline-none hover:bg-primary/85 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px sm:w-10"
              >
                <SearchIcon className="size-4.5" />
              </button>
            </form>
          </div>

          {/* Trending searches */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="pr-1 text-xs text-muted-foreground">
              Trending Position
            </span>
            {trendingSearches.map((term) => (
              <a
                key={term}
                href={`/?q=${encodeURIComponent(term)}`}
                className="rounded-md border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-foreground/80 transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {term}
              </a>
            ))}
          </div>
        </div>

        {/* Globe scene */}
        <div id="globe-scene" className="relative mt-2">
          {/* The image is much taller than the visible area - the wrapper is
              shifted up so the sphere rim sits ~8% of container width below
              the container top, and the lower sphere fades out, matching the
              reference. */}
          <div className="relative h-[480px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black)] sm:h-[540px] lg:aspect-[50/23] lg:h-auto">
            <Image
              src="/images/globe.png"
              alt=""
              aria-hidden="true"
              width={1440}
              height={1882}
              priority
              className="absolute top-0 left-1/2 h-auto w-[max(138%,60rem)] max-w-none -translate-x-1/2 -translate-y-[40.5%] select-none"
            />

            {/* Fade the lower sphere into the page background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-1/2 bg-linear-to-b from-transparent via-background/60 via-75% to-background"
            />

            {/* Overlay copy - hidden on small screens where the 2x2 stat
                grid would cover it */}
            <p className="absolute inset-x-0 top-[42%] z-10 hidden px-4 text-center text-2xl font-semibold text-white sm:text-3xl lg:block">
              Assisting over 15,000 job seekers
              <br />
              find their dream positions.
            </p>

            {/* Stats - overlap the sphere like the reference */}
            <dl className="absolute inset-x-0 bottom-16 z-10 grid w-full grid-cols-2 gap-2 px-4 sm:gap-3 sm:px-6 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/60 bg-card/90 p-4 shadow-lg shadow-black/20 backdrop-blur-md sm:p-6"
                >
                  <stat.icon className="size-5 text-foreground/70" />
                  <dd className="mt-9 text-3xl font-bold tracking-tight sm:text-[40px] sm:leading-none">
                    {stat.value}
                  </dd>
                  <dt className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
