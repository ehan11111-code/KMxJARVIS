'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { clsx } from 'clsx'
import { Check, ChevronDown, Users } from 'lucide-react'
import { CLIENTS, ALL_CLIENTS_ID } from '@/lib/client'
import { useActiveClient } from './ClientProvider'

export function ClientSwitcher() {
  const locale = useLocale() as 'en' | 'ar'
  const { clientId, setClientId } = useActiveClient()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const active = CLIENTS.find((c) => c.id === clientId) ?? CLIENTS[0]

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface hover:bg-surface-elev px-3 py-1.5 transition-colors max-w-[200px]"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={locale === 'ar' ? 'تبديل العميل' : 'Switch client'}
      >
        <Users className="h-3.5 w-3.5 text-accent shrink-0" strokeWidth={1.7} />
        <span className="text-xs font-medium text-text truncate">{active.name[locale]}</span>
        <ChevronDown className={clsx('h-3.5 w-3.5 text-muted shrink-0 transition-transform', open && 'rotate-180')} strokeWidth={1.6} />
      </button>

      {open && (
        <div
          role="listbox"
          className={clsx(
            'absolute z-50 mt-2 w-64 rounded-soft border border-border bg-surface shadow-float p-1.5 max-h-[70vh] overflow-y-auto scrollbar-soft',
            locale === 'ar' ? 'start-0' : 'end-0'
          )}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            {locale === 'ar' ? 'مساحة عمل العميل' : 'Client workspace'}
          </div>
          {CLIENTS.map((c) => {
            const isActive = c.id === clientId
            const isAll = c.id === ALL_CLIENTS_ID
            return (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setClientId(c.id)
                  setOpen(false)
                }}
                className={clsx(
                  'w-full flex items-center gap-2.5 rounded px-2.5 py-2 text-start transition-colors',
                  isActive ? 'bg-bg-soft' : 'hover:bg-bg-soft/60',
                  isAll && 'border-b border-border mb-1'
                )}
              >
                <span className={clsx('inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold', isActive ? 'bg-accent text-white' : 'bg-bg-soft text-text-soft')}>
                  {isAll ? '∑' : c.name.en.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-text truncate">{c.name[locale]}</span>
                  <span className="block text-[10px] text-muted truncate">{c.sector[locale]}</span>
                </span>
                {isActive && <Check className="h-3.5 w-3.5 text-accent shrink-0" strokeWidth={2} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
