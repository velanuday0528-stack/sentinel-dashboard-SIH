"use client"

import { useEffect, useRef } from "react"
import { X, Users, MapPin, CalendarDays, Clock, Tag, ArrowRight, ListChecks } from "lucide-react"
import { EventIcon } from "./event-icon"
import { cn } from "@/lib/utils"
import { REGISTRATION_LINK, type SymposiumEvent } from "@/lib/config"

function InfoRow({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-white/5 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-bright" />
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

export function EventModal({
  event,
  onClose,
}: {
  event: SymposiumEvent | null
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const isTech = event?.category === "TECHNICAL"

  useEffect(() => {
    if (!event) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [event, onClose])

  if (!event) return null

  const accent = isTech ? "text-blue-bright" : "text-red"
  const accentBorder = isTech ? "border-blue/40" : "border-red/40"
  const registerHref = event.registrationLink || REGISTRATION_LINK

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close event details"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
      />

      {/* Panel */}
      <div
        className={cn(
          "glass relative z-10 flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border-t-2 sm:rounded-3xl sm:border-2",
          accentBorder,
          "animate-in slide-in-from-bottom-6 duration-300 sm:zoom-in-95",
        )}
      >
        {/* Header */}
        <div className="relative shrink-0 border-b border-border p-6">
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-24 opacity-30 blur-2xl",
              isTech ? "bg-blue" : "bg-red",
            )}
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative flex items-center gap-4">
            <span
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border bg-white/5",
                accentBorder,
                accent,
              )}
            >
              <EventIcon name={event.icon} className="h-7 w-7" />
            </span>
            <div>
              <p className={cn("font-display text-xs font-semibold tracking-widest", accent)}>
                {event.number} · {event.category}
              </p>
              <h3 id="event-modal-title" className="font-display text-2xl font-extrabold tracking-tight">
                {event.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="leading-relaxed text-muted-foreground">{event.description}</p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={Users} label="Team Size" value={event.teamSize} />
            <InfoRow icon={MapPin} label="Venue" value={event.venue} />
            <InfoRow icon={CalendarDays} label="Date" value={event.date} />
            <InfoRow icon={Clock} label="Time" value={event.time} />
            <InfoRow icon={Tag} label="Registration Fee" value={event.fee} />
            <InfoRow icon={Users} label="Contact Person" value={event.contactPerson} />
          </div>

          {/* Rules */}
          <div className="mt-6">
            <p className="mb-3 inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide text-gold-bright">
              <ListChecks className="h-4 w-4" />
              Rules
            </p>
            <ol className="space-y-2">
              {event.rules.map((rule, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <span className={cn("font-display text-sm font-bold", accent)}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Extra items */}
          {event.extraItems.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 font-display text-sm font-semibold tracking-wide text-blue-bright">
                {event.extraLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {event.extraItems.map((item, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-border bg-white/5 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer / register */}
        <div className="shrink-0 border-t border-border p-4">
          <a
            href={registerHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-display text-sm font-bold tracking-widest text-white transition-transform hover:scale-[1.02]",
              isTech
                ? "bg-gradient-to-r from-blue to-blue-bright"
                : "bg-gradient-to-r from-red-deep to-red",
            )}
          >
            REGISTER FOR THIS EVENT
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  )
}
