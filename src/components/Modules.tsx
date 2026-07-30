import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useState } from 'react'
import { modules } from '../data'
import { LineReveal, Reveal, SectionHeading } from './Primitives'

type Module = (typeof modules)[number]

/**
 * The screenshot. If the file is not in /public/work yet - or fails to load -
 * the frame falls back to a drawn schematic plate, so a card is never broken.
 */
function Shot({ mod }: { mod: Module }) {
  const [failed, setFailed] = useState(false)
  const show = mod.image && !failed

  return (
    <figure className="relative aspect-[16/10] w-full overflow-hidden bg-ink sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
      {show ? (
        <img
          src={mod.image}
          alt={`${mod.title} - interface`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink">
          <div aria-hidden className="hud-grid absolute inset-0 opacity-20" />
          <span className="display relative text-[clamp(2.5rem,7vw,4.5rem)] text-paper/90">
            {mod.title
              .split(' ')
              .map((w) => w[0])
              .join('')}
          </span>
          <span className="label relative text-flame">{mod.id}</span>
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
    </figure>
  )
}

function ModuleCard({ mod, flip }: { mod: Module; flip: boolean }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(226,67,28,0.07), transparent 70%)`

  return (
    <motion.article
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
      }}
      className="brackets group relative overflow-hidden bg-card"
    >
      <motion.div
        aria-hidden
        style={{ background: sheen }}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Header strip - the dashboard row. */}
      <div className="relative flex flex-wrap items-center gap-x-4 gap-y-2 border-b b-rule px-5 py-3 sm:px-8">
        <span className="label text-flame">{mod.id}</span>
        <span
          className={`label px-2 py-0.5 ${
            mod.kind === 'Experience' ? 'bg-flame text-paper' : 'border b-rule t-muted'
          }`}
        >
          {mod.kind}
        </span>
        <span className="label ml-auto t-muted">{mod.period}</span>
      </div>

      {/* Phone: image on top, then text. Desktop: side by side, alternating sides. */}
      <div className="relative grid lg:grid-cols-[1.02fr_1fr] lg:items-stretch">
        <div className={`relative ${flip ? 'lg:order-2' : ''}`}>
          <Shot mod={mod} />
        </div>

        <div
          className={`flex flex-col p-5 sm:p-8 ${
            flip ? 'lg:order-1 lg:border-r' : 'lg:border-l'
          } border-t b-rule lg:border-t-0`}
        >
          <h3 className="display text-[clamp(1.9rem,4.5vw,3.1rem)]">
            <LineReveal text={mod.title} />
          </h3>
          <p className="mt-2 text-sm t-muted">{mod.org}</p>
          <p className="mt-4 font-display text-lg italic sm:text-xl">{mod.summary}</p>

          {/* Job title only matters for the one that was a job. */}
          {mod.kind === 'Experience' && (
            <p className="mt-4 border-t b-rule pt-4 text-[14.5px]">{mod.role}</p>
          )}

          <ul className="mt-6 space-y-4 border-t b-rule pt-6">
            {mod.points.map((p) => (
              <li key={p} className="flex gap-3 text-[14px] leading-[1.7] sm:gap-4 sm:text-[14.5px]">
                <span className="mt-3 h-px w-4 shrink-0 bg-flame/60 sm:w-5" />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {mod.stack.map((s) => (
              <span
                key={s}
                className="label border b-rule px-2 py-1 transition-colors duration-300 group-hover:border-flame/40"
              >
                {s}
              </span>
            ))}
          </div>

          {mod.link && (
            <a
              href={mod.link}
              target="_blank"
              rel="noreferrer"
              className="label mt-6 inline-block self-start border-b border-flame pb-1 text-flame"
            >
              View source ↗
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Modules() {
  return (
    <section className="zone-paper relative border-t b-rule">
      <div className="mx-auto max-w-[104rem] px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading id="work" num="01" eyebrow="Work" title="One internship. Three projects." />

        <div className="grid gap-px bg-[var(--zone-rule)]">
          {modules.map((mod, i) => (
            <Reveal key={mod.id} className="h-full">
              {/* Alternate which side the screenshot lands on, top card image-left. */}
              <ModuleCard mod={mod} flip={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
