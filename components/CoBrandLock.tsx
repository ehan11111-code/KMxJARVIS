import { clsx } from 'clsx'
import { BrandLogo } from './BrandLogo'

/**
 * Co-branding lockup: JARVIS mark/wordmark × Kattan Media.
 * The Kattan Media side uses the supplied "KM" signature logo. It is black
 * artwork on transparency, so `.km-logo` (in globals.css) inverts it to white
 * on the dark theme and leaves it black on the light theme.
 */
export function CoBrandLock({
  size = 'md',
  className
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const h = size === 'lg' ? 'h-10' : size === 'sm' ? 'h-6' : 'h-8'
  return (
    <div className={clsx('inline-flex items-center gap-3', className)} aria-label="JARVIS × Kattan Media">
      <BrandLogo size={size} />
      <span className="text-muted/60 text-lg font-light select-none" aria-hidden>
        ×
      </span>
      <KattanLogo className={h} />
    </div>
  )
}

/** The Kattan Media "KM" signature mark. Inherits white/black via the .km-logo theme rule. */
export function KattanLogo({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/assets/kattan-media-logo.svg" alt="Kattan Media" className={clsx('km-logo w-auto', className)} />
}

/** Typographic fallback wordmark (kept for places that prefer text). */
export function KattanWordmark({ className }: { className?: string }) {
  return (
    <span
      dir="rtl"
      className={clsx('font-display font-semibold tracking-tight leading-none text-text', className)}
    >
      قطان<span className="text-accent ms-1.5">ميديا</span>
    </span>
  )
}
