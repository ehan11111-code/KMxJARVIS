'use client'

import { useLocale, useTranslations } from 'next-intl'
import { clsx } from 'clsx'
import { Layers, Users } from 'lucide-react'
import { getClient, ALL_CLIENTS_ID } from '@/lib/client'
import { useActiveClient } from './ClientProvider'

/**
 * Thin band that makes the active client workspace explicit on every scoped page.
 * For "All Clients" it reads as the agency-wide rollup; for a specific client it
 * names the account and its sector.
 */
export function ClientScopeBanner({ className }: { className?: string }) {
  const locale = useLocale() as 'en' | 'ar'
  const t = useTranslations('client')
  const { clientId } = useActiveClient()
  const client = getClient(clientId)
  const isAll = client.id === ALL_CLIENTS_ID

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center gap-x-4 gap-y-2 rounded-soft border bg-surface px-4 py-3 shadow-soft',
        isAll ? 'border-border' : 'border-accent/40',
        className
      )}
    >
      <span className="inline-flex items-center gap-2">
        <span className={clsx('inline-flex h-7 w-7 items-center justify-center rounded-full', isAll ? 'bg-bg-soft text-text-soft' : 'bg-accent/15 text-accent')}>
          {isAll ? <Layers className="h-4 w-4" strokeWidth={1.7} /> : <Users className="h-4 w-4" strokeWidth={1.7} />}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          {isAll ? t('rollupLabel') : t('workspaceLabel')}
        </span>
      </span>
      <span className="flex items-baseline gap-2 min-w-0">
        <span className="text-sm font-semibold text-text truncate">{client.name[locale]}</span>
        <span className="text-xs text-muted truncate">· {client.sector[locale]}</span>
      </span>
      <span className="ms-auto text-xs text-muted hidden sm:block">
        {isAll ? t('rollupHint') : t('workspaceHint')}
      </span>
    </div>
  )
}
