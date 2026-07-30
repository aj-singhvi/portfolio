import { motion, useReducedMotion } from 'framer-motion'
import { domains, profile, stats } from '../data'
import { CountUp } from './Primitives'
import ShaderField from './ShaderField'

const EASE = [0.16, 1, 0.3, 1] as const

/** The name is the headline. Letters rise out of a mask, one after the next. */
function Nameplate() {
  const reduce = useReducedMotion()
  const [first, last] = profile.name.split(' ')

  const letters = (word: string, offset: number, accent: boolean) =>
    word.split('').map((ch, i) => (
      <span key={`${ch}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <motion.span
          className={`inline-block ${accent ? 'text-flame italic' : ''}`}
          initial={{ y: reduce ? 0 : '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.05, delay: 0.25 + (offset + i) * 0.035, ease: EASE }}
        >
          {ch}
        </motion.span>
      </span>
    ))

  return (
    <h1 className="display text-[clamp(3.4rem,13vw,13.5rem)] leading-[0.86]">
      <span className="sr-only">{profile.name}</span>
      <span aria-hidden className="block">
        {letters(first, 0, false)}
        <span className="inline-block w-[0.22em]" />
        {letters(last, first.length, true)}
      </span>
    </h1>
  )
}

export default function Hero() {
  return (
    <section id="top" className="zone-paper relative min-h-svh overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_15%,#fbf9f4,transparent_60%)]"
      />
      <ShaderField className="absolute inset-0 size-full" />
      <div aria-hidden className="hud-grid pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto flex min-h-svh max-w-[104rem] flex-col px-4 pt-24 sm:px-6">
        <div className="mt-auto">
          {/* Chassis plate above the name. Backed with a translucent strip - the shader's
              contour lines sit at the same tonal weight as the mono labels and swallow
              them otherwise. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="-mx-3 flex flex-wrap items-center gap-x-6 gap-y-2 border-b b-rule bg-paper/55 px-3 pb-3 pt-2 backdrop-blur-[2px]"
          >
            <span className="label text-flame">00 / Profile</span>
            <span className="label t-muted">{profile.role}</span>
            <span className="label t-muted sm:ml-auto">{profile.location}</span>
          </motion.div>

          <div className="mt-6 sm:mt-7">
            <Nameplate />
          </div>

          {/* What the name does, demoted to a supporting line but still unmissable. */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
            className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-t b-rule pt-5 font-display text-[clamp(1.15rem,2.5vw,2rem)] sm:mt-7"
          >
            {profile.headline.map((line, i) => (
              <span key={line} className="flex items-center gap-4">
                {i > 0 && <span className="size-1.5 shrink-0 rounded-full bg-flame" />}
                {line.replace(/\.$/, '')}
              </span>
            ))}
          </motion.p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
              className="max-w-2xl space-y-4"
            >
              <p className="text-[15px] leading-[1.7] t-muted sm:text-base">{profile.blurb}</p>
              {/* How I work, in one paragraph instead of a section of its own. */}
              <p className="border-l-2 border-flame/60 pl-4 text-[14px] leading-[1.75] t-muted sm:text-[15px]">
                {profile.approach}
              </p>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
              className="grid h-fit grid-cols-1 gap-px border b-rule bg-[var(--zone-rule)] min-[420px]:grid-cols-3"
            >
              {stats.map((s) => (
                <div key={s.label} className="bg-paper/80 px-4 py-4 backdrop-blur-sm">
                  <dd className="display text-[1.85rem] leading-none tabular-nums">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </dd>
                  <dt className="label mt-2 t-muted">{s.label}</dt>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.15 }}
          className="mt-8 flex items-center gap-3 border-t b-rule py-4 sm:gap-4"
        >
          <span className="label shrink-0 text-flame">Fields</span>
          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee flex shrink-0">
              {[0, 1].map((half) => (
                <div key={half} className="flex shrink-0 items-center">
                  {domains.map((d) => (
                    <span key={d} className="label flex shrink-0 items-center whitespace-nowrap t-muted">
                      <span className="px-5">{d}</span>
                      <span className="size-1 rounded-full bg-flame/70" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <a href="#work" className="label shrink-0 text-flame hover:underline">
            Scroll ↓
          </a>
        </motion.div>
      </div>
    </section>
  )
}
