import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { profile, sections } from '../data'

export default function InstrumentBar() {
  const [zone, setZone] = useState<'paper' | 'ink'>('paper')
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  // The page alternates paper and ink blocks; sample what is under the bar.
  useEffect(() => {
    let frame = 0
    const sample = () => {
      frame = 0
      const el = document
        .elementsFromPoint(window.innerWidth / 2, 46)
        .find((n) => n instanceof HTMLElement && n.dataset.zone) as HTMLElement | undefined
      if (el?.dataset.zone) setZone(el.dataset.zone as 'paper' | 'ink')
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sample)
    }
    sample()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const dark = zone === 'ink'
  const edge = dark ? 'border-rule-dark' : 'border-rule'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-colors duration-500 ${
        dark ? 'bg-ink/70 text-paper' : 'bg-paper/70 text-ink'
      }`}
    >
      <div className={`mx-auto flex max-w-[104rem] items-stretch justify-between border-b ${edge}`}>
        <a
          href="#top"
          aria-label={`${profile.name} - back to top`}
          className={`flex items-center border-r px-5 py-3 sm:px-6 ${edge}`}
        >
          <span className="display text-xl leading-none">{profile.callsign}</span>
        </a>

        <nav className="hidden flex-1 items-stretch md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`group flex flex-1 items-center gap-2 border-r px-4 transition-colors hover:bg-flame hover:text-paper ${edge}`}
            >
              <span className="label text-flame transition-colors group-hover:text-paper">{s.num}</span>
              <span className="label">{s.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5 px-4 sm:px-6">
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="label hidden text-flame hover:underline sm:inline"
          >
            Résumé ↗
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="flex size-6 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={`h-px w-5 bg-current transition-transform duration-300 ${open ? 'translate-y-[3px] rotate-45' : ''}`}
            />
            <span
              className={`h-px w-5 bg-current transition-transform duration-300 ${open ? '-translate-y-[3px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>

      <motion.div style={{ scaleX }} className="h-[2px] w-full origin-left bg-flame" />

      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-b md:hidden ${dark ? 'border-rule-dark bg-ink' : 'border-rule bg-paper'}`}
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-4 border-b px-6 py-4 ${edge}`}
            >
              <span className="label text-flame">{s.num}</span>
              <span className="display text-2xl">{s.label}</span>
            </a>
          ))}
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 px-6 py-4 text-flame"
          >
            <span className="label">↗</span>
            <span className="display text-2xl">Résumé</span>
          </a>
        </motion.nav>
      )}
    </header>
  )
}
