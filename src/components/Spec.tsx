import { certifications, education, spec } from '../data'
import { Reveal, SectionHeading } from './Primitives'

export default function Spec() {
  return (
    <section className="zone-ink grain relative">
      <div className="relative mx-auto max-w-[104rem] px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading id="spec" num="02" eyebrow="Spec" title="What I reach for." />

        <div className="grid gap-px bg-[var(--zone-rule)] sm:grid-cols-2 lg:grid-cols-3">
          {spec.map((group, i) => (
            <Reveal key={group.group} delay={(i % 3) * 0.05} className="h-full">
              <div className="h-full bg-ink p-6 transition-colors duration-500 hover:bg-ink-2">
                <span className="label text-flame">{group.group}</span>
                <p className="mt-4 font-mono text-[13.5px] leading-[1.9]">{group.items.join(' · ')}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-10 border-t b-rule pt-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="label text-flame">Education</span>
            <div className="mt-5 divide-y divide-rule-dark">
              {education.map((e, i) => (
                <Reveal key={e.school} delay={i * 0.05}>
                  <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                    <div>
                      <p className="display text-2xl">{e.school}</p>
                      <p className="mt-1 max-w-md text-sm leading-relaxed t-muted">{e.detail}</p>
                    </div>
                    <p className="label shrink-0 t-muted">
                      {e.period} · {e.place}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <span className="label text-flame">Certifications</span>
            <div className="mt-5 divide-y divide-rule-dark">
              {certifications.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.05}>
                  <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                    <div>
                      <p className="display text-2xl">{c.name}</p>
                      <p className="mt-1 max-w-md text-sm leading-relaxed t-muted">{c.issuer}</p>
                    </div>
                    <p className="label shrink-0 t-muted">{c.year}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
