"use client"

import { useEffect, useRef } from "react"

/**
 * Subtle animated ECE/technology backdrop:
 * a light particle field connected by faint circuit-like traces.
 * Rendered on a single canvas for performance; respects reduced motion.
 */
export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0

    type Node = { x: number; y: number; vx: number; vy: number; c: string }
    let nodes: Node[] = []

    const colors = ["#0066ff", "#00a8ff", "#ff1744", "#d4af37"]

    function resize() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(70, Math.floor((width * height) / 22000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        c: colors[Math.floor(Math.random() * colors.length)],
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)

      // connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.16
            ctx.strokeStyle = `rgba(0,168,255,${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            // right-angle "circuit" routing for an ECE feel
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.beginPath()
        ctx.fillStyle = n.c
        ctx.globalAlpha = 0.75
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    if (reduce) {
      draw()
      cancelAnimationFrame(raf)
    } else {
      draw()
    }

    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="grid-backdrop absolute inset-0" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* glowing color washes */}
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue/20 blur-[120px]" />
      <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-red/15 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
    </div>
  )
}
