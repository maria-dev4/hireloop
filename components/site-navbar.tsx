"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { MenuIcon, LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex shrink-0 items-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      aria-label="Hireloop home"
    >
      <Image
        src="/images/logo.png"
        alt="Hireloop"
        width={154}
        height={44}
        priority
        className="h-8 w-auto"
      />
    </Link>
  )
}

export function SiteNavbar() {
  const [open, setOpen] = React.useState(false)
  const { data: session, isPending } = authClient.useSession()

  const navLinks = [
    { label: "Browse Jobs", href: "#browse-jobs" },
    { label: "Company", href: "#company" },
    { label: "Pricing", href: "#pricing" },
    {
      label: "Dashboard",
      href: `/dashboard/${session?.user?.role || "seeker"}`,
    },
  ]

  const handleLogout = async () => {
    await authClient.signOut()
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border/60 bg-card/90 shadow-sm backdrop-blur-md">
        <nav
          aria-label="Main navigation"
          className="flex h-14 items-center justify-between gap-4 pr-3 pl-4"
        >
          <Logo />

          {/* Desktop links */}
          {!isPending && session?.user && (
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            {!isPending &&
              (session?.user ? (
                <>
                  <span className="text-sm font-medium">
                    Welcome, {session.user.name}
                  </span>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <span
                    className="mx-2 h-5 w-px bg-border"
                    aria-hidden="true"
                  />
                  <Button
                    variant="ghost"
                    nativeButton={false}
                    render={<Link href="/sign-in" />}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-xl px-5 font-semibold"
                    nativeButton={false}
                    render={<Link href="/sign-up" />}
                  >
                    Get Started
                  </Button>
                </>
              ))}
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>

            <SheetContent className="w-3/4 border-l-border/60 p-0 sm:max-w-xs">
              <SheetHeader className="border-b border-border/60 pr-14 pb-3">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Hireloop navigation links
                </SheetDescription>
                <Logo />
              </SheetHeader>

              <div className="flex flex-col gap-1 p-4">
                {/* Mobile links */}
                {!isPending && session?.user && (
                  <>
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2.5 text-base text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted/60"
                      >
                        {link.label}
                      </Link>
                    ))}

                    <span
                      className="my-2 h-px w-full bg-border"
                      aria-hidden="true"
                    />
                  </>
                )}

                {!isPending &&
                  (session?.user ? (
                    <>
                      <p className="px-3 py-2 text-sm font-medium">
                        Welcome, {session.user.name}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 size-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        nativeButton={false}
                        render={<Link href="/sign-in" />}
                        onClick={() => setOpen(false)}
                      >
                        Sign In
                      </Button>
                      <Button
                        size="lg"
                        className="w-full font-semibold"
                        nativeButton={false}
                        render={<Link href="/sign-up" />}
                        onClick={() => setOpen(false)}
                      >
                        Get Started
                      </Button>
                    </>
                  ))}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  )
}
