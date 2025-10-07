"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function useIntersectionObserver(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold },
    )

    observer.observe(ref)

    return () => {
      observer.disconnect()
    }
  }, [ref, threshold])

  return [setRef, isVisible] as const
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
}: {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const [ref, isVisible] = useIntersectionObserver()

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isVisible, end, duration])

  return (
    <span ref={ref as any}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

export function StaggeredFadeIn({
  children,
  delay = 100,
}: {
  children: React.ReactNode[]
  delay?: number
}) {
  return (
    <>
      {children.map((child, index) => (
        <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * delay}ms` }}>
          {child}
        </div>
      ))}
    </>
  )
}

export function ParallaxContainer({
  children,
  speed = 0.5,
}: {
  children: React.ReactNode
  speed?: number
}) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return <div style={{ transform: `translateY(${offset}px)` }}>{children}</div>
}
