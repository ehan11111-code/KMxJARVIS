'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Sparkles } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { ClientScopeBanner } from '@/components/ClientScopeBanner'
import { Panel } from '@/components/Panel'
import { useActiveClient } from '@/components/ClientProvider'
import {
  getAdCampaigns,
  AD_PLATFORMS,
  AD_PLATFORM_LABEL,
  AD_PLATFORM_COLOR,
  JARVIS_AD_ACTION_LABEL,
  type AdPlatform,
  type AdStatus
} from '@/lib/mock/marketing'

const STATUS_STYLE: Record<AdStatus, string> = {
  active: 'bg-success/15 text-success border-success/30',
  learning: 'bg-accent/10 text-accent border-accent/30',
  paused: 'bg-bg-soft text-muted border-border'
}

function PlatformDot({ platform }: { platform: AdPlatform }) {
  return <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ background: AD_PLATFORM_COLOR[platform] }} aria-hidden />
}

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n)
const fmtSar = (n: number) => `SAR ${Math.round(n).toLocaleString('en-US')}`

export default function AdManagerPage() {
  const t = useTranslations('ads')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const { clientId } = useActiveClient()
  const [platform, setPlatform] = useState<AdPlatform | 'all'>('all')

  const { campaigns, summary, byPlatform } = getAdCampaigns(clientId)
  const rows = platform === 'all' ? campaigns : campaigns.filter((c) => c.platform === platform)
  const maxSpend = Math.max(...byPlatform.map((b) => b.spend), 1)

  const platformTabs: { key: AdPlatform | 'all'; label: string }[] = [
    { key: 'all', label: t('platformAll') },
    ...AD_PLATFORMS.map((p) => ({ key: p, label: AD_PLATFORM_LABEL[p][locale] }))
  ]

  const statusLabel: Record<AdStatus, string> = {
    active: t('stActive'),
    learning: t('stLearning'),
    paused: t('stPaused')
  }

  const summaryCards = [
    { label: t('sumSpend'), value: summary.spend, highlight: true },
    { label: t('sumConversions'), value: summary.conversions },
    { label: t('sumRoas'), value: summary.roas, highlight: true },
    { label: t('sumImpressions'), value: summary.impressions },
    { label: t('sumClicks'), value: summary.clicks },
    { label: t('sumActive'), value: `${summary.activeCampaigns}/${summary.totalCampaigns}` }
  ]

  return (
    <PageShell breadcrumbs={[{ label: tNav('workspace') }, { label: tNav('adManager') }]}>
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8 max-w-3xl"
      >
        <div className="text-xs font-medium text-accent">{t('eyebrow')}</div>
        <DisplayHeading size="lg" className="mt-2" locale={locale}>
          {t('headline')}
        </DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{t('subline')}</p>
      </motion.header>

      <ClientScopeBanner className="mb-6" />

      {/* summary */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
        {summaryCards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="rounded-soft border border-border bg-surface shadow-soft p-4 flex flex-col gap-1.5"
          >
            <div className="text-xs text-muted leading-tight">{c.label}</div>
            <div className={clsx('font-display font-semibold tabular-nums text-2xl leading-none tracking-tight', c.highlight ? 'text-accent' : 'text-text')}>
              {c.value}
            </div>
          </motion.div>
        ))}
      </section>

      {/* spend by platform */}
      <Panel title={t('byPlatform')} className="mb-6 md:mb-8">
        <div className="flex flex-col gap-3">
          {byPlatform.map((b) => (
            <div key={b.platform} className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 w-32 shrink-0 text-sm text-text">
                <PlatformDot platform={b.platform} />
                {AD_PLATFORM_LABEL[b.platform][locale]}
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-bg-soft overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(2, (b.spend / maxSpend) * 100)}%`, background: AD_PLATFORM_COLOR[b.platform] }}
                />
              </div>
              <span className="w-28 text-end text-sm text-text-soft tabular-nums shrink-0">{fmtSar(b.spend)}</span>
              <span className="w-12 text-end text-xs text-muted tabular-nums shrink-0">{b.share.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* platform filter */}
      <div className="inline-flex flex-wrap items-center rounded-full border border-border bg-surface p-0.5 mb-4">
        {platformTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setPlatform(tab.key)}
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-medium transition-all',
              platform === tab.key ? 'bg-accent text-white shadow-soft' : 'text-text-soft hover:text-text'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* campaigns table */}
      <Panel title={t('campaignsTitle')} subtitle={t('campaignsSub')} bodyClassName="px-0 pb-0">
        <div className="overflow-x-auto scrollbar-soft">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="text-start text-[11px] uppercase tracking-wider text-muted border-y border-border">
                <th className="font-medium text-start ps-5 md:ps-6 py-3">{t('colCampaign')}</th>
                <th className="font-medium text-start py-3">{t('colStatus')}</th>
                <th className="font-medium text-end py-3">{t('colSpend')}</th>
                <th className="font-medium text-end py-3">{t('colImpr')}</th>
                <th className="font-medium text-end py-3">{t('colClicks')}</th>
                <th className="font-medium text-end py-3">{t('colCtr')}</th>
                <th className="font-medium text-end py-3">{t('colCpc')}</th>
                <th className="font-medium text-end py-3">{t('colConv')}</th>
                <th className="font-medium text-end py-3">{t('colRoas')}</th>
                <th className="font-medium text-start py-3 pe-5 md:pe-6">{t('colJarvis')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-border/70 hover:bg-bg-soft/50 transition-colors">
                  <td className="ps-5 md:ps-6 py-3 max-w-[280px]">
                    <div className="flex items-center gap-2">
                      <PlatformDot platform={c.platform} />
                      <span className="text-text truncate">{c.name[locale]}</span>
                    </div>
                    <div className="text-xs text-muted mt-0.5">{c.objective[locale]} · {AD_PLATFORM_LABEL[c.platform][locale]}</div>
                  </td>
                  <td className="py-3">
                    <span className={clsx('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', STATUS_STYLE[c.status])}>
                      {statusLabel[c.status]}
                    </span>
                  </td>
                  <td className="py-3 text-end tabular-nums text-text">{fmtSar(c.spend)}</td>
                  <td className="py-3 text-end tabular-nums text-text-soft">{fmt(c.impressions)}</td>
                  <td className="py-3 text-end tabular-nums text-text-soft">{fmt(c.clicks)}</td>
                  <td className="py-3 text-end tabular-nums text-text-soft">{c.ctr}%</td>
                  <td className="py-3 text-end tabular-nums text-text-soft">SAR {c.cpc}</td>
                  <td className="py-3 text-end tabular-nums text-text-soft">{fmt(c.conversions)}</td>
                  <td className={clsx('py-3 text-end tabular-nums font-semibold', c.roas >= 3 ? 'text-success' : c.roas >= 2 ? 'text-text' : 'text-accent')}>
                    {c.roas}×
                  </td>
                  <td className="py-3 pe-5 md:pe-6">
                    {c.jarvisAction === 'none' ? (
                      <span className="text-muted">—</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent whitespace-nowrap">
                        <Sparkles className="h-3 w-3" strokeWidth={2} />
                        {JARVIS_AD_ACTION_LABEL[c.jarvisAction][locale]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <p className="text-xs text-muted mt-4">{t('note')}</p>
    </PageShell>
  )
}
