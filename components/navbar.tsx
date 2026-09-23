"use client"

import { useEffect, useState } from "react"
import { Menu, X, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import { COLLEGE_NAME, COLLEGE_SUBTITLE, COLLEGE_LOGO, REGISTRATION_LINK } from "@/lib/config"

const NAV_LINKS = [
  { label: "HOME", href: "#home" },
  { label: "EVENTS", href: "#events" },
  { label: "REGISTER", href: "#register" },
  { label: "CONTACT", href: "#contact" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [logoOk, setLogoOk] = useState(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-[0_8px_30px_rgba(0,0,0,0.5)]" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo + names */}
        <a href="#home" className="flex items-center gap-3 min-w-0">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue/40 bg-black-soft">
            {logoOk && COLLEGE_LOGO ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={COLLEGE_LOGO || "/placeholder.svg"}
                alt={`${COLLEGE_NAME} logo`}
                className="h-full w-full object-cover"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <Cpu className="h-6 w-6 text-blue-bright" strokeWidth={1.75} aria-hidden="true" />
            )}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-sm font-bold tracking-wide text-foreground sm:text-base">
              {COLLEGE_NAME}
            </span>
            <span className="hidden text-[11px] font-semibold leading-snug tracking-[0.04em] text-muted-foreground sm:block">
              {COLLEGE_SUBTITLE.split(" • ").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative font-display text-xs font-medium tracking-widest text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-blue-bright after:to-red after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <a
            href={REGISTRATION_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-pulse-glow rounded-full bg-gradient-to-r from-blue to-blue-bright px-5 py-2 font-display text-xs font-bold tracking-widest text-white transition-transform hover:scale-105"
          >
            REGISTER NOW
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t border-border transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="glass flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 font-display text-sm tracking-widest text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href={REGISTRATION_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-gradient-to-r from-blue to-blue-bright px-5 py-3 text-center font-display text-sm font-bold tracking-widest text-white"
          >
            REGISTER NOW
          </a>
        </div>
      </div>
    </header>
  )
}
