import { Mail } from "lucide-react"
import { COLLEGE_NAME, DEPARTMENT_NAME, CONTACT_EMAIL } from "@/lib/config"

const FOOTER_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Events", href: "#events" },
  { label: "Register", href: "#register" },
  { label: "Contact", href: "#contact" },
]

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-background py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-glow-blue font-display text-2xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-white to-blue-bright bg-clip-text text-transparent">
              XIMUS
            </span>{" "}
            <span className="bg-gradient-to-r from-gold-bright to-red bg-clip-text text-transparent">
              2026
            </span>
          </p>
          <p className="mt-3 font-display text-sm font-semibold text-foreground">{COLLEGE_NAME}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {DEPARTMENT_NAME}
          </p>
        </div>

        <div className="md:justify-self-center">
          <p className="mb-4 font-display text-xs font-semibold tracking-widest text-blue-bright">
            NAVIGATE
          </p>
          <ul className="space-y-2">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:justify-self-end">
          <p className="mb-4 font-display text-xs font-semibold tracking-widest text-blue-bright">
            QUERIES
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold-bright"
          >
            <Mail className="h-4 w-4" />
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-border px-4 pt-6 sm:px-6">
        <p className="text-center text-xs text-muted-foreground">
          &copy; 2026 XIMUS — Department of Electronics and Communication Engineering. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  )
}
