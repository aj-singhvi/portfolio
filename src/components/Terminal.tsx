import { useEffect, useRef, useState } from 'react'
import { modules, profile, spec } from '../data'
import { Magnetic, Reveal, SectionHeading } from './Primitives'

type Line = { kind: 'in' | 'out' | 'accent'; text: string }

const PROMPT = 'visitor@arihant:~$'

const HELP: Line[] = [
  { kind: 'out', text: 'whoami     who you are talking to' },
  { kind: 'out', text: 'work       internship and projects' },
  { kind: 'out', text: 'stack      the tools, grouped' },
  { kind: 'out', text: 'contact    email and phone' },
  { kind: 'out', text: 'links      github, linkedin, competitive profiles' },
  { kind: 'out', text: 'resume     open the PDF' },
  { kind: 'out', text: 'clear      wipe the screen' },
]

const BOOT: Line[] = [
  { kind: 'accent', text: `${profile.name} - final-year CS undergrad, Cyber Security minor` },
  { kind: 'out', text: profile.location },
  { kind: 'out', text: '' },
  { kind: 'out', text: 'Commands:' },
  ...HELP,
  { kind: 'out', text: '' },
]

/**
 * A closed command set. Every accepted command is a key in this map - there is no
 * fallthrough, no eval, no shell, and nothing here can reach anything I did not list.
 */
const COMMANDS: Record<string, () => Line[]> = {
  help: () => HELP,
  whoami: () => [
    { kind: 'accent', text: profile.name },
    { kind: 'out', text: 'Final-year B.Tech CSE, minor in Cyber Security, Nirma University ’27.' },
    { kind: 'out', text: 'Deep on security and systems. Wide on purpose.' },
  ],
  work: () =>
    modules.flatMap((m) => [
      { kind: 'accent' as const, text: `${m.id}  ${m.title}` },
      { kind: 'out' as const, text: `      ${m.summary}` },
    ]),
  stack: () => spec.map((g) => ({ kind: 'out' as const, text: `${g.group.padEnd(15)} ${g.items.join(' · ')}` })),
  contact: () => [
    { kind: 'accent', text: profile.email },
    { kind: 'out', text: profile.phone },
  ],
  links: () => profile.socials.map((s) => ({ kind: 'out' as const, text: `${s.label.padEnd(11)} ${s.url}` })),
  resume: () => {
    window.open(profile.resume, '_blank', 'noreferrer')
    return [{ kind: 'accent', text: 'Opening résumé in a new tab…' }]
  },
  clear: () => [],
}

const ALLOWED = Object.keys(COMMANDS)

/** The four worth a visitor's first tap, in the order I want them read. */
const SUGGESTIONS = ['whoami', 'work', 'stack', 'contact']

function run(raw: string): Line[] {
  const cmd = raw.trim().toLowerCase()
  if (!cmd) return []
  // Exact match against the whitelist, or nothing at all.
  if (Object.prototype.hasOwnProperty.call(COMMANDS, cmd)) return COMMANDS[cmd]()
  return [
    { kind: 'out', text: `${cmd}: not available.` },
    { kind: 'out', text: `This terminal accepts only: ${ALLOWED.join(', ')}` },
  ]
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(BOOT)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState(-1)
  const [caret, setCaret] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // The real caret is invisible (caret-transparent) - a block span stands in for it,
  // so it has to be told where selectionStart actually is on every move, not just on type.
  const syncCaret = (el: HTMLInputElement) => setCaret(el.selectionStart ?? el.value.length)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  /** One path for both routes in: typing and tapping a suggestion chip. */
  const execute = (entry: string) => {
    if (entry.trim().toLowerCase() === 'clear') {
      setLines([])
    } else {
      setLines((prev) => [...prev, { kind: 'in', text: entry }, ...run(entry)])
    }
    if (entry.trim()) setHistory((h) => [entry, ...h])
    setHIndex(-1)
    setValue('')
    setCaret(0)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    execute(value)
  }

  // Up/down walks command history, like the shell it is imitating. Left/right and
  // click fall through to the input natively - onSelect picks up where they land.
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(hIndex + 1, history.length - 1)
      if (next >= 0) {
        setHIndex(next)
        setValue(history[next])
        setCaret(history[next].length)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = hIndex - 1
      setHIndex(next)
      const v = next >= 0 ? history[next] : ''
      setValue(v)
      setCaret(v.length)
    }
  }

  return (
    <section className="zone-paper relative">
      <div className="mx-auto max-w-[104rem] px-4 pt-16 pb-14 sm:px-6 sm:pt-20">
        <SectionHeading
          id="contact"
          num="03"
          eyebrow="Contact"
          title="Bring me a problem I have not solved yet."
          lead="Open to internships and roles across software engineering, security, cloud and systems."
        />

        {/* Both panels stretch to match height; the terminal is capped so it can
            never grow the section, and the contact list re-centers into any slack. */}
        <div className="grid gap-px bg-[var(--zone-rule)] lg:grid-cols-[1.35fr_1fr] lg:items-stretch">
          <Reveal className="h-full">
            <div className="brackets flex h-full min-h-[24rem] max-h-[28rem] flex-col bg-ink lg:min-h-[30rem] lg:max-h-[34rem]">
              <div className="flex items-baseline justify-between border-b border-rule-dark px-5 py-2.5">
                <span className="label text-paper/50">Terminal</span>
                <span className="label text-paper/30">Closed command set</span>
              </div>

              <div
                ref={scrollRef}
                onClick={() => inputRef.current?.focus()}
                className="min-h-0 flex-1 overflow-x-auto overflow-y-auto p-4 font-mono text-[12px] leading-[1.7] text-paper sm:p-5 sm:text-[13px]"
              >
                {lines.map((l, i) => (
                  <p
                    key={i}
                    className={l.kind === 'in' ? 'text-paper' : l.kind === 'accent' ? 'text-flame' : 'text-muted-dark'}
                  >
                    {l.kind === 'in' ? (
                      <>
                        <span className="text-flame">{PROMPT}</span> {l.text}
                      </>
                    ) : (
                      <span className="whitespace-pre-wrap">{l.text || ' '}</span>
                    )}
                  </p>
                ))}

                {/* The input is sized to the text it holds - mono, so 1ch is exact -
                    and the block caret is positioned at `caret`ch within it, so it
                    tracks left/right, click, home/end, not just typing at the end. */}
                <form onSubmit={submit} className="flex flex-wrap items-baseline">
                  <label htmlFor="cmd" className="mr-2 shrink-0 text-flame">
                    {PROMPT}
                  </label>
                  <span className="relative inline-block shrink-0" style={{ width: `${value.length}ch` }}>
                    <input
                      id="cmd"
                      ref={inputRef}
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value)
                        syncCaret(e.target)
                      }}
                      onKeyDown={onKeyDown}
                      onSelect={(e) => syncCaret(e.currentTarget)}
                      onClick={(e) => syncCaret(e.currentTarget)}
                      autoComplete="off"
                      spellCheck={false}
                      aria-label="Terminal command input"
                      style={{ width: `${value.length}ch` }}
                      className="max-w-full bg-transparent text-paper caret-transparent outline-none"
                    />
                    <span
                      aria-hidden
                      className="animate-blink pointer-events-none absolute top-0 h-[1.15em] w-[1ch] bg-flame"
                      style={{ left: `${caret}ch` }}
                    />
                  </span>
                  {/* Ghost hint - only until the visitor has run something themselves. */}
                  {!value && history.length === 0 && (
                    <span className="ml-3 hidden text-muted-dark/70 select-none sm:inline">
                      type a command, or tap one below
                    </span>
                  )}
                </form>
              </div>

              {/* Tap targets, so the terminal works for anyone who will not type -
                  which on a phone is nearly everyone. */}
              <div className="flex flex-wrap items-center gap-2 border-t border-rule-dark px-4 py-3 sm:px-5">
                <span className="label mr-1 text-paper/40">Try</span>
                {SUGGESTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      execute(c)
                      inputRef.current?.focus()
                    }}
                    className="label border border-rule-dark px-2.5 py-1.5 text-paper/70 transition-colors hover:border-flame hover:text-flame"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Direct routes, for anyone who is not going to type. */}
          <Reveal delay={0.08} className="h-full">
            <div className="brackets flex h-full flex-col bg-card">
              <div className="flex items-baseline justify-between border-b b-rule px-5 py-2.5">
                <span className="label t-muted">Reach</span>
                <span className="label t-muted/60">Direct routes</span>
              </div>

              <div className="grid grid-cols-2 gap-px bg-[var(--zone-rule)]">
                <Magnetic className="h-full">
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex h-full items-center justify-center gap-2 bg-ink px-4 py-5 text-sm text-paper transition-colors hover:bg-flame"
                  >
                    Email me
                    <span className="label text-paper/50 transition-colors group-hover:text-paper/80">↗</span>
                  </a>
                </Magnetic>
                <Magnetic className="h-full">
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full items-center justify-center gap-2 bg-card px-4 py-5 text-sm transition-colors hover:text-flame"
                  >
                    Résumé
                    <span className="label t-muted transition-colors group-hover:text-flame">↗</span>
                  </a>
                </Magnetic>
              </div>

              {/* One flowing list instead of a separate dl/ul - flex-1 + justify-center
                  absorbs whatever slack the terminal's height leaves, as balance, not a gap. */}
              <div className="flex flex-1 flex-col justify-center divide-y divide-rule border-t b-rule">
                <div className="flex items-baseline justify-between gap-4 px-5 py-3.5 sm:px-6">
                  <span className="label t-muted">Mail</span>
                  <span className="font-mono text-xs break-all">{profile.email}</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 px-5 py-3.5 sm:px-6">
                  <span className="label t-muted">Phone</span>
                  <span className="font-mono text-xs">{profile.phone}</span>
                </div>
                {profile.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-baseline justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-ink sm:px-6"
                  >
                    <span className="label t-muted transition-colors group-hover:text-paper/60">{s.label}</span>
                    <span className="font-mono text-xs t-muted transition-colors group-hover:text-paper">
                      {s.handle} ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <footer className="border-t b-rule">
        <div className="mx-auto flex max-w-[104rem] flex-col justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6">
          <p className="label t-muted">
            {profile.name} · {profile.location}
          </p>
        </div>
      </footer>
    </section>
  )
}
