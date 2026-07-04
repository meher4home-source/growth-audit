'use client'

import { useState, FormEvent } from 'react'

type ScoreSet = {
  performance: number
  seo: number
  accessibility: number
  bestPractices: number
}

type ReportResult = {
  url: string
  scores: ScoreSet
  issues: string[]
  revenueImpact: { label: string; low: number; high: number }
  aiSummary: string
}

export default function ScanTool() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<ReportResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function runScan(e: FormEvent) {
    e.preventDefault()
    if (!url) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Scan failed. Check the URL and try again.')
      }
      setResult(data)
      setStatus('done')
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <div className="w-full max-w-xl">
      {status !== 'done' && (
        <form onSubmit={runScan} className="rounded-lg border border-hairline bg-panel p-6">
          <label className="mb-2 block font-mono text-sm text-muted">WEBSITE URL</label>
          <input
            type="text"
            required
            placeholder="yourbusiness.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded border border-hairline bg-ink px-4 py-3 font-mono text-fg placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <label className="mb-2 mt-4 block font-mono text-sm text-muted">
            EMAIL (to receive your report)
          </label>
          <input
            type="email"
            required
            placeholder="you@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-hairline bg-ink px-4 py-3 font-mono text-fg placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="mt-5 w-full rounded bg-gold px-6 py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60"
          >
            {status === 'loading' ? 'Scanning…' : 'Run Free Scan'}
          </button>
          {status === 'error' && <p className="mt-3 text-sm text-red">{errorMsg}</p>}
        </form>
      )}

      {status === 'loading' && (
        <div className="relative mt-6 h-32 overflow-hidden rounded-lg border border-hairline bg-panel">
          <div className="scan-line absolute left-0 right-0 h-1 bg-gold/70 shadow-[0_0_20px_2px_rgba(232,163,61,0.6)]" />
          <div className="flex h-full items-center justify-center font-mono text-sm text-muted">
            Reading {url || 'your site'}…
          </div>
        </div>
      )}

      {status === 'done' && result && (
        <div className="rounded-lg border border-hairline bg-panel p-6">
          <p className="font-mono text-xs text-muted">REPORT FOR {result.url}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ScoreDial label="Speed" value={result.scores.performance} />
            <ScoreDial label="Search" value={result.scores.seo} />
            <ScoreDial label="Access." value={result.scores.accessibility} />
            <ScoreDial label="Trust" value={result.scores.bestPractices} />
          </div>

          <div className="mt-6 rounded border border-gold/30 bg-gold/10 p-4">
            <p className="font-mono text-xs text-gold">ESTIMATED MONTHLY IMPACT</p>
            <p className="mt-1 text-2xl font-semibold">
              ${result.revenueImpact.low.toLocaleString()}–${result.revenueImpact.high.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted">{result.revenueImpact.label}</p>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-fg/90">{result.aiSummary}</p>

          {result.issues.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-muted">
              {result.issues.map((issue, i) => (
                <li key={i}>— {issue}</li>
              ))}
            </ul>
          )}

          <a
            href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '#pricing'}
            className="mt-6 block w-full rounded bg-gold px-6 py-3 text-center font-semibold text-ink transition hover:brightness-110"
          >
            Fix This For $1,997
          </a>
          <p className="mt-3 text-center text-xs text-muted">
            Estimates are illustrative, based on published page-speed and conversion research —
            not a guarantee of your specific results.
          </p>
        </div>
      )}
    </div>
  )
}

function ScoreDial({ label, value }: { label: string; value: number }) {
  const color = value >= 90 ? 'text-teal' : value >= 50 ? 'text-gold' : 'text-red'
  return (
    <div className="rounded border border-hairline bg-ink p-3 text-center">
      <p className={`font-mono text-xl font-semibold ${color}`}>{value}</p>
      <p className="mt-1 text-[11px] text-muted">{label}</p>
    </div>
  )
}
