'use client'

import { use, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { MetricRow } from '@/components/MetricCard'
import { SolutionStatusCard } from '@/components/SolutionStatusCard'
import { ActivityTrail } from '@/components/ActivityTrail'
import { StatusPulse } from '@/components/StatusPulse'
import { ClientScopeBanner } from '@/components/ClientScopeBanner'
import { getDepartment } from '@/lib/mock/data'
import { useActiveClient } from '@/components/ClientProvider'
import type { Scope } from '@/lib/mock/types'

export default function DepartmentPage({ params }: { params: Promise<{ dept: string; locale: string }> }) {
  const { dept: deptSlug } = use(params)
  const t = useTranslations('dept')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const { clientId } = useActiveClient()
  const [scope, setScope] = useState<Scope | 'all'>('all')
  const dept = getDepartment(clientId, deptSlug)
  if (!dept) notFound()

  const filtered = scope === 'all' ? dept.solutions : dept.solutions.filter((s) => s.scope === scope)
  const scopeTabs: { key: Scope | 'all'; label: string }[] = [
    { key: 'all', label: t('scopeAll') },
    { key: 'delivery', label: t('scopeDelivery') },
    { key: 'internal', label: t('scopeInternal') }
  ]

  return (
    <PageShell
      breadcrumbs={[
        { label: tNav('operations') },
        { label: tNav('departments') },
        { label: dept.name[locale] }
      ]}
    >
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-10 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 text-xs font-medium text-accent">
          {t('eyebrow')}
          <span className="text-muted">·</span>
          <StatusPulse status={dept.status} />
        </div>
        <DisplayHeading size="lg" className="mt-3" locale={locale}>
          {dept.name[locale]}
        </DisplayHeading>
        <p className="text-base text-text-soft mt-3 leading-relaxed">{dept.contextLine[locale]}</p>
      </motion.header>

      <ClientScopeBanner className="mb-8" />

      <section className="mb-8 md:mb-10">
        <h2 className="text-sm font-semibold text-text mb-4">{t('kpiRow')}</h2>
        <MetricRow kpis={dept.kpis} locale={locale} />
      </section>

      <section className="mb-8 md:mb-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-text">{t('modules')}</h2>
          <div className="inline-flex items-center rounded-full border border-border bg-surface p-0.5" role="tablist" aria-label={t('scopeFilter')}>
            {scopeTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={scope === tab.key}
                onClick={() => setScope(tab.key)}
                className={clsx(
                  'rounded-full px-3 py-1 text-xs font-medium transition-all',
                  scope === tab.key ? 'bg-accent text-white shadow-soft' : 'text-text-soft hover:text-text'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((s, i) => (
            <SolutionStatusCard key={s.slug} deptSlug={dept.slug} solution={s} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-sm text-muted mt-4">{t('scopeEmpty')}</p>
        )}
      </section>

      <section>
        <ActivityTrail events={dept.activity} locale={locale} title={t('activity')} subtitle={t('activitySub')} maxHeight={420} />
      </section>
    </PageShell>
  )
}
