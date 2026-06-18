'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { CheckCircle2, CircleDot, Clock, Eye } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { ClientScopeBanner } from '@/components/ClientScopeBanner'
import { Panel } from '@/components/Panel'
import { useActiveClient } from '@/components/ClientProvider'
import { getClient, ALL_CLIENTS_ID } from '@/lib/client'
import {
  getTeam,
  memberById,
  TASK_COLUMNS,
  TASK_STATUS_LABEL,
  type TaskStatus,
  type TeamMember
} from '@/lib/mock/marketing'

const PRESENCE_STYLE: Record<TeamMember['presence'], string> = {
  online: 'bg-success',
  busy: 'bg-accent',
  off: 'bg-muted/50'
}
const COLUMN_ICON: Record<TaskStatus, typeof Clock> = {
  todo: CircleDot,
  in_progress: Clock,
  review: Eye,
  done: CheckCircle2
}

function Avatar({ initials, presence }: { initials: string; presence?: TeamMember['presence'] }) {
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg-soft text-xs font-semibold text-text-soft shrink-0">
      {initials}
      {presence && (
        <span className={clsx('absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface', PRESENCE_STYLE[presence])} aria-hidden />
      )}
    </span>
  )
}

export default function TeamPage() {
  const t = useTranslations('team')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const { clientId } = useActiveClient()
  const isAll = clientId === ALL_CLIENTS_ID

  const { members, tasks, accomplishments, stats } = getTeam(clientId)

  const stat = [
    { label: t('statPeople'), value: String(stats.people) },
    { label: t('statActive'), value: String(stats.activeTasks), highlight: true },
    { label: t('statDone'), value: String(stats.doneThisWeek), highlight: true },
    { label: t('statUtil'), value: `${stats.avgUtilization}%` }
  ]

  return (
    <PageShell breadcrumbs={[{ label: tNav('workspace') }, { label: tNav('team') }]}>
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

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stat.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="rounded-soft border border-border bg-surface shadow-soft p-4 flex flex-col gap-1.5"
          >
            <div className="text-xs text-muted leading-tight">{s.label}</div>
            <div className={clsx('font-display font-semibold tabular-nums text-2xl md:text-[1.7rem] leading-none tracking-tight', s.highlight ? 'text-accent' : 'text-text')}>
              {s.value}
            </div>
          </motion.div>
        ))}
      </section>

      {/* who runs this client */}
      <Panel title={isAll ? t('whoTitleAll') : t('whoTitle')} subtitle={t('whoSub')} className="mb-6 md:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div key={m.id} className="rounded-soft border border-border bg-bg-soft/40 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar initials={m.initials} presence={m.presence} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text truncate">{m.name[locale]}</div>
                  <div className="text-xs text-muted truncate">{m.role[locale]}</div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted">{t('utilization')}</span>
                  <span className="text-text-soft tabular-nums">{m.utilization}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div className={clsx('h-full rounded-full', m.utilization >= 90 ? 'bg-accent' : 'bg-success')} style={{ width: `${m.utilization}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-muted me-1">{t('handles')}:</span>
                {m.clientIds.slice(0, isAll ? 4 : m.clientIds.length).map((cid) => (
                  <span key={cid} className="inline-flex items-center rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] text-text-soft">
                    {getClient(cid).name[locale]}
                  </span>
                ))}
                {isAll && m.clientIds.length > 4 && (
                  <span className="text-[11px] text-muted">+{m.clientIds.length - 4}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* task board */}
      <Panel title={t('boardTitle')} subtitle={t('boardSub')} className="mb-6 md:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TASK_COLUMNS.map((col) => {
            const Icon = COLUMN_ICON[col]
            const colTasks = tasks.filter((tk) => tk.status === col)
            return (
              <div key={col} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-text-soft">
                  <Icon className={clsx('h-4 w-4', col === 'done' ? 'text-success' : col === 'review' ? 'text-accent' : 'text-muted')} strokeWidth={1.8} />
                  {TASK_STATUS_LABEL[col][locale]}
                  <span className="ms-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-bg-soft px-1.5 text-[11px] text-muted">
                    {colTasks.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {colTasks.length === 0 ? (
                    <p className="text-xs text-muted px-1 py-3">{t('empty')}</p>
                  ) : (
                    colTasks.map((tk) => {
                      const m = members.find((x) => x.id === tk.memberId) ?? memberById(tk.memberId)
                      const initials = (m as TeamMember | undefined)?.initials ?? '··'
                      return (
                        <div key={tk.id} className="rounded-soft border border-border bg-surface p-3 shadow-soft">
                          <p className="text-sm text-text leading-snug">{tk.title[locale]}</p>
                          <div className="mt-2.5 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-bg-soft text-[9px] font-semibold text-text-soft" aria-hidden>
                                {initials}
                              </span>
                              {!isAll && (
                                <span className="text-[11px] text-muted truncate max-w-[90px]">{(m as TeamMember | undefined)?.name[locale]}</span>
                              )}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                              <Clock className="h-3 w-3" strokeWidth={1.7} />
                              {tk.due[locale]}
                            </span>
                          </div>
                          {isAll && (
                            <span className="mt-2 inline-flex items-center rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[10px] text-text-soft">
                              {getClient(tk.clientId).name[locale]}
                            </span>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      {/* accomplishments */}
      <Panel title={t('accTitle')} subtitle={t('accSub')}>
        <ul className="flex flex-col divide-y divide-border">
          {accomplishments.map((a) => {
            const m = members.find((x) => x.id === a.memberId) ?? (memberById(a.memberId) as TeamMember | undefined)
            return (
              <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" strokeWidth={1.9} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text leading-snug">{a.text[locale]}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
                    <span>{m?.name[locale]}</span>
                    <span>·</span>
                    <span>{getClient(a.clientId).name[locale]}</span>
                    <span>·</span>
                    <span>{a.when[locale]}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Panel>
    </PageShell>
  )
}
