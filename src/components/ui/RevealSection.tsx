'use client'
import { useReveal } from '@/hooks/useReveal'

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function RevealSection({ children, className = '', delay = 0 }: Props) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
