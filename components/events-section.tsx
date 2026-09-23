"use client"

import { useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"
import { SectionHeading } from "./section-heading"
import { EventIcon } from "./event-icon"
import { EventModal } from "./event-modal"
import { cn } from "@/lib/utils"
import { TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS, ALL_EVENTS, type SymposiumEvent } from "@/lib/config"

type Filter = "ALL" | "TECHNICAL" | "NON-TECHNICAL"

const FILTERS: Filter[] = ["ALL", "TECHNICAL", "NON-TECHNICAL"]

function EventCard({
  event,
  onExplore,
}: {
  event: SymposiumEvent
  onExplore: (e: SymposiumEvent) => void
}) {
  const isTech = event.category === "TECHNICAL"
  const accent = isTech ? "text-blue-bright" : "text-red"

  return (
    <button
      type="button"
      onClick={() => onExplore(event)}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-black-soft/70 p-6 text-left backdrop-blur transition-all duration-300 hover:-translate-y-2",
        isTech
          ? "border-blue/20 hover:border-blue/60 hover:shadow-[0_0_30px_rgba(0,102,255,0.25)]"
          : "border-red/20 hover:border-red/60 hover:shadow-[0_0_30px_rgba(255,23,68,0.25)]",
      )}
    >
      {/* gradient wash on hover */}
      <span
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40",
          isTech ? "bg-blue" : "bg-red",
        )}
      />

      <div className="relative flex items-center justify-between">
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border bg-white/5 transition-transform duration-300 group-hover:scale-110",
            isTech ? "border-blue/30" : "border-red/30",
            accent,
          )}
        >
          <EventIcon name={event.icon} className="h-6 w-6" />
        </span>
        <span className="font-display text-3xl font-black text-white/10">{event.number}</span>
      </div>

      <div className="relative mt-5 flex-1">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-display text-[10px] font-semibold tracking-widest",
            isTech ? "border-blue/40 text-blue-bright" : "border-red/40 text-red",
          )}
        >
          {event.category}
        </span>
        <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-foreground">
          {event.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{event.shortDescription}</p>
      </div>

      <span
        className={cn(
          "relative mt-6 inline-flex items-center gap-2 font-display text-xs font-bold tracking-widest transition-colors",
          "text-muted-foreground group-hover:text-gold-bright",
        )}
      >
        EXPLORE EVENT
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </button>
  )
}

export function EventsSection() {
  const [filter, setFilter] = useState<Filter>("ALL")
  const [selected, setSelected] = useState<SymposiumEvent | null>(null)

  const visible = useMemo(() => {
    if (filter === "TECHNICAL") return TECHNICAL_EVENTS
    if (filter === "NON-TECHNICAL") return NON_TECHNICAL_EVENTS
    return ALL_EVENTS
  }, [filter])

  return (
    <section id="events" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal>
        <SectionHeading eyebrow="COMPETE" title="EVENTS" />
      </Reveal>

      {/* Filter tabs */}
      <Reveal delay={80}>
        <div className="mx-auto mt-10 flex w-full max-w-md items-center justify-center gap-1 rounded-full border border-border bg-black-soft/70 p-1 backdrop-blur">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 rounded-full px-3 py-2 font-display text-[10px] font-semibold tracking-widest transition-all sm:text-xs",
                filter === f
                  ? "bg-gradient-to-r from-blue to-blue-bright text-white shadow-[0_0_16px_rgba(0,102,255,0.4)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "NON-TECHNICAL" ? "NON-TECH" : f}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((event, i) => (
          <Reveal key={event.id} delay={(i % 3) * 90}>
            <div className="animate-float-slow h-full" style={{ animationDelay: `${(i % 3) * 0.6}s` }}>
              <EventCard event={event} onExplore={setSelected} />
            </div>
          </Reveal>
        ))}
      </div>

      <EventModal event={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
