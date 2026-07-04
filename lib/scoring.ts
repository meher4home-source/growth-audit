export type RevenueImpact = { label: string; low: number; high: number }

/**
 * Buckets a combined performance/SEO score into an illustrative monthly
 * revenue-impact range. This is intentionally rule-based (not AI-generated)
 * so every dollar figure shown to a visitor is controlled and auditable —
 * never invented by a language model.
 */
export function estimateRevenueImpact(performance: number, seo: number): RevenueImpact {
  const combined = (performance + seo) / 2

  if (combined >= 90) {
    return {
      label: 'Your site is technically healthy — most competitors in your space are not.',
      low: 0,
      high: 300,
    }
  }
  if (combined >= 70) {
    return {
      label: 'Moderate friction is likely costing you visitors before they convert.',
      low: 500,
      high: 1500,
    }
  }
  if (combined >= 50) {
    return {
      label: 'Meaningful speed and visibility gaps are turning away potential customers.',
      low: 1500,
      high: 3500,
    }
  }
  return {
    label: 'Significant issues are likely costing you a large share of potential customers.',
    low: 3500,
    high: 8000,
  }
}
