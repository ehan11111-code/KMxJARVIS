import type { FirmState } from './mock/types'
import { CLIENTS } from './client'

export type AssistantAction =
  | { kind: 'set-theme'; value: 'light' | 'dark'; label: string }
  | { kind: 'set-locale'; value: 'en' | 'ar'; label: string }

export type AssistantLink = { label: string; href: string }

export type AssistantCard =
  | { kind: 'metric'; label: string; value: string; tone?: 'accent' | 'success' | 'warn' | 'neutral' }
  | { kind: 'list'; title: string; items: { label: string; meta?: string; href?: string }[] }

export type AssistantReply = {
  text: string
  cards?: AssistantCard[]
  links?: AssistantLink[]
  actions?: AssistantAction[]
  followups?: string[]
  scope?: 'in' | 'out'
}

export type Locale = 'en' | 'ar'

export type AssistantContext = {
  locale: Locale
  firm: FirmState
  clientName: string
}

// ---------- intent matching ----------

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ًٌٍَُِّْ]/g, '')
    .replace(/[إأٱآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim()

const containsAny = (s: string, terms: string[]) => terms.some((t) => s.includes(t))

const DEPT_ALIASES: Record<string, string[]> = {
  'social-comms': ['social', 'community', 'publishing', 'post', 'instagram', 'tiktok', 'snap', 'تواصل', 'اجتماعي', 'نشر', 'منشور', 'مجتمع'],
  influencers: ['influencer', 'creator', 'talent', 'roster', 'مؤثر', 'مؤثرين', 'موهبه', 'مواهب', 'صناع'],
  'creative-production': ['creative', 'production', 'video', 'podcast', 'design', 'content', 'edit', 'ابداع', 'انتاج', 'فيديو', 'بودكاست', 'تصميم', 'محتوى'],
  'strategy-accounts': ['strategy', 'account', 'pr', 'public relations', 'brand', 'launch', 'استراتيج', 'حساب', 'حسابات', 'علاقات', 'علامه', 'تدشين'],
  'media-buying': ['media buying', 'media plan', 'ad spend', 'spend', 'pacing', 'campaign budget', 'شراء', 'اعلان', 'انفاق', 'حمله', 'ميزانيه', 'وسائط'],
  'operations-finance': ['operation', 'finance', 'retainer', 'utilization', 'billing', 'invoice', 'resourcing', 'عمليات', 'ماليه', 'تشغيل', 'فواتير', 'موارد', 'استبقاء']
}

function matchDept(q: string): string | null {
  for (const [slug, aliases] of Object.entries(DEPT_ALIASES)) {
    if (containsAny(q, aliases)) return slug
  }
  return null
}

function matchClient(q: string): string | null {
  for (const c of CLIENTS) {
    if (c.id === 'all') continue
    const aliases = [c.name.en.toLowerCase(), c.name.ar, ...(c.aliases ?? [])]
    if (containsAny(q, aliases)) return c.id
  }
  return null
}

// ---------- responses ----------

function t<T extends Record<Locale, string>>(loc: Locale, dict: T) {
  return dict[loc]
}

// --- overview ---
function overview({ locale, firm }: AssistantContext): AssistantReply {
  const running = firm.firmKpis[0]?.value
  const decisions = firm.firmKpis[1]?.value
  const exceptions = firm.firmKpis[2]?.value
  const interventions = firm.firmKpis[3]?.value
  return {
    text: t(locale, {
      en: `Across ${firm.clientName}: ${running} workflows live, ${decisions} decisions issued in the last 24 hours, ${exceptions} open exceptions, and ${interventions} items waiting on a human. Open the control center to drill in.`,
      ar: `في ${firm.clientName}: ${running} تدفقًا نشطًا، و${decisions} قرارًا خلال آخر 24 ساعة، و${exceptions} حالة مفتوحة، و${interventions} عنصرًا ينتظر قرارك. افتح مركز التحكم للتفاصيل.`
    }),
    cards: firm.firmKpis.slice(0, 4).map((k) => ({
      kind: 'metric' as const,
      label: k.label[locale],
      value: k.value,
      tone: k.highlight ? 'accent' : 'neutral'
    })),
    links: [{ label: locale === 'ar' ? 'مركز التحكم' : 'Control center', href: '/control-center' }],
    followups: [
      locale === 'ar' ? 'ما الذي يحتاج قراري؟' : 'What needs my decision?',
      locale === 'ar' ? 'كيف حال إدارة المؤثرين؟' : 'How are influencers doing?',
      locale === 'ar' ? 'حالة عميل STC؟' : 'How is the STC account?'
    ]
  }
}

// --- exceptions / interventions ---
function exceptions({ locale, firm }: AssistantContext): AssistantReply {
  const top = firm.globalInterventions.slice(0, 4)
  const total = firm.globalInterventions.length
  if (total === 0) {
    return {
      text: t(locale, {
        en: "You're clear. No interventions pending right now.",
        ar: 'لا يوجد ما ينتظر قرارك حاليًا.'
      })
    }
  }
  return {
    text: t(locale, {
      en: `${total} item${total === 1 ? '' : 's'} waiting on you. Here are the top ones — open the notifications inbox for the full list.`,
      ar: `${total} عنصرًا ينتظر قرارك. هذه أبرزها — افتح صندوق التنبيهات لرؤية الكل.`
    }),
    cards: [
      {
        kind: 'list',
        title: locale === 'ar' ? 'أبرز الحالات' : 'Top items',
        items: top.map((iv) => ({ label: iv.text[locale], meta: iv.severity }))
      }
    ],
    links: [{ label: locale === 'ar' ? 'صندوق التنبيهات' : 'Notifications inbox', href: '/notifications' }]
  }
}

// --- department-specific ---
function deptSummary(slug: string, { locale, firm }: AssistantContext): AssistantReply {
  const dept = firm.departments.find((d) => d.slug === slug)
  if (!dept) return outOfScope({ locale } as AssistantContext)
  const topKpi = dept.kpis[0]
  return {
    text: t(locale, {
      en: `${dept.name.en}: ${dept.solutions.length} workflows live, ${dept.openExceptions} open exception${dept.openExceptions === 1 ? '' : 's'}. ${topKpi ? `${topKpi.label.en} sits at ${topKpi.value}.` : ''}`,
      ar: `${dept.name.ar}: ${dept.solutions.length} وحدة نشطة، و${dept.openExceptions} حاله مفتوحه. ${topKpi ? `${topKpi.label.ar} عند ${topKpi.value}.` : ''}`
    }),
    cards: dept.kpis.slice(0, 4).map((k) => ({
      kind: 'metric' as const,
      label: k.label[locale],
      value: k.value,
      tone: k.highlight ? 'accent' : 'neutral'
    })),
    links: [{ label: locale === 'ar' ? `فتح ${dept.name.ar}` : `Open ${dept.name.en}`, href: `/departments/${dept.slug}` }],
    followups: [
      locale === 'ar' ? 'ما المسائل العاجلة؟' : 'Anything urgent?',
      locale === 'ar' ? 'أعطني نظرة عامة' : 'Give me an overview'
    ]
  }
}

// --- client-specific ---
function clientSummary(clientId: string, { locale }: AssistantContext): AssistantReply {
  const c = CLIENTS.find((x) => x.id === clientId)
  if (!c) return outOfScope({ locale } as AssistantContext)
  return {
    text: t(locale, {
      en: `${c.name.en} is one of your client workspaces (${c.sector.en}). Switch the active client from the top bar to scope every dashboard, decision and report to ${c.name.en}.`,
      ar: `${c.name.ar} أحد مساحات عملائك (${c.sector.ar}). بدّل العميل النشط من الشريط العلوي لتُركّز كل لوحة وقرار وتقرير على ${c.name.ar}.`
    }),
    links: [{ label: locale === 'ar' ? 'مركز التحكم' : 'Control center', href: '/control-center' }],
    followups: [
      locale === 'ar' ? 'ما الذي يحتاج قراري؟' : 'What needs my decision?',
      locale === 'ar' ? 'أعطني نظرة عامة' : 'Give me an overview'
    ]
  }
}

function clientsList({ locale }: AssistantContext): AssistantReply {
  const list = CLIENTS.filter((c) => c.id !== 'all')
  return {
    text: t(locale, {
      en: `You operate ${list.length} client workspaces in one portal — each scoped separately. Pick the active client from the switcher in the top bar.`,
      ar: `تدير ${list.length} مساحة عمل لعملاء في بوابة واحدة — كل عميل بمعزل عن الآخر. اختر العميل النشط من المبدّل في الشريط العلوي.`
    }),
    cards: [
      {
        kind: 'list',
        title: locale === 'ar' ? 'العملاء' : 'Clients',
        items: list.map((c) => ({ label: c.name[locale], meta: c.sector[locale] }))
      }
    ]
  }
}

// --- navigation ---
const NAV_TARGETS: { keywords: string[]; href: string; en: string; ar: string }[] = [
  { keywords: ['control', 'overview', 'dashboard', 'home', 'لوح', 'مركز'], href: '/control-center', en: 'Control center', ar: 'مركز التحكم' },
  { keywords: ['department', 'departments', 'الاقسام', 'الأقسام'], href: '/departments', en: 'Departments', ar: 'الأقسام' },
  { keywords: ['saving', 'roi', 'impact', 'value', 'وفر', 'اثر', 'عائد'], href: '/total-savings', en: 'Total impact', ar: 'الأثر الإجمالي' },
  { keywords: ['notification', 'inbox', 'alert', 'صندوق', 'تنبيه'], href: '/notifications', en: 'Notifications', ar: 'التنبيهات' },
  { keywords: ['academy', 'training', 'learn', 'الاكاديميه', 'تدريب'], href: '/jarvis-academy', en: 'Academy', ar: 'الأكاديمية' },
  { keywords: ['contact', 'engineer', 'support', 'تواصل', 'مهندس'], href: '/contact', en: 'Contact', ar: 'التواصل' }
]

function navigate(q: string, ctx: AssistantContext): AssistantReply {
  const { locale } = ctx
  for (const target of NAV_TARGETS) {
    if (containsAny(q, target.keywords)) {
      return {
        text: t(locale, {
          en: `Here's ${target.en} — click below to jump there.`,
          ar: `هذه ${target.ar} — اضغط لتنتقل.`
        }),
        links: [{ label: locale === 'ar' ? target.ar : target.en, href: target.href }]
      }
    }
  }
  return help(ctx)
}

// --- settings ---
function explainTheme({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: 'I can switch the theme for you. The sun/moon button in the top bar toggles it too.',
      ar: 'أستطيع تبديل المظهر لك. زر الشمس/القمر في الشريط العلوي يفعل ذلك أيضًا.'
    }),
    actions: [
      { kind: 'set-theme', value: 'light', label: locale === 'ar' ? 'تفعيل الفاتح' : 'Switch to light' },
      { kind: 'set-theme', value: 'dark', label: locale === 'ar' ? 'تفعيل الداكن' : 'Switch to dark' }
    ]
  }
}

function explainLanguage({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: 'You can switch between English and Arabic. The EN/AR toggle in the top bar does the same thing.',
      ar: 'يمكنك التبديل بين العربية والإنجليزية. زر EN/AR في الشريط العلوي يقوم بنفس الأمر.'
    }),
    actions: [
      { kind: 'set-locale', value: 'en', label: 'English' },
      { kind: 'set-locale', value: 'ar', label: 'العربية' }
    ]
  }
}

// --- meta ---
function help({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: 'Ask me about your operations, any department, a specific client, where to find things in the portal, or settings like theme and language. I keep to business and the interface.',
      ar: 'اسألني عن عملياتك، أي قسم، أو عميل محدد، أو أين تجد الأمور في البوابة، أو إعدادات مثل المظهر واللغة. أبقى ضمن العمل والواجهة.'
    }),
    followups: [
      locale === 'ar' ? 'لخّص حالة العمليات' : 'Summarize operations',
      locale === 'ar' ? 'ما الذي يحتاج قراري؟' : 'What needs my attention?',
      locale === 'ar' ? 'من هم عملائي؟' : 'Who are my clients?',
      locale === 'ar' ? 'بدّل إلى الوضع الداكن' : 'Switch to dark mode'
    ]
  }
}

function greeting({ locale, clientName }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: `Hello — I'm Jarvis. I help run operations at ${clientName} across every department and client, and your portal settings. What can I look into?`,
      ar: `أهلًا — أنا جارفِس. أساعد في إدارة عمليات ${clientName} عبر كل قسم وعميل، وإعدادات البوابة. كيف يمكنني المساعدة؟`
    }),
    followups: [
      locale === 'ar' ? 'لخّص العمليات' : 'Summarize operations',
      locale === 'ar' ? 'ما الذي يحتاج قراري؟' : 'What needs my attention?',
      locale === 'ar' ? 'من هم عملائي؟' : 'Who are my clients?',
      locale === 'ar' ? 'الإعدادات' : 'Settings'
    ]
  }
}

function outOfScope({ locale }: AssistantContext): AssistantReply {
  return {
    text: t(locale, {
      en: 'That sits outside what I do. I keep to business operations, your departments and clients, and the portal interface. Try asking about a department, a client, or settings.',
      ar: 'هذا خارج نطاقي. أركّز على عمليات الأعمال وأقسامك وعملائك وواجهة البوابة. جرّب أن تسأل عن قسم أو عميل أو الإعدادات.'
    }),
    scope: 'out',
    followups: [
      locale === 'ar' ? 'لخّص العمليات' : 'Summarize operations',
      locale === 'ar' ? 'ماذا تستطيع أن تفعل؟' : 'What can you do?'
    ]
  }
}

// ---------- intent classification ----------

const SCOPE_TERMS = [
  'department', 'depart', 'social', 'influencer', 'creator', 'creative', 'production', 'video', 'podcast', 'strategy', 'account', 'media', 'campaign', 'operation', 'finance', 'client', 'workflow', 'decision', 'exception', 'intervention', 'approval', 'kpi', 'metric', 'report', 'theme', 'dark', 'light', 'language', 'arabic', 'english', 'notification', 'settings', 'interface', 'navigate', 'where', 'show', 'open', 'help', 'summary', 'overview', 'status', 'saving', 'impact', 'roi',
  'قسم', 'تواصل', 'مؤثر', 'ابداع', 'انتاج', 'فيديو', 'بودكاست', 'استراتيج', 'حساب', 'وسائط', 'اعلان', 'حمله', 'عمليات', 'ماليه', 'عميل', 'عملاء', 'تدفق', 'قرار', 'استثناء', 'تدخل', 'اعتماد', 'مؤشر', 'تقرير', 'مظهر', 'داكن', 'فاتح', 'لغه', 'عربي', 'انجل', 'تنبيه', 'اعدادات', 'واجهه', 'انتقل', 'افتح', 'مساعد', 'ملخص', 'حاله', 'وفر', 'اثر', 'عائد'
]

function isInScope(q: string): boolean {
  return SCOPE_TERMS.some((s) => q.includes(s))
}

export function classifyAndAnswer(question: string, ctx: AssistantContext): AssistantReply {
  const q = norm(question)
  if (!q) return greeting(ctx)

  if (containsAny(q, ['what can you do', 'help', 'capabilities', 'who are you', 'ماذا تستطيع', 'مساعده', 'كيف تساعد', 'من انت'])) {
    return help(ctx)
  }
  if (containsAny(q, ['hello', 'hi', 'hey', 'salam', 'مرحبا', 'اهلا', 'السلام', 'حياك'])) {
    return greeting(ctx)
  }
  if (containsAny(q, ['dark mode', 'light mode', 'theme', 'مظهر', 'الداكن', 'الفاتح'])) {
    return explainTheme(ctx)
  }
  if (containsAny(q, ['language', 'arabic', 'english', 'translate', 'العربيه', 'الانجل', 'لغه'])) {
    return explainLanguage(ctx)
  }
  if (containsAny(q, ['exception', 'attention', 'urgent', 'intervene', 'pending', 'need decision', 'awaiting', 'استثناء', 'انتباه', 'عاجل', 'تدخل', 'انتظار', 'قراري', 'يحتاج'])) {
    return exceptions(ctx)
  }
  if (containsAny(q, ['my clients', 'all clients', 'list clients', 'clients', 'عملائي', 'العملاء', 'قائمه العملاء'])) {
    return clientsList(ctx)
  }

  const client = matchClient(q)
  if (client) return clientSummary(client, ctx)

  if (containsAny(q, ['where', 'find', 'show me', 'take me', 'go to', 'open the', 'اين', 'افتح', 'انتقل', 'وين'])) {
    return navigate(q, ctx)
  }

  const dept = matchDept(q)
  if (dept) return deptSummary(dept, ctx)

  if (containsAny(q, ['summary', 'overview', 'status', 'how are', 'how is', 'state of', 'ملخص', 'نظره', 'حاله', 'كيف'])) {
    return overview(ctx)
  }

  if (!isInScope(q)) return outOfScope(ctx)
  return overview(ctx)
}

export function makeContext(args: { locale: Locale; firm: FirmState }): AssistantContext {
  return {
    locale: args.locale,
    firm: args.firm,
    clientName: args.firm.clientName
  }
}

export function suggestionStarters(locale: Locale): string[] {
  return [
    locale === 'ar' ? 'لخّص العمليات' : 'Summarize operations',
    locale === 'ar' ? 'ما الذي يحتاج قراري؟' : 'What needs my attention?',
    locale === 'ar' ? 'كيف حال إدارة المؤثرين؟' : 'How are influencers?',
    locale === 'ar' ? 'من هم عملائي؟' : 'Who are my clients?',
    locale === 'ar' ? 'حالة عميل STC' : 'How is the STC account?',
    locale === 'ar' ? 'بدّل إلى الوضع الداكن' : 'Switch to dark mode'
  ]
}
