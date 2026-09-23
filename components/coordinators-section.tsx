"use client"

import { useState } from "react"
import { User } from "lucide-react"
import { Reveal } from "./reveal"
import { SectionHeading } from "./section-heading"
import {
  OVERALL_COORDINATORS,
  STAFF_COORDINATORS,
  STUDENT_COORDINATORS,
  type Coordinator,
} from "@/lib/config"

function CoordinatorCard({ person, delay }: { person: Coordinator; delay: number }) {
  const [photoOk, setPhotoOk] = useState(true)

  return (
    <Reveal delay={delay}>
      <div className="group glass flex flex-col items-center gap-4 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/40">
        <span className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-blue/30 bg-black-soft">
          <span className="absolute inset-0 rounded-full bg-gradient-to-b from-blue/20 to-red/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {photoOk && person.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.photo || "/placeholder.svg"}
              alt={person.name}
              className="h-full w-full object-cover"
              onError={() => setPhotoOk(false)}
            />
          ) : (
            <User className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
          )}
        </span>
        <div>
          <p className="font-display text-base font-bold tracking-wide text-foreground">{person.name}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-blue-bright">{person.role}</p>
        </div>
      </div>
    </Reveal>
  )
}

function CoordinatorGroup({ title, people }: { title: string; people: Coordinator[] }) {
  return (
    <div className="mt-14 first:mt-0">
      <Reveal>
        <h3 className="mb-8 text-center font-display text-lg font-bold tracking-[0.2em] text-gold-bright">
          {title}
        </h3>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p, i) => (
          <CoordinatorCard key={`${title}-${i}`} person={p} delay={i * 90} />
        ))}
      </div>
    </div>
  )
}

export function CoordinatorsSection() {
  return (
    <section id="coordinators" className="relative border-t border-border bg-black-soft/60 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="THE TEAM" title="COORDINATORS" />
        </Reveal>

        <div className="mt-14">
          <CoordinatorGroup title="OVERALL COORDINATORS" people={OVERALL_COORDINATORS} />
          <CoordinatorGroup title="STAFF COORDINATORS" people={STAFF_COORDINATORS} />
          <CoordinatorGroup title="STUDENT COORDINATORS" people={STUDENT_COORDINATORS} />
        </div>
      </div>
    </section>
  )
}
