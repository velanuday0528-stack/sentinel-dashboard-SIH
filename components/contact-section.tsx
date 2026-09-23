"use client"

import { Mail, ExternalLink } from "lucide-react"
import { Reveal } from "./reveal"
import { SectionHeading } from "./section-heading"
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/config"

export function ContactSection() {
  const socials = SOCIAL_LINKS.filter((s) => s.href)

  return (
    <section id="contact" className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <Reveal>
        <SectionHeading eyebrow="GET IN TOUCH" title="HAVE ANY QUERIES?" />
      </Reveal>

      <Reveal delay={100}>
        <p className="mt-6 text-center leading-relaxed text-muted-foreground">
          For any queries or further information, contact us at:
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group glass inline-flex items-center gap-3 rounded-full px-6 py-4 transition-all hover:border-blue/50 hover:shadow-[0_0_24px_rgba(0,102,255,0.25)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue/30 bg-blue/10 text-blue-bright">
              <Mail className="h-5 w-5" />
            </span>
            <span className="font-display text-sm font-semibold tracking-wide text-foreground transition-colors group-hover:text-gold-bright sm:text-base">
              {CONTACT_EMAIL}
            </span>
          </a>
        </div>

        {socials.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-red/50 hover:text-foreground"
              >
                {s.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  )
}
