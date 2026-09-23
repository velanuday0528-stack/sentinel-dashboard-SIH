"use client"

import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"
import { REGISTRATION_LINK, REGISTRATION_SUBTEXT } from "@/lib/config"

export function RegistrationSection() {
  return (
    <section id="register" className="relative overflow-hidden py-24">
      {/* accent washes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-red/20 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 translate-x-1/2 rounded-full bg-blue/20 blur-[120px]" />
      </div>

      <Reveal>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="glass rounded-3xl border-gold/20 px-6 py-14 sm:px-12">
            <h2 className="text-glow-blue font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              REGISTRATIONS ARE OPEN
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Ready to showcase your skills, ideas and creativity?
            </p>

            <a
              href={REGISTRATION_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group animate-pulse-glow mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue via-red to-gold px-10 py-4 font-display text-sm font-bold tracking-widest text-white transition-transform hover:scale-105"
            >
              REGISTER NOW
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
              {REGISTRATION_SUBTEXT}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
