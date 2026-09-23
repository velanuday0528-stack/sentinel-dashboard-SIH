"use client"

import { Cpu, Radio, MemoryStick, Waves, Wifi, CircuitBoard, Router, Binary } from "lucide-react"
import { Reveal } from "./reveal"
import { SectionHeading } from "./section-heading"
import { DEPARTMENT_NAME, ECE_DESCRIPTION } from "@/lib/config"

const DOMAINS = [
  { icon: CircuitBoard, label: "Circuits" },
  { icon: Radio, label: "Communication" },
  { icon: MemoryStick, label: "Embedded Systems" },
  { icon: Waves, label: "Signals" },
  { icon: Wifi, label: "Wireless" },
  { icon: Cpu, label: "VLSI" },
  { icon: Router, label: "IoT" },
  { icon: Binary, label: "Digital Systems" },
]

export function DepartmentSection() {
  return (
    <section id="department" className="relative overflow-hidden border-y border-border bg-black-soft/60 py-24">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="THE DEPARTMENT" title="ELECTRONICS & COMMUNICATION" />
        </Reveal>

        <Reveal delay={100}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[11px] uppercase tracking-[0.25em] text-blue-bright">
            {DEPARTMENT_NAME}
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-pretty text-center leading-relaxed text-muted-foreground">
            {ECE_DESCRIPTION}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {DOMAINS.map((d, i) => (
            <Reveal key={d.label} delay={i * 60}>
              <div className="group glass flex h-full flex-col items-center gap-3 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue/50">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-blue/30 bg-blue/10 text-blue-bright transition-all duration-300 group-hover:scale-110 group-hover:text-gold-bright group-hover:shadow-[0_0_20px_rgba(0,168,255,0.4)]">
                  <d.icon className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <span className="font-display text-xs font-semibold tracking-widest text-foreground">
                  {d.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
