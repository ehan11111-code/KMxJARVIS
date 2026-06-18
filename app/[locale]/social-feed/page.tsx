'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Instagram, Linkedin, Twitter, Music2, Ghost, Heart, MessageCircle, Repeat2, Eye, Clock, Sparkles, Image as ImageIcon, Film, Layers as LayersIcon, Type as TypeIcon } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { DisplayHeading } from '@/components/DisplayHeading'
import { ClientScopeBanner } from '@/components/ClientScopeBanner'
import { useActiveClient } from '@/components/ClientProvider'
import {
  getSocialPosts,
  SOCIAL_PLATFORMS,
  PLATFORM_LABEL,
  PLATFORM_COLOR,
  type SocialPlatform,
  type SocialPost
} from '@/lib/mock/marketing'

const PLATFORM_ICON: Record<SocialPlatform, typeof Instagram> = {
  instagram: Instagram,
  x: Twitter,
  linkedin: Linkedin,
  tiktok: Music2,
  snapchat: Ghost
}
const MEDIA_ICON = { image: ImageIcon, video: Film, carousel: LayersIcon, text: TypeIcon }

function PlatformChip({ platform }: { platform: SocialPlatform }) {
  const locale = useLocale() as 'en' | 'ar'
  const Icon = PLATFORM_ICON[platform]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text">
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border"
        style={{ color: PLATFORM_COLOR[platform] }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
      </span>
      {PLATFORM_LABEL[platform][locale]}
    </span>
  )
}

function Metric({ icon: Icon, value }: { icon: typeof Heart; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted tabular-nums">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
      {value}
    </span>
  )
}

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n)

function PostCard({ post, index }: { post: SocialPost; index: number }) {
  const locale = useLocale() as 'en' | 'ar'
  const t = useTranslations('social')
  const MediaIcon = MEDIA_ICON[post.mediaType]
  const scheduled = post.status === 'scheduled'

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col rounded-soft border border-border bg-surface shadow-soft overflow-hidden"
    >
      <header className="flex items-center gap-3 px-4 pt-4">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg-soft text-xs font-semibold text-text-soft shrink-0"
          aria-hidden
        >
          {post.handle.replace('@', '').slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-text truncate">{post.clientName[locale]}</div>
          <div className="text-xs text-muted truncate">{post.handle}</div>
        </div>
        <PlatformChip platform={post.platform} />
      </header>

      {/* media placeholder — keeps the familiar post shape without external imagery */}
      <div className="mx-4 mt-3 rounded-soft border border-border bg-bg-soft aspect-[16/10] flex items-center justify-center relative overflow-hidden">
        <MediaIcon className="h-9 w-9 text-muted/50" strokeWidth={1.4} />
        <span className="absolute bottom-2 end-2 text-[10px] font-medium uppercase tracking-wider text-muted/70">
          {post.platform}
        </span>
      </div>

      <div className="px-4 py-3 flex-1 flex flex-col">
        <p className="text-sm text-text leading-relaxed line-clamp-3">{post.caption[locale]}</p>
        <p className="text-xs text-accent mt-2 line-clamp-1" dir="ltr">
          {post.hashtags.join('  ')}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-border mt-3">
          {scheduled ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
              {t('scheduled')} · {post.when[locale]}
            </span>
          ) : (
            <div className="flex items-center gap-3">
              <Metric icon={Heart} value={fmt(post.metrics.likes)} />
              <Metric icon={MessageCircle} value={fmt(post.metrics.comments)} />
              <Metric icon={Repeat2} value={fmt(post.metrics.shares)} />
            </div>
          )}
          <span className="text-xs text-muted">{scheduled ? '' : post.when[locale]}</span>
        </div>

        {!scheduled && (
          <div className="flex items-center justify-between gap-2 mt-2.5">
            <Metric icon={Eye} value={`${fmt(post.metrics.reach)} ${t('reach')}`} />
            <span className="text-xs text-muted tabular-nums">
              {post.metrics.engagement}% {t('engagement')}
            </span>
          </div>
        )}

        {post.autoByJarvis && (
          <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
            <Sparkles className="h-3 w-3" strokeWidth={2} />
            {t('autoBadge')}
          </span>
        )}
      </div>
    </motion.article>
  )
}

export default function SocialFeedPage() {
  const t = useTranslations('social')
  const tNav = useTranslations('nav')
  const locale = useLocale() as 'en' | 'ar'
  const { clientId } = useActiveClient()
  const [platform, setPlatform] = useState<SocialPlatform | 'all'>('all')
  const [status, setStatus] = useState<'all' | 'published' | 'scheduled'>('all')

  const posts = getSocialPosts(clientId).filter(
    (p) => (platform === 'all' || p.platform === platform) && (status === 'all' || p.status === status)
  )

  const platformTabs: { key: SocialPlatform | 'all'; label: string }[] = [
    { key: 'all', label: t('platformAll') },
    ...SOCIAL_PLATFORMS.map((p) => ({ key: p, label: PLATFORM_LABEL[p][locale] }))
  ]
  const statusTabs: { key: 'all' | 'published' | 'scheduled'; label: string }[] = [
    { key: 'all', label: t('statusAll') },
    { key: 'published', label: t('published') },
    { key: 'scheduled', label: t('scheduled') }
  ]

  return (
    <PageShell breadcrumbs={[{ label: tNav('workspace') }, { label: tNav('socialFeed') }]}>
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

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="inline-flex flex-wrap items-center rounded-full border border-border bg-surface p-0.5">
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
        <div className="inline-flex items-center rounded-full border border-border bg-surface p-0.5 ms-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatus(tab.key)}
              className={clsx(
                'rounded-full px-3 py-1 text-xs font-medium transition-all',
                status === tab.key ? 'bg-accent text-white shadow-soft' : 'text-text-soft hover:text-text'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted">{t('empty')}</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {posts.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} />
          ))}
        </section>
      )}
    </PageShell>
  )
}
