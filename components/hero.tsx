"use client"

import { ArrowRight, ChevronDown } from "lucide-react"
import { CircuitBackground } from "./circuit-background"
import {
  COLLEGE_NAME,
  DEPARTMENT_NAME,
  EVENT_TAGLINE,
  REGISTRATION_STATUS,
  REGISTRATION_LINK,
} from "@/lib/config"

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 text-center"
    >
      <CircuitBackground />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        {/* College + department */}
        <p className="font-display text-sm font-semibold tracking-[0.2em] text-foreground sm:text-base">
          {COLLEGE_NAME}
        </p>
        <p className="mt-2 max-w-xl text-[11px] uppercase tracking-[0.28em] text-muted-foreground sm:text-xs">
          {DEPARTMENT_NAME}
        </p>

        {/* Main title */}
        <h1 className="mt-8 font-display text-6xl font-black leading-none tracking-tight sm:text-8xl lg:text-9xl">
          <span className="text-glow-blue bg-gradient-to-b from-white via-blue-bright to-blue bg-clip-text text-transparent">
            XIMUS
          </span>{" "}
          <span className="text-glow-red bg-gradient-to-b from-gold-bright via-gold to-red bg-clip-text text-transparent">
            2026
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-6 font-display text-sm tracking-[0.35em] text-blue-bright sm:text-lg">
          {EVENT_TAGLINE}
        </p>

        {/* Status pill */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-bright" />
          </span>
          <span className="font-display text-xs font-semibold tracking-widest text-gold-bright">
            {REGISTRATION_STATUS}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href={REGISTRATION_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group animate-pulse-glow inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-deep via-red to-blue px-8 py-4 font-display text-sm font-bold tracking-widest text-white transition-transform hover:scale-105 sm:w-auto"
          >
            REGISTER NOW
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#events"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue/40 bg-white/5 px-8 py-4 font-display text-sm font-bold tracking-widest text-foreground backdrop-blur transition-colors hover:border-blue-bright hover:bg-blue/10 sm:w-auto"
          >
            EXPLORE EVENTS
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Scroll to content"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  )
}
