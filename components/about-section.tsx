"use client"

import { useState } from "react"
import { MapPin, Target, Sparkles, GraduationCap } from "lucide-react"
import { Reveal } from "./reveal"
import { SectionHeading } from "./section-heading"
import {
  COLLEGE_NAME,
  COLLEGE_LOGO,
  COLLEGE_DESCRIPTION,
  COLLEGE_LOCATION,
  COLLEGE_VISION,
  SYMPOSIUM_INFO,
} from "@/lib/config"

export function AboutSection() {
  const [logoOk, setLogoOk] = useState(true)

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal>
        <SectionHeading eyebrow="ABOUT" title="THE INSTITUTION" />
      </Reveal>

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <span className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-blue/30 bg-black-soft">
            {logoOk && COLLEGE_LOGO ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={COLLEGE_LOGO || "/placeholder.svg"}
                alt={`${COLLEGE_NAME} logo`}
                className="h-full w-full object-contain p-3"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <GraduationCap className="h-14 w-14 text-blue-bright" strokeWidth={1.5} />
            )}
          </span>
          <h3 className="text-balance font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {COLLEGE_NAME}
          </h3>
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-red" />
            {https://maps.app.goo.gl/xtijCtkMVrc8NL5MA?g_st=ac}
          </p>
        </Reveal>

        <Reveal delay={120} className="flex flex-col gap-5">
          <p className="text-pretty leading-relaxed text-muted-foreground">{
          S.A. Engineering College (SAEC) is an autonomous, co-educational engineering institution established during the academic year 1998–1999 in Chennai, Tamil Nadu. Affiliated with Anna University, Chennai, and approved by the AICTE, the college is accredited by NAAC with an 'A' Grade and is ISO 9001:2015 certified.}</p>

          <div className="glass rounded-xl p-5">
            <p className="mb-1 inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide text-gold-bright">
              <Target className="h-4 w-4" />
              Vision &amp; Mission
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{
            To create an excellent teaching and learning environment for staff and students to realize their full potential, enabling them to contribute positively to the community.
            To significantly enhance self-confidence levels for developing the creative skills of staff and students.}</p>
          </div>

          <div className="glass rounded-xl p-5">
            <p className="mb-1 inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide text-blue-bright">
              <Sparkles className="h-4 w-4" />
              About XIMUS 2026
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{A NATIONAL LEVEL TECHNICAL SYMPOSIUM}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
