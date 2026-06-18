import type { Bi, Chart } from './types'

export type SavingsCategoryKey =
  | 'labor'
  | 'errors'
  | 'capital'
  | 'vendor'
  | 'compliance'
  | 'churn'

export type SavingsCategory = {
  key: SavingsCategoryKey
  label: Bi
  description: Bi
  amountSar: number
  detail: Bi
}

export type DeptSavings = {
  slug: string
  name: Bi
  ytdSar: number
  monthlySar: number
  fteHoursReclaimed: number
  modules: number
  topCategory: SavingsCategoryKey
  baselineSar: number
  withJarvisSar: number
  drivers: { label: Bi; valueSar: number }[]
}

export type SavingsState = {
  ytdSar: number
  monthSar: number
  runRateAnnualSar: number
  baselineCostSar: number
  withJarvisCostSar: number
  roiMultiplier: number
  fteHoursReclaimed: number
  modulesContributing: number
  generatedAt: string
  categories: SavingsCategory[]
  byDept: DeptSavings[]
  monthlyTrend: Chart
  comparisonTrend: Chart
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

const r = mulberry32(hashString('jarvis-savings-2026-06'))
const jitter = (base: number, spread: number) => Math.round(base + (r() - 0.5) * 2 * spread)

const DEPT_SAVINGS: DeptSavings[] = [
  {
    slug: 'media-buying',
    name: { en: 'Media Planning & Buying', ar: 'التخطيط والشراء الإعلاني' },
    ytdSar: 6_240_000,
    monthlySar: 742_000,
    fteHoursReclaimed: 9_400,
    modules: 4,
    topCategory: 'capital',
    baselineSar: 14_800_000,
    withJarvisSar: 8_560_000,
    drivers: [
      { label: { en: 'Media waste eliminated', ar: 'هدر إعلامي تم تفاديه' }, valueSar: 2_640_000 },
      { label: { en: 'Cross-channel spend reallocation', ar: 'إعادة توزيع الإنفاق عبر القنوات' }, valueSar: 1_780_000 },
      { label: { en: 'Anomaly auto-pause savings', ar: 'وفر الإيقاف التلقائي للشذوذ' }, valueSar: 1_120_000 },
      { label: { en: 'Pacing accuracy', ar: 'دقة ضبط الإيقاع' }, valueSar: 700_000 }
    ]
  },
  {
    slug: 'influencers',
    name: { en: 'Influencer & Talent', ar: 'المؤثرون والمواهب' },
    ytdSar: 5_360_000,
    monthlySar: 648_000,
    fteHoursReclaimed: 11_600,
    modules: 4,
    topCategory: 'vendor',
    baselineSar: 11_200_000,
    withJarvisSar: 5_840_000,
    drivers: [
      { label: { en: 'Better creator deal terms', ar: 'شروط أفضل لصفقات المؤثرين' }, valueSar: 1_980_000 },
      { label: { en: 'Vetting time eliminated', ar: 'وقت الفحص الذي تم توفيره' }, valueSar: 1_460_000 },
      { label: { en: 'Fake-follower spend avoided', ar: 'إنفاق على متابعين وهميين تم تفاديه' }, valueSar: 1_180_000 },
      { label: { en: 'Deliverable recovery', ar: 'استرداد المخرجات المتأخرة' }, valueSar: 740_000 }
    ]
  },
  {
    slug: 'creative-production',
    name: { en: 'Creative & Production', ar: 'الإبداع والإنتاج' },
    ytdSar: 4_180_000,
    monthlySar: 512_000,
    fteHoursReclaimed: 13_800,
    modules: 4,
    topCategory: 'labor',
    baselineSar: 9_600_000,
    withJarvisSar: 5_420_000,
    drivers: [
      { label: { en: 'Production cycle compression', ar: 'تقليص دورة الإنتاج' }, valueSar: 1_620_000 },
      { label: { en: 'Rework from version errors avoided', ar: 'تفادي إعادة العمل من أخطاء الإصدارات' }, valueSar: 1_080_000 },
      { label: { en: 'Brand-check rejections prevented', ar: 'منع رفض فحص العلامة' }, valueSar: 880_000 },
      { label: { en: 'Cut-down reuse at scale', ar: 'إعادة استخدام النسخ بكفاءة' }, valueSar: 600_000 }
    ]
  },
  {
    slug: 'social-comms',
    name: { en: 'Social & Communications', ar: 'الاتصال ووسائل التواصل' },
    ytdSar: 3_640_000,
    monthlySar: 446_000,
    fteHoursReclaimed: 12_200,
    modules: 5,
    topCategory: 'labor',
    baselineSar: 7_800_000,
    withJarvisSar: 4_160_000,
    drivers: [
      { label: { en: 'Reporting hours saved', ar: 'ساعات إعداد التقارير الموفّرة' }, valueSar: 1_320_000 },
      { label: { en: 'Inbox triage automation', ar: 'أتمتة فرز الرسائل' }, valueSar: 980_000 },
      { label: { en: 'Crisis caught early', ar: 'أزمات أُوقفت مبكرًا' }, valueSar: 880_000 },
      { label: { en: 'Publishing reliability', ar: 'موثوقية النشر' }, valueSar: 460_000 }
    ]
  },
  {
    slug: 'strategy-accounts',
    name: { en: 'Strategy & Accounts', ar: 'الاستراتيجية والحسابات' },
    ytdSar: 3_980_000,
    monthlySar: 486_000,
    fteHoursReclaimed: 7_400,
    modules: 4,
    topCategory: 'churn',
    baselineSar: 8_400_000,
    withJarvisSar: 4_420_000,
    drivers: [
      { label: { en: 'Account retention uplift', ar: 'تحسين الاحتفاظ بالحسابات' }, valueSar: 1_840_000 },
      { label: { en: 'Faster QBR + reporting', ar: 'مراجعات وتقارير أسرع' }, valueSar: 920_000 },
      { label: { en: 'PR share-of-voice gains', ar: 'مكاسب حصة الصوت' }, valueSar: 760_000 },
      { label: { en: 'Launch coordination', ar: 'تنسيق التدشينات' }, valueSar: 460_000 }
    ]
  },
  {
    slug: 'operations-finance',
    name: { en: 'Operations & Finance', ar: 'العمليات والمالية' },
    ytdSar: 3_120_000,
    monthlySar: 372_000,
    fteHoursReclaimed: 8_600,
    modules: 4,
    topCategory: 'compliance',
    baselineSar: 6_900_000,
    withJarvisSar: 3_780_000,
    drivers: [
      { label: { en: 'Retainer over-servicing recovered', ar: 'استرداد تجاوز نطاق الاستبقاء' }, valueSar: 1_240_000 },
      { label: { en: 'Resourcing efficiency', ar: 'كفاءة توزيع الموارد' }, valueSar: 820_000 },
      { label: { en: 'Faster collections', ar: 'تحصيل أسرع' }, valueSar: 640_000 },
      { label: { en: 'E-invoicing accuracy', ar: 'دقة الفوترة الإلكترونية' }, valueSar: 420_000 }
    ]
  }
]

const ytdSar = DEPT_SAVINGS.reduce((a, d) => a + d.ytdSar, 0)
const monthSar = DEPT_SAVINGS.reduce((a, d) => a + d.monthlySar, 0)
const baseline = DEPT_SAVINGS.reduce((a, d) => a + d.baselineSar, 0)
const withJarvis = DEPT_SAVINGS.reduce((a, d) => a + d.withJarvisSar, 0)
const fteHours = DEPT_SAVINGS.reduce((a, d) => a + d.fteHoursReclaimed, 0)
const modulesContributing = DEPT_SAVINGS.reduce((a, d) => a + d.modules, 0)
const runRate = monthSar * 12
const roi = +(baseline / Math.max(withJarvis, 1)).toFixed(2)

const monthly = Array.from({ length: 6 }, (_, i) => {
  const base = monthSar / 1_000_000
  const drift = 1 + (i - 2.5) * 0.06
  return +(base * drift + (r() - 0.5) * 0.4).toFixed(2)
})

const monthlyTrend: Chart = {
  title: { en: 'Monthly savings · SAR (M)', ar: 'الوفر الشهري · مليون ريال' },
  series: [
    {
      key: 'savings',
      label: { en: 'Savings (M SAR)', ar: 'الوفر (مليون)' },
      highlight: true,
      data: monthly.map((v, i) => ({ t: MONTHS_EN[(new Date().getMonth() - (5 - i) + 12) % 12], v }))
    }
  ]
}

const comparisonTrend: Chart = {
  title: { en: 'Operating cost · with vs without JARVIS · SAR (M)', ar: 'تكلفة التشغيل · مع جارفِس مقابل بدونه · مليون ريال' },
  series: [
    {
      key: 'without',
      label: { en: 'Without JARVIS', ar: 'بدون جارفِس' },
      data: Array.from({ length: 6 }, (_, i) => ({
        t: MONTHS_EN[(new Date().getMonth() - (5 - i) + 12) % 12],
        v: +((baseline / 6 / 1_000_000) * (1 + (i - 2.5) * 0.03 + (r() - 0.5) * 0.05)).toFixed(2)
      }))
    },
    {
      key: 'with',
      label: { en: 'With JARVIS', ar: 'مع جارفِس' },
      highlight: true,
      data: Array.from({ length: 6 }, (_, i) => ({
        t: MONTHS_EN[(new Date().getMonth() - (5 - i) + 12) % 12],
        v: +((withJarvis / 6 / 1_000_000) * (1 - (i - 2.5) * 0.02 + (r() - 0.5) * 0.04)).toFixed(2)
      }))
    }
  ]
}

const categories: SavingsCategory[] = [
  {
    key: 'labor',
    label: { en: 'Hours & cycle time', ar: 'الساعات وزمن الدورة' },
    description: {
      en: 'Hours reclaimed by autonomous workflows: publishing, inbox triage, reporting and production routing that no longer need a human in the loop for the routine path.',
      ar: 'ساعات استُردّت من تدفقات تشغيل ذاتية: النشر وفرز الرسائل وإعداد التقارير وتنسيق الإنتاج لم تعد تحتاج تدخّلًا بشريًا في المسار المعتاد.'
    },
    amountSar: 8_900_000,
    detail: { en: `${fteHours.toLocaleString('en-US')} team-hours · SAR ${(8_900_000 / 1_000_000).toFixed(1)}M`, ar: `${fteHours.toLocaleString('en-US')} ساعة عمل · ${(8_900_000 / 1_000_000).toFixed(1)} مليون ريال` }
  },
  {
    key: 'capital',
    label: { en: 'Media waste eliminated', ar: 'الهدر الإعلامي المُزال' },
    description: {
      en: 'Ad spend protected when the agent caught broken tracking, runaway budgets and zombie ad sets — and reallocated to the best-performing channels in real time.',
      ar: 'إنفاق إعلاني محمي حين رصد الوكيل التتبع المعطوب والميزانيات الجامحة والمجموعات الميتة — وأعاد توزيعها على أفضل القنوات لحظيًا.'
    },
    amountSar: 7_200_000,
    detail: { en: 'Tracking integrity restored · SAR 7.2M spend protected', ar: 'استعادة سلامة التتبع · حماية 7.2 مليون من الإنفاق' }
  },
  {
    key: 'vendor',
    label: { en: 'Influencer & creator spend', ar: 'إنفاق المؤثرين والمبدعين' },
    description: {
      en: 'Better creator deal terms, fake-follower spend avoided, and ROI-defensible matching so every riyal in influencer budget is justified to the client.',
      ar: 'شروط أفضل لصفقات المبدعين، وتفادي الإنفاق على متابعين وهميين، ومطابقة قابلة للتبرير بالعائد لضمان تبرير كل ريال في ميزانية المؤثرين أمام العميل.'
    },
    amountSar: 5_600_000,
    detail: { en: 'Vetted creators · SAR 5.6M in spend optimized', ar: 'مبدعون مفحوصون · تحسين 5.6 مليون من الإنفاق' }
  },
  {
    key: 'errors',
    label: { en: 'Rework prevented', ar: 'إعادة العمل المُمنوعة' },
    description: {
      en: 'Costs avoided when an agent caught an off-brand asset, a wrong version or a broken tracking tag before it shipped to the client or went live.',
      ar: 'تكاليف تم تفاديها حين رصد الوكيل أصلًا مخالفًا للعلامة، أو نسخة خاطئة، أو وسم تتبع معطوبًا قبل تسليمه للعميل أو نشره.'
    },
    amountSar: 4_100_000,
    detail: { en: '3,400 brand-check + version flags · 92% caught pre-delivery', ar: '3,400 تنبيه فحص علامة وإصدار · 92% رُصدت قبل التسليم' }
  },
  {
    key: 'churn',
    label: { en: 'Client retention uplift', ar: 'تحسين الاحتفاظ بالعملاء' },
    description: {
      en: 'Account-lifetime value protected by health-score monitoring, faster response SLAs and crisis watch that lets the brand respond first.',
      ar: 'قيمة الحساب مدى عمره محمية عبر مراقبة مؤشر الصحة، واستجابة أسرع، ورصد الأزمات الذي يتيح للعلامة أن تستبق بالرد.'
    },
    amountSar: 6_300_000,
    detail: { en: 'At-risk accounts recovered · CLV uplift SAR 6.3M', ar: 'استرداد الحسابات المعرّضة · زيادة قيمة الحساب 6.3 مليون' }
  },
  {
    key: 'compliance',
    label: { en: 'Brand consistency & billing', ar: 'اتساق العلامة والفوترة' },
    description: {
      en: 'Brand-book compliance at scale and clean ZATCA e-invoicing — fewer reshoots, fewer disputes, and finance that reconciles itself.',
      ar: 'التزام بدليل العلامة على نطاق واسع وفوترة إلكترونية سليمة (هيئة الزكاة) — تصوير أقل إعادةً، ونزاعات أقل، ومالية تسوّي نفسها.'
    },
    amountSar: 2_900_000,
    detail: { en: '98% brand pass-rate · clean e-invoicing · SAR 2.9M', ar: '98% اجتياز للعلامة · فوترة إلكترونية سليمة · 2.9 مليون' }
  }
]

const generatedAt = '2026-06-15T08:00:00Z'

let savingsState: SavingsState | null = null

export function getSavingsState(): SavingsState {
  if (savingsState) return savingsState
  savingsState = {
    ytdSar: jitter(ytdSar, 50_000),
    monthSar,
    runRateAnnualSar: runRate,
    baselineCostSar: baseline,
    withJarvisCostSar: withJarvis,
    roiMultiplier: roi,
    fteHoursReclaimed: fteHours,
    modulesContributing,
    generatedAt,
    categories,
    byDept: [...DEPT_SAVINGS].sort((a, b) => b.ytdSar - a.ytdSar),
    monthlyTrend,
    comparisonTrend
  }
  return savingsState
}

export function formatSar(value: number, locale: 'en' | 'ar'): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    const v = (value / 1_000_000).toFixed(2)
    return locale === 'ar' ? `${v} مليون ريال` : `SAR ${v}M`
  }
  if (abs >= 1_000) {
    const v = (value / 1_000).toFixed(0)
    return locale === 'ar' ? `${v} ألف ريال` : `SAR ${v}K`
  }
  return locale === 'ar' ? `${Math.round(value)} ريال` : `SAR ${Math.round(value)}`
}

export function formatHours(value: number, locale: 'en' | 'ar'): string {
  const v = value.toLocaleString('en-US')
  return locale === 'ar' ? `${v} ساعة` : `${v} hrs`
}
