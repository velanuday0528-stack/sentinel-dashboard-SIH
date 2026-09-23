import {
  Presentation,
  BrainCircuit,
  CircuitBoard,
  Gavel,
  ImagePlay,
  AudioLines,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ICONS: Record<string, LucideIcon> = {
  presentation: Presentation,
  quiz: BrainCircuit,
  circuit: CircuitBoard,
  auction: Gavel,
  visual: ImagePlay,
  sound: AudioLines,
}

export function EventIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? CircuitBoard
  return <Icon className={cn("h-6 w-6", className)} strokeWidth={1.75} aria-hidden="true" />
}
