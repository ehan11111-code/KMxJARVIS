import type { Bi } from './types'
import { CLIENTS, getClient, ALL_CLIENTS_ID, type ClientSeed } from '../client'

/**
 * Deterministic demo data for the three "familiar" demonstration surfaces that
 * sit on top of the JARVIS operating layer:
 *   1. Social Feed   — the posts JARVIS schedules & publishes (Instagram / X / LinkedIn / TikTok / Snapchat)
 *   2. Ad Manager    — every client's ad accounts (Meta / Google / TikTok / Snapchat / X) unified in one console
 *   3. The Team      — who runs each client, what they're working on, and what they've shipped
 *
 * Everything is seeded from `client:surface:index` so a given client always reads
 * the same numbers, and "All Clients" rolls the whole portfolio up.
 */

// ── seeded PRNG (same family as data.ts, kept local to avoid coupling) ──────────
function mulberry32(seed: number) {
  let t = seed >>> 0
  return function () {
    t += 0x6d2b79f5
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}
function hashString(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return h
}
const seeded = (key: string) => mulberry32(hashString(key))
const pick = <T>(r: () => number, arr: T[]): T => arr[Math.floor(r() * arr.length)]
const intIn = (r: () => number, lo: number, hi: number) => Math.round(lo + r() * (hi - lo))
const REAL_CLIENTS = CLIENTS.filter((c) => c.id !== ALL_CLIENTS_ID)

function whenAgo(min: number): Bi {
  if (min < 60) return { en: `${min}m ago`, ar: `قبل ${min} د` }
  if (min < 60 * 24) return { en: `${Math.round(min / 60)}h ago`, ar: `قبل ${Math.round(min / 60)} س` }
  return { en: `${Math.round(min / 1440)}d ago`, ar: `قبل ${Math.round(min / 1440)} ي` }
}
function whenIn(min: number): Bi {
  if (min < 60) return { en: `in ${min}m`, ar: `بعد ${min} د` }
  if (min < 60 * 24) return { en: `in ${Math.round(min / 60)}h`, ar: `بعد ${Math.round(min / 60)} س` }
  return { en: `in ${Math.round(min / 1440)}d`, ar: `بعد ${Math.round(min / 1440)} ي` }
}
const fmtCompact = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(Math.round(n))
}
const fmtSar = (n: number): string => `SAR ${Math.round(n).toLocaleString('en-US')}`

// ════════════════════════════════════════════════════════════════════════════
// 1 · SOCIAL FEED
// ════════════════════════════════════════════════════════════════════════════

export type SocialPlatform = 'instagram' | 'x' | 'linkedin' | 'tiktok' | 'snapchat'
export const SOCIAL_PLATFORMS: SocialPlatform[] = ['instagram', 'x', 'linkedin', 'tiktok', 'snapchat']

export const PLATFORM_LABEL: Record<SocialPlatform, Bi> = {
  instagram: { en: 'Instagram', ar: 'إنستغرام' },
  x: { en: 'X', ar: 'إكس' },
  linkedin: { en: 'LinkedIn', ar: 'لينكدإن' },
  tiktok: { en: 'TikTok', ar: 'تيك توك' },
  snapchat: { en: 'Snapchat', ar: 'سناب شات' }
}
/** Brand-recognizable accent per platform — used only on the small platform chip. */
export const PLATFORM_COLOR: Record<SocialPlatform, string> = {
  instagram: '#E1306C',
  x: '#E7E9EA',
  linkedin: '#0A66C2',
  tiktok: '#25F4EE',
  snapchat: '#FFFC00'
}

export type SocialPost = {
  id: string
  platform: SocialPlatform
  clientId: string
  clientName: Bi
  handle: string
  caption: Bi
  hashtags: string[]
  mediaType: 'image' | 'video' | 'carousel' | 'text'
  status: 'published' | 'scheduled'
  autoByJarvis: boolean
  when: Bi
  metrics: { likes: number; comments: number; shares: number; reach: number; engagement: number }
}

type SocialMeta = { handle: string; captions: Bi[]; tags: string[] }

const CLIENT_SOCIAL: Record<string, SocialMeta> = {
  stc: {
    handle: '@stc',
    tags: ['#stc', '#نعمل_لمستقبل', '#الجيل_الخامس'],
    captions: [
      { en: 'The next generation of connectivity is here. The fastest stc network takes you beyond limits.', ar: 'الجيل الجديد من الاتصال هنا. شبكة stc الأسرع تنقلك إلى عالمٍ بلا حدود.' },
      { en: "From the heart of Riyadh to the world — powering the Kingdom's digital future.", ar: 'من قلب الرياض إلى العالم — نُمكّن المستقبل الرقمي للمملكة.' },
      { en: 'The new stc plan: unlimited, starting today.', ar: 'باقة stc الجديدة: بلا حدود، تبدأ اليوم.' }
    ]
  },
  mercedes: {
    handle: '@mercedesbenz_sa',
    tags: ['#مرسيدس_بنز', '#الفخامة', '#MercedesBenz'],
    captions: [
      { en: 'Luxury, redefined. The all-new Mercedes-Benz arrives in the Kingdom.', ar: 'الفخامة تُعاد تعريفها. مرسيدس-بنز الجديدة كليًا تصل إلى المملكة.' },
      { en: 'An unforgettable drive — book your test drive today.', ar: 'تجربة قيادة لا تُنسى — احجز تجربتك اليوم.' },
      { en: 'Where performance meets elegance.', ar: 'حين يلتقي الأداء بالأناقة.' }
    ]
  },
  saudia: {
    handle: '@saudia',
    tags: ['#الخطوط_السعودية', '#Saudia', '#وجهتك'],
    captions: [
      { en: 'Discover the world with Saudia — new destinations await.', ar: 'اكتشف العالم مع الخطوط السعودية — وجهات جديدة في انتظارك.' },
      { en: 'Saudi hospitality at 37,000 feet.', ar: 'ضيافة سعودية على ارتفاع 37,000 قدم.' },
      { en: 'Your journey starts here.', ar: 'رحلتك تبدأ من هنا.' }
    ]
  },
  tourism: {
    handle: '@visitsaudi',
    tags: ['#روح_السعودية', '#VisitSaudi', '#تنفّس'],
    captions: [
      { en: 'The soul of Saudi Arabia awaits — discover destinations like no other.', ar: 'روح السعودية تنتظرك — اكتشف وجهات لا مثيل لها.' },
      { en: "From AlUla to the Red Sea, the Kingdom is the world's destination.", ar: 'من العُلا إلى البحر الأحمر، المملكة وجهة العالم.' },
      { en: 'Saudi Summer 2026 — unforgettable experiences.', ar: 'صيف السعودية 2026 — تجارب لا تُنسى.' }
    ]
  },
  culture: {
    handle: '@momoculture',
    tags: ['#وزارة_الثقافة', '#بينالي_الدرعية', '#عام_الإبل'],
    captions: [
      { en: 'Art brings us together — the Diriyah Biennale returns.', ar: 'الفن يجمعنا — بينالي الدرعية يعود بحُلّة جديدة.' },
      { en: 'A culture that inspires the world.', ar: 'ثقافة تُلهم العالم.' },
      { en: 'Celebrate Saudi creativity this arts season.', ar: 'احتفِ بالإبداع السعودي في موسم الفنون.' }
    ]
  },
  mcdonalds: {
    handle: '@mcdonaldsksa',
    tags: ['#ماكدونالدز', '#McDonalds', '#وجبة_السعادة'],
    captions: [
      { en: "Your favorite taste, anytime. Try what's new at McDonald's today.", ar: 'طعمك المفضّل في أي وقت. جرّب جديد ماكدونالدز اليوم.' },
      { en: 'A Happy Meal is waiting for the little ones.', ar: 'وجبة السعادة تنتظر الصغار.' },
      { en: 'The McDonald’s deals you love are back.', ar: 'عروض ماكدونالدز التي تحبها، عادت.' }
    ]
  },
  lipton: {
    handle: '@lipton_arabia',
    tags: ['#ليبتون', '#Lipton', '#انتعاش'],
    captions: [
      { en: 'A refreshing moment you deserve — Lipton.', ar: 'لحظة انتعاش تستحقها — ليبتون.' },
      { en: 'Lipton tea, a flavor that brings us together.', ar: 'شاي ليبتون، نكهة تجمعنا.' },
      { en: 'Start your day refreshed.', ar: 'ابدأ يومك بانتعاش.' }
    ]
  },
  masar: {
    handle: '@masardestination',
    tags: ['#مسار', '#Masar', '#قلب_مكة'],
    captions: [
      { en: 'Masar — a new destination in the heart of Makkah.', ar: 'مسار — وجهة جديدة في قلب مكة المكرمة.' },
      { en: 'Where faith meets modern living.', ar: 'حيث يلتقي الإيمان بالحياة العصرية.' },
      { en: 'Invest in the destination of the future.', ar: 'استثمر في وجهة المستقبل.' }
    ]
  }
}

const MEDIA_BY_PLATFORM: Record<SocialPlatform, SocialPost['mediaType'][]> = {
  instagram: ['image', 'carousel', 'video'],
  x: ['text', 'image', 'video'],
  linkedin: ['image', 'text', 'carousel'],
  tiktok: ['video'],
  snapchat: ['video', 'image']
}

function buildPostsForClient(client: ClientSeed, count: number, startIndex: number): SocialPost[] {
  const meta = CLIENT_SOCIAL[client.id]
  if (!meta) return []
  const posts: SocialPost[] = []
  for (let i = 0; i < count; i++) {
    const r = seeded(`${client.id}:social:${startIndex + i}`)
    const platform = SOCIAL_PLATFORMS[(startIndex + i) % SOCIAL_PLATFORMS.length]
    const caption = meta.captions[(startIndex + i) % meta.captions.length]
    const scheduled = r() < 0.28
    const minutes = scheduled ? intIn(r, 30, 60 * 26) : intIn(r, 12, 60 * 96)
    const reach = Math.round(intIn(r, 18_000, 240_000) * client.weight)
    const engagement = 2.4 + r() * 6.6
    const likes = Math.round(reach * (engagement / 100) * (0.7 + r() * 0.5))
    posts.push({
      id: `SP-${hashString(`${client.id}:${startIndex + i}`) % 90000 + 10000}`,
      platform,
      clientId: client.id,
      clientName: client.name,
      handle: meta.handle,
      caption,
      hashtags: meta.tags,
      mediaType: pick(r, MEDIA_BY_PLATFORM[platform]),
      status: scheduled ? 'scheduled' : 'published',
      autoByJarvis: r() < 0.82,
      when: scheduled ? whenIn(minutes) : whenAgo(minutes),
      metrics: {
        likes,
        comments: Math.round(likes * (0.04 + r() * 0.08)),
        shares: Math.round(likes * (0.02 + r() * 0.05)),
        reach,
        engagement: parseFloat(engagement.toFixed(1))
      }
    })
  }
  return posts
}

export function getSocialPosts(clientId: string = ALL_CLIENTS_ID): SocialPost[] {
  if (clientId === ALL_CLIENTS_ID) {
    const all = REAL_CLIENTS.flatMap((c, ci) => buildPostsForClient(c, 3, ci * 7))
    // stable interleave by a seeded order so the feed mixes brands
    return all
      .map((p) => ({ p, k: hashString(p.id) }))
      .sort((a, b) => a.k - b.k)
      .map(({ p }) => p)
  }
  const client = getClient(clientId)
  return buildPostsForClient(client, 12, 0).sort((a, b) =>
    a.status === b.status ? 0 : a.status === 'scheduled' ? -1 : 1
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 2 · AD MANAGER (unified)
// ════════════════════════════════════════════════════════════════════════════

export type AdPlatform = 'meta' | 'google' | 'tiktok' | 'snapchat' | 'x'
export const AD_PLATFORMS: AdPlatform[] = ['meta', 'google', 'tiktok', 'snapchat', 'x']

export const AD_PLATFORM_LABEL: Record<AdPlatform, Bi> = {
  meta: { en: 'Meta Ads', ar: 'إعلانات ميتا' },
  google: { en: 'Google Ads', ar: 'إعلانات جوجل' },
  tiktok: { en: 'TikTok Ads', ar: 'إعلانات تيك توك' },
  snapchat: { en: 'Snapchat Ads', ar: 'إعلانات سناب شات' },
  x: { en: 'X Ads', ar: 'إعلانات إكس' }
}
export const AD_PLATFORM_COLOR: Record<AdPlatform, string> = {
  meta: '#0866FF',
  google: '#34A853',
  tiktok: '#25F4EE',
  snapchat: '#FFFC00',
  x: '#E7E9EA'
}

export type AdStatus = 'active' | 'learning' | 'paused'
export type JarvisAdAction = 'paced' | 'budget_shift' | 'bid_tuned' | 'anomaly_paused' | 'scaled' | 'none'

export const JARVIS_AD_ACTION_LABEL: Record<JarvisAdAction, Bi> = {
  paced: { en: 'Paced', ar: 'مضبوط الإيقاع' },
  budget_shift: { en: 'Budget shifted', ar: 'نُقلت الميزانية' },
  bid_tuned: { en: 'Bids tuned', ar: 'ضُبطت المزايدة' },
  anomaly_paused: { en: 'Anomaly paused', ar: 'أُوقف لشذوذ' },
  scaled: { en: 'Scaled up', ar: 'تم التوسيع' },
  none: { en: '—', ar: '—' }
}

export type AdCampaign = {
  id: string
  name: Bi
  platform: AdPlatform
  clientId: string
  clientName: Bi
  objective: Bi
  status: AdStatus
  budgetDaily: number
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
  roas: number
  jarvisAction: JarvisAdAction
}

const OBJECTIVES: Bi[] = [
  { en: 'Conversions', ar: 'تحويلات' },
  { en: 'Traffic', ar: 'زيارات' },
  { en: 'Awareness', ar: 'وعي' },
  { en: 'Reach', ar: 'وصول' },
  { en: 'Video views', ar: 'مشاهدات' },
  { en: 'Lead gen', ar: 'جذب عملاء' },
  { en: 'App installs', ar: 'تثبيت تطبيق' }
]
const AD_STATUSES: AdStatus[] = ['active', 'active', 'active', 'learning', 'paused']
const JARVIS_ACTIONS: JarvisAdAction[] = ['paced', 'paced', 'budget_shift', 'bid_tuned', 'scaled', 'anomaly_paused', 'none']

function buildCampaignsForClient(client: ClientSeed, perPlatform: number): AdCampaign[] {
  const out: AdCampaign[] = []
  AD_PLATFORMS.forEach((platform, pi) => {
    for (let i = 0; i < perPlatform; i++) {
      const r = seeded(`${client.id}:ad:${platform}:${i}`)
      const objective = OBJECTIVES[(pi + i) % OBJECTIVES.length]
      const status = pick(r, AD_STATUSES)
      const budgetDaily = Math.round(intIn(r, 3, 40) * 1000 * client.weight)
      const spend = Math.round(budgetDaily * (18 + r() * 12) * (status === 'paused' ? 0.4 : 1))
      const impressions = Math.round(spend * intIn(r, 40, 130))
      const ctr = 0.7 + r() * 3.6
      const clicks = Math.round(impressions * (ctr / 100))
      const cpc = clicks > 0 ? spend / clicks : 0
      const conversions = Math.round(clicks * (0.02 + r() * 0.09))
      const roas = 1.4 + r() * 4.2
      out.push({
        id: `CMP-${hashString(`${client.id}:${platform}:${i}`) % 9000 + 1000}`,
        name: {
          en: `${client.name.en} · ${objective.en} · ${AD_PLATFORM_LABEL[platform].en}`,
          ar: `${client.name.ar} · ${objective.ar} · ${AD_PLATFORM_LABEL[platform].ar}`
        },
        platform,
        clientId: client.id,
        clientName: client.name,
        objective,
        status,
        budgetDaily,
        spend,
        impressions,
        clicks,
        ctr: parseFloat(ctr.toFixed(2)),
        cpc: parseFloat(cpc.toFixed(2)),
        conversions,
        roas: parseFloat(roas.toFixed(1)),
        jarvisAction: status === 'paused' ? 'anomaly_paused' : pick(r, JARVIS_ACTIONS)
      })
    }
  })
  return out
}

export type AdSummary = {
  spend: string
  spendRaw: number
  impressions: string
  clicks: string
  conversions: string
  roas: string
  activeCampaigns: number
  totalCampaigns: number
}

export function getAdCampaigns(clientId: string = ALL_CLIENTS_ID): { campaigns: AdCampaign[]; summary: AdSummary; byPlatform: { platform: AdPlatform; spend: number; share: number }[] } {
  const campaigns =
    clientId === ALL_CLIENTS_ID
      ? REAL_CLIENTS.flatMap((c) => buildCampaignsForClient(c, 1))
      : buildCampaignsForClient(getClient(clientId), 2)

  const spend = campaigns.reduce((s, c) => s + c.spend, 0)
  const impressions = campaigns.reduce((s, c) => s + c.impressions, 0)
  const clicks = campaigns.reduce((s, c) => s + c.clicks, 0)
  const conversions = campaigns.reduce((s, c) => s + c.conversions, 0)
  const revenue = campaigns.reduce((s, c) => s + c.spend * c.roas, 0)
  const blendedRoas = spend > 0 ? revenue / spend : 0

  const byPlatform = AD_PLATFORMS.map((platform) => {
    const ps = campaigns.filter((c) => c.platform === platform).reduce((s, c) => s + c.spend, 0)
    return { platform, spend: ps, share: spend > 0 ? (ps / spend) * 100 : 0 }
  }).sort((a, b) => b.spend - a.spend)

  return {
    campaigns: campaigns.sort((a, b) => b.spend - a.spend),
    summary: {
      spend: fmtSar(spend),
      spendRaw: spend,
      impressions: fmtCompact(impressions),
      clicks: fmtCompact(clicks),
      conversions: fmtCompact(conversions),
      roas: `${blendedRoas.toFixed(1)}×`,
      activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
      totalCampaigns: campaigns.length
    },
    byPlatform
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 3 · THE TEAM
// ════════════════════════════════════════════════════════════════════════════

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export const TASK_COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']
export const TASK_STATUS_LABEL: Record<TaskStatus, Bi> = {
  todo: { en: 'To do', ar: 'قيد الانتظار' },
  in_progress: { en: 'In progress', ar: 'قيد التنفيذ' },
  review: { en: 'In review', ar: 'قيد المراجعة' },
  done: { en: 'Done · this week', ar: 'منجز · هذا الأسبوع' }
}

export type TeamMember = {
  id: string
  name: Bi
  role: Bi
  deptSlug: string
  initials: string
  clientIds: string[]
  utilization: number
  presence: 'online' | 'busy' | 'off'
}

export type TeamTask = {
  id: string
  title: Bi
  memberId: string
  clientId: string
  status: TaskStatus
  due: Bi
}

export type Accomplishment = {
  id: string
  text: Bi
  memberId: string
  clientId: string
  when: Bi
}

type MemberSeed = Omit<TeamMember, 'utilization' | 'presence'>

const ROSTER: MemberSeed[] = [
  { id: 'm-lama', name: { en: 'Lama Al-Otaibi', ar: 'لمى العتيبي' }, role: { en: 'Account Director', ar: 'مديرة حسابات' }, deptSlug: 'strategy-accounts', initials: 'LA', clientIds: ['stc', 'saudia', 'tourism'] },
  { id: 'm-faisal', name: { en: 'Faisal Al-Harbi', ar: 'فيصل الحربي' }, role: { en: 'Strategy Lead', ar: 'قائد الاستراتيجية' }, deptSlug: 'strategy-accounts', initials: 'FA', clientIds: ['mercedes', 'culture', 'masar'] },
  { id: 'm-nouf', name: { en: 'Nouf Al-Qahtani', ar: 'نوف القحطاني' }, role: { en: 'Social Media Lead', ar: 'قائدة التواصل الاجتماعي' }, deptSlug: 'social-comms', initials: 'NQ', clientIds: ['stc', 'mcdonalds', 'lipton'] },
  { id: 'm-yousef', name: { en: 'Yousef Khan', ar: 'يوسف خان' }, role: { en: 'Community Manager', ar: 'مدير المجتمع' }, deptSlug: 'social-comms', initials: 'YK', clientIds: ['saudia', 'tourism', 'mcdonalds'] },
  { id: 'm-reem', name: { en: 'Reem Al-Dossari', ar: 'ريم الدوسري' }, role: { en: 'Influencer Manager', ar: 'مديرة المؤثرين' }, deptSlug: 'influencers', initials: 'RD', clientIds: ['mcdonalds', 'lipton', 'tourism'] },
  { id: 'm-abdullah', name: { en: 'Abdullah Al-Shehri', ar: 'عبدالله الشهري' }, role: { en: 'Talent Coordinator', ar: 'منسق المواهب' }, deptSlug: 'influencers', initials: 'AS', clientIds: ['stc', 'culture'] },
  { id: 'm-sara', name: { en: 'Sara Haddad', ar: 'سارة حداد' }, role: { en: 'Creative Director', ar: 'مديرة إبداع' }, deptSlug: 'creative-production', initials: 'SH', clientIds: ['mercedes', 'saudia', 'culture'] },
  { id: 'm-tariq', name: { en: 'Tariq Nasser', ar: 'طارق ناصر' }, role: { en: 'Senior Video Editor', ar: 'مونتير أول' }, deptSlug: 'creative-production', initials: 'TN', clientIds: ['stc', 'mcdonalds', 'masar'] },
  { id: 'm-maya', name: { en: 'Maya Fares', ar: 'مايا فارس' }, role: { en: 'Art Director', ar: 'مديرة فنية' }, deptSlug: 'creative-production', initials: 'MF', clientIds: ['lipton', 'tourism'] },
  { id: 'm-omar', name: { en: 'Omar Bafadel', ar: 'عمر بافضل' }, role: { en: 'Media Buying Lead', ar: 'قائد الشراء الإعلامي' }, deptSlug: 'media-buying', initials: 'OB', clientIds: ['stc', 'mercedes', 'saudia'] },
  { id: 'm-huda', name: { en: 'Huda Al-Zahrani', ar: 'هدى الزهراني' }, role: { en: 'Performance Specialist', ar: 'أخصائية أداء' }, deptSlug: 'media-buying', initials: 'HZ', clientIds: ['mcdonalds', 'lipton', 'masar', 'tourism'] },
  { id: 'm-khalid', name: { en: 'Khalid Al-Mutairi', ar: 'خالد المطيري' }, role: { en: 'Operations Manager', ar: 'مدير العمليات' }, deptSlug: 'operations-finance', initials: 'KM', clientIds: ['stc', 'mercedes', 'saudia', 'tourism', 'culture', 'mcdonalds', 'lipton', 'masar'] },
  { id: 'm-aisha', name: { en: 'Aisha Al-Ghamdi', ar: 'عائشة الغامدي' }, role: { en: 'Finance & Billing', ar: 'المالية والفوترة' }, deptSlug: 'operations-finance', initials: 'AG', clientIds: ['stc', 'mercedes', 'saudia', 'tourism', 'culture', 'mcdonalds', 'lipton', 'masar'] }
]

const TASK_TEMPLATES: Record<string, Bi[]> = {
  'social-comms': [
    { en: 'Schedule {c} weekly content calendar', ar: 'جدولة تقويم محتوى {c} الأسبوعي' },
    { en: 'Reply to {c} campaign engagement', ar: 'الرد على تفاعلات حملة {c}' },
    { en: 'Draft {c} launch announcement posts', ar: 'صياغة منشورات إطلاق {c}' }
  ],
  influencers: [
    { en: 'Negotiate {c} creator contracts', ar: 'التفاوض على عقود مؤثري {c}' },
    { en: 'Vet {c} influencer shortlist', ar: 'فحص قائمة مؤثري {c} المرشحة' },
    { en: 'Brief creators for {c} campaign', ar: 'تزويد مؤثري حملة {c} بالموجز' }
  ],
  'creative-production': [
    { en: 'Edit {c} hero video cut', ar: 'مونتاج فيديو {c} الرئيسي' },
    { en: 'Design {c} campaign key visual', ar: 'تصميم الهوية البصرية لحملة {c}' },
    { en: 'Brand-check {c} delivery batch', ar: 'فحص الالتزام بعلامة {c}' }
  ],
  'strategy-accounts': [
    { en: 'Prepare {c} quarterly business review', ar: 'إعداد المراجعة الربعية لـ {c}' },
    { en: 'Build {c} 2026 strategy deck', ar: 'بناء عرض استراتيجية {c} 2026' },
    { en: 'Align {c} on next-month plan', ar: 'مواءمة {c} على خطة الشهر القادم' }
  ],
  'media-buying': [
    { en: 'Rebalance {c} campaign budgets', ar: 'إعادة توزيع ميزانيات حملات {c}' },
    { en: 'Analyse {c} paid performance', ar: 'تحليل أداء حملات {c} المدفوعة' },
    { en: 'Build {c} media plan', ar: 'بناء الخطة الإعلامية لـ {c}' }
  ],
  'operations-finance': [
    { en: 'Issue {c} monthly invoices', ar: 'إصدار فواتير {c} الشهرية' },
    { en: 'Reconcile {c} retainer hours', ar: 'تسوية ساعات استبقاء {c}' },
    { en: 'Resource next sprint across pods', ar: 'توزيع موارد المرحلة القادمة على الفرق' }
  ]
}

const ACC_TEMPLATES: Record<string, Bi[]> = {
  'social-comms': [
    { en: 'Shipped {c} campaign — {n}M reach in week one', ar: 'أطلق حملة {c} — وصول {n} مليون في الأسبوع الأول' },
    { en: 'Grew {c} engagement rate to {n}%', ar: 'رفع معدل تفاعل {c} إلى {n}%' }
  ],
  influencers: [
    { en: 'Closed {n} creator deals for {c}', ar: 'أبرم {n} اتفاقية مؤثرين لـ {c}' },
    { en: 'Delivered {c} influencer campaign on time', ar: 'سلّم حملة مؤثري {c} في موعدها' }
  ],
  'creative-production': [
    { en: 'Delivered {n} cut-downs for {c}', ar: 'سلّم {n} نسخة فيديو لـ {c}' },
    { en: 'Cleared {c} creative batch — 100% brand-compliant', ar: 'اعتمد دفعة {c} الإبداعية — التزام كامل بالعلامة' }
  ],
  'strategy-accounts': [
    { en: 'Renewed {c} retainer for another year', ar: 'جدّد عقد استبقاء {c} لعام إضافي' },
    { en: 'Presented {c} QBR — health up {n} pts', ar: 'قدّم مراجعة {c} الربعية — صحة الحساب +{n} نقطة' }
  ],
  'media-buying': [
    { en: 'Cut {c} media waste by {n}%', ar: 'خفض هدر {c} الإعلامي بنسبة {n}%' },
    { en: 'Lifted {c} ROAS to {n}×', ar: 'رفع عائد {c} على الإنفاق إلى {n}×' }
  ],
  'operations-finance': [
    { en: 'Collected {n}% of receivables on time', ar: 'حصّل {n}% من المستحقات في الوقت' },
    { en: 'Kept utilisation at {n}% across pods', ar: 'حافظ على إشغال {n}% عبر الفرق' }
  ]
}

const PRESENCE: TeamMember['presence'][] = ['online', 'online', 'busy', 'off']

function fill(tpl: Bi, c: Bi, n: number): Bi {
  const s = (t: string, name: string) => t.replace('{c}', name).replace('{n}', String(n))
  return { en: s(tpl.en, c.en), ar: s(tpl.ar, c.ar) }
}

export function getTeam(clientId: string = ALL_CLIENTS_ID): {
  members: TeamMember[]
  tasks: TeamTask[]
  accomplishments: Accomplishment[]
  stats: { people: number; activeTasks: number; doneThisWeek: number; avgUtilization: number }
} {
  const isAll = clientId === ALL_CLIENTS_ID
  const roster = ROSTER.filter((m) => isAll || m.clientIds.includes(clientId))

  const members: TeamMember[] = roster.map((m) => {
    const r = seeded(`${clientId}:member:${m.id}`)
    return { ...m, utilization: intIn(r, 64, 97), presence: pick(r, PRESENCE) }
  })

  const tasks: TeamTask[] = []
  const accomplishments: Accomplishment[] = []

  for (const m of roster) {
    // the clients this member works for, within the current scope
    const scopeClients = isAll ? m.clientIds : [clientId]
    const taskTpls = TASK_TEMPLATES[m.deptSlug] ?? []
    const accTpls = ACC_TEMPLATES[m.deptSlug] ?? []

    scopeClients.forEach((cid, ci) => {
      const r = seeded(`${clientId}:tasks:${m.id}:${cid}`)
      const client = getClient(cid)
      const taskCount = isAll ? 1 : 2
      for (let i = 0; i < taskCount; i++) {
        const tpl = taskTpls[(ci + i) % taskTpls.length]
        const status = pick(r, ['todo', 'in_progress', 'in_progress', 'review', 'done'] as TaskStatus[])
        tasks.push({
          id: `TSK-${hashString(`${m.id}:${cid}:${i}`) % 9000 + 1000}`,
          title: fill(tpl, client.name, intIn(r, 2, 9)),
          memberId: m.id,
          clientId: cid,
          status,
          due: status === 'done' ? whenAgo(intIn(r, 60, 60 * 40)) : whenIn(intIn(r, 60, 60 * 72))
        })
      }
      // one accomplishment per member-client
      const ar = seeded(`${clientId}:acc:${m.id}:${cid}`)
      const accTpl = accTpls[ci % accTpls.length]
      accomplishments.push({
        id: `ACC-${hashString(`${m.id}:${cid}`) % 9000 + 1000}`,
        text: fill(accTpl, client.name, intIn(ar, 2, 40)),
        memberId: m.id,
        clientId: cid,
        when: whenAgo(intIn(ar, 60 * 3, 60 * 120))
      })
    })
  }

  const doneThisWeek = tasks.filter((t) => t.status === 'done').length
  const activeTasks = tasks.filter((t) => t.status !== 'done').length
  const avgUtilization = members.length
    ? Math.round(members.reduce((s, m) => s + m.utilization, 0) / members.length)
    : 0

  return {
    members,
    tasks,
    accomplishments: accomplishments.sort((a, b) => hashString(a.id) - hashString(b.id)),
    stats: { people: members.length, activeTasks, doneThisWeek, avgUtilization }
  }
}

export function memberById(id: string): MemberSeed | undefined {
  return ROSTER.find((m) => m.id === id)
}
