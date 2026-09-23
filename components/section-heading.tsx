import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow?: string
  title: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {eyebrow ? (
        <span className="mb-3 font-display text-xs font-semibold tracking-[0.3em] text-blue-bright">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <span className="mt-4 h-0.5 w-24 rounded-full bg-gradient-to-r from-blue via-red to-gold" />
    </div>
  )
}
