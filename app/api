import { NextRequest, NextResponse } from 'next/server'
import { estimateRevenueImpact } from '@/lib/scoring'

function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

async function runPageSpeed(targetUrl: string) {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY
  const categories = ['performance', 'seo', 'accessibility', 'best-practices']
  const params = new URLSearchParams({ url: targetUrl, strategy: 'mobile' })
  categories.forEach((c) => params.append('category', c))
  if (apiKey) params.set('key', apiKey)

  const res = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`PageSpeed check failed (${res.status}). ${body.slice(0, 200)}`)
  }
  return res.json()
}

function extractScores(data: any) {
  const cats = data?.lighthouseResult?.categories || {}
  const toScore = (v: any) => Math.round((v?.score ?? 0) * 100)
  return {
    performance: toScore(cats.performance),
    seo: toScore(cats.seo),
    accessibility: toScore(cats.accessibility),
    bestPractices: toScore(cats['best-practices']),
  }
}

function extractIssues(data: any): string[] {
  const audits = data?.lighthouseResult?.audits || {}
  const candidates = [
    'largest-contentful-paint',
    'total-blocking-time',
    'cumulative-layout-shift',
    'uses-responsive-images',
    'viewport',
    'meta-description',
    'is-crawlable',
  ]
  const issues: string[] = []
  for (const key of candidates) {
    const audit = audits[key]
    if (audit && typeof audit.score === 'number' && audit.score < 0.9 && audit.title) {
      issues.push(audit.title)
    }
    if (issues.length >= 4) break
  }
  return issues
}

async function generateSummary(params: {
  url: string
  scores: ReturnType<typeof extractScores>
  issues: string[]
  impact: ReturnType<typeof estimateRevenueImpact>
}) {
  const apiKey = process.env.NVIDIA_API_KEY
  const fallback = `Your site scores ${params.scores.performance}/100 on speed and ${params.scores.seo}/100 on search visibility. ${params.impact.label} Fixing the issues below is usually a 1-2 week project.`

  if (!apiKey) return fallback

  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct',
        max_tokens: 220,
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content:
              'You write short, plain-English website audit summaries for small business owners. No jargon. No invented numbers — only use the figures given to you. 90-120 words, warm but direct tone.',
          },
          {
            role: 'user',
            content: `Website: ${params.url}
Speed score: ${params.scores.performance}/100
Search score: ${params.scores.seo}/100
Accessibility score: ${params.scores.accessibility}/100
Trust/best-practices score: ${params.scores.bestPractices}/100
Top issues: ${params.issues.join('; ') || 'none major'}
Estimated monthly impact range: $${params.impact.low}-$${params.impact.high}
Impact note: ${params.impact.label}

Write the summary now.`,
          },
        ],
      }),
    })
    if (!res.ok) return fallback
    const data = await res.json()
    return data?.choices?.[0]?.message?.content?.trim() || fallback
  } catch {
    return fallback
  }
}

async function notifyLead(params: { url: string; email: string; scores: any; impact: any }) {
  const resendKey = process.env.RESEND_API_KEY
  const notifyTo = process.env.NOTIFY_EMAIL
  if (!resendKey || !notifyTo) return

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || 'leads@yourdomain.com',
        to: notifyTo,
        subject: `New scan: ${params.url}`,
        text: `New lead ran a scan.

Website: ${params.url}
Email: ${params.email}
Speed: ${params.scores.performance}
SEO: ${params.scores.seo}
Estimated impact: $${params.impact.low}-$${params.impact.high}
`,
      }),
    })
  } catch {
    // Non-blocking — a failed notification should never break the report response.
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rawUrl = body?.url
    const email = body?.email || ''
    if (!rawUrl || typeof rawUrl !== 'string') {
      return NextResponse.json({ error: 'A website URL is required.' }, { status: 400 })
    }

    const targetUrl = normalizeUrl(rawUrl)
    const pagespeedData = await runPageSpeed(targetUrl)
    const scores = extractScores(pagespeedData)
    const issues = extractIssues(pagespeedData)
    const impact = estimateRevenueImpact(scores.performance, scores.seo)
    const aiSummary = await generateSummary({ url: targetUrl, scores, issues, impact })

    notifyLead({ url: targetUrl, email, scores, impact })

    return NextResponse.json({
      url: targetUrl,
      scores,
      issues,
      revenueImpact: impact,
      aiSummary,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Could not complete the scan. Double check the URL and try again.' },
      { status: 500 }
    )
  }
}
