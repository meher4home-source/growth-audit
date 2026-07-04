import ScanTool from '@/components/ScanTool'

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany']

const checks = [
  {
    title: 'Speed',
    body: 'How long a visitor waits before your page is usable — the single biggest driver of who leaves before buying.',
  },
  {
    title: 'Search Visibility',
    body: 'Whether Google can read and rank your pages, so new customers can find you at all.',
  },
  {
    title: 'Trust Signals',
    body: 'Security, structure, and technical basics that tell a visitor — and Google — your business is legitimate.',
  },
  {
    title: 'Mobile Experience',
    body: 'Most local customers arrive on a phone first. We check whether your site actually works there.',
  },
]

const steps = [
  { n: '01', title: 'Enter your website', body: 'Paste your URL and email. No account, no card required.' },
  {
    n: '02',
    title: 'We scan it live',
    body: 'The same engine Google uses to grade page experience runs against your site in real time.',
  },
  {
    n: '03',
    title: 'You get the report',
    body: "Plain-English findings and a dollar estimate of what it's costing you — free.",
  },
]

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-mono text-xs tracking-widest text-gold">FREE WEBSITE DIAGNOSTIC</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-fg sm:text-6xl">
            Your website is losing you customers.
            <span className="text-muted"> Here&apos;s the proof.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Run a free, 30-second scan and see exactly what&apos;s costing you sales — with a
            plain-English report, not jargon.
          </p>
          <p className="mt-4 text-sm text-muted">
            Built for small business owners in {countries.slice(0, -1).join(', ')}, and{' '}
            {countries[countries.length - 1]}.
          </p>
        </div>
        <ScanTool />
      </section>

      <section className="border-t border-hairline bg-panel/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs tracking-widest text-gold">WHAT WE CHECK</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {checks.map((c) => (
              <div key={c.title} className="rounded-lg border border-hairline bg-ink p-5">
                <h3 className="font-display text-2xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs tracking-widest text-gold">HOW IT WORKS</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <p className="font-mono text-sm text-muted">{s.n}</p>
                <h3 className="mt-2 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-hairline bg-panel/40 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-mono text-xs tracking-widest text-gold">THE FIX</p>
          <h2 className="mt-4 font-display text-4xl">One flat fee. No retainer required.</h2>
          <p className="mt-4 text-muted">
            We fix the speed, search, and trust issues your scan finds — done for you, typically
            within 10 business days.
          </p>
          <p className="mt-8 font-mono text-5xl text-fg">$1,997</p>
          <a
            href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#'}
            className="mt-8 inline-block rounded bg-gold px-8 py-4 font-semibold text-ink transition hover:brightness-110"
          >
            Get Started
          </a>
        </div>
      </section>

      <footer className="border-t border-hairline py-10">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Website Growth Audit. Estimates shown are illustrative and
          based on published industry research, not guarantees.
        </div>
      </footer>
    </main>
  )
}
