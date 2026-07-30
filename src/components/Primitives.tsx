import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Words rise into place one at a time. Used for the lines that carry the page. */
export function LineReveal({
  text,
  className = '',
  delay = 0,
  accent = false,
}: {
  text: string
  className?: string
  delay?: number
  accent?: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <span className={`block ${className}`}>
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          <motion.span
            className={`mr-[0.24em] inline-block ${accent ? 'text-flame' : ''}`}
            initial={{ y: reduce ? 0 : '105%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: delay + i * 0.055, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/**
 * Section header: a numbered mono label, a serif display title, and an optional lead.
 * The number rail is what makes the page feel like a document worth walking through.
 */
export function SectionHeading({
  id,
  num,
  eyebrow,
  title,
  lead,
}: {
  id?: string
  num: string
  eyebrow: string
  title: string
  lead?: string
}) {
  return (
    <header id={id} className="mb-10 scroll-mt-24 sm:mb-12">
      <Reveal>
        <div className="flex items-center gap-4 border-b b-rule pb-4">
          <span className="label text-flame">{num}</span>
          <span className="label t-muted">{eyebrow}</span>
        </div>
      </Reveal>
      <h2 className="display mt-6 max-w-4xl text-[clamp(2.1rem,5.5vw,4.25rem)] sm:mt-8">
        <LineReveal text={title} />
      </h2>
      {lead && (
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed t-muted sm:mt-6 sm:text-[17px]">{lead}</p>
        </Reveal>
      )}
    </header>
  )
}

export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const raw = useMotionValue(0)
  const spring = useSpring(raw, { stiffness: 55, damping: 18 })
  const decimals = Number.isInteger(value) ? 0 : 2

  useEffect(() => {
    if (inView) raw.set(value)
  }, [inView, raw, value])

  useEffect(() => {
    if (reduce) {
      if (ref.current) ref.current.textContent = value.toFixed(decimals) + suffix
      return
    }
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix
    })
  }, [spring, suffix, decimals, reduce, value])

  return <span ref={ref}>0{suffix}</span>
}

export function Magnetic({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 200, damping: 15 })
  const y = useSpring(0, { stiffness: 200, damping: 15 })

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={className}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * 0.22)
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
