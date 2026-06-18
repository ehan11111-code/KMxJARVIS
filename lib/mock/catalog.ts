import type { Bi, NodeKind, Scope } from './types'

export type SolutionSeed = {
  slug: string
  name: Bi
  context: Bi
  /** internal = runs Kattan Media's own team · delivery = executes the service for the selected client */
  scope: Scope
  systems: string[]
  kpiSeeds: { label: Bi; format: 'int' | 'pct' | 'sar' | 'ms' | 'hrs'; range: [number, number]; highlight?: boolean }[]
  chartTitle: Bi
  chartA: Bi
  chartB: Bi
  workflow: { id: string; label: Bi; kind: NodeKind }[]
  decisionTemplates: Bi[]
  interventionTemplates: Bi[]
  activityTemplates: Bi[]
}

export type DepartmentSeed = {
  slug: string
  name: Bi
  contextLine: Bi
  kpiSeeds: { label: Bi; format: 'int' | 'pct' | 'sar' | 'ms' | 'hrs'; range: [number, number]; highlight?: boolean }[]
  solutions: SolutionSeed[]
}

const std = (id: string, en: string, ar: string, kind: NodeKind) => ({ id, label: { en, ar }, kind })

const baseWorkflow = (
  sourceA: string, sourceAAr: string,
  sourceB: string, sourceBAr: string,
  agent: string, agentAr: string,
  integ: string, integAr: string,
  output: string, outputAr: string
) => [
  std('s1', sourceA, sourceAAr, 'source'),
  std('s2', sourceB, sourceBAr, 'source'),
  std('a1', agent, agentAr, 'agent'),
  std('i1', integ, integAr, 'integration'),
  std('o1', output, outputAr, 'output')
]

export const departmentSeeds: DepartmentSeed[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1 · Social Media & Communications
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'social-comms',
    name: { en: 'Social & Communications', ar: 'الاتصال ووسائل التواصل' },
    contextLine: {
      en: 'Five workflows live · publishing and listening across every channel for this client.',
      ar: 'خمسة تدفقات نشطة · نشر وإنصات عبر كل المنصات لهذا العميل.'
    },
    kpiSeeds: [
      { label: { en: 'Posts scheduled · 7d', ar: 'منشورات مجدولة · 7 أيام' }, format: 'int', range: [120, 300] },
      { label: { en: 'Avg engagement rate', ar: 'متوسط معدل التفاعل' }, format: 'pct', range: [3, 8], highlight: true },
      { label: { en: 'Inbox backlog', ar: 'متراكم الرسائل' }, format: 'int', range: [10, 60] },
      { label: { en: 'Sentiment alerts open', ar: 'تنبيهات المشاعر المفتوحة' }, format: 'int', range: [0, 6] }
    ],
    solutions: [
      {
        slug: 'publishing-orchestration',
        name: { en: 'Publishing Orchestration', ar: 'تنسيق النشر' },
        context: {
          en: 'Schedules and publishes across Snapchat, TikTok, Instagram and X with the right format per platform — no missed slots.',
          ar: 'يجدول وينشر عبر سناب شات وتيك توك وإنستغرام وإكس بالصيغة المناسبة لكل منصة — دون أي موعد فائت.'
        },
        scope: 'delivery',
        systems: ['Sprout Social', 'Meta Business', 'TikTok', 'Snapchat'],
        kpiSeeds: [
          { label: { en: 'POSTS PUBLISHED · 24H', ar: 'منشورات نُشرت · 24س' }, format: 'int', range: [60, 140] },
          { label: { en: 'ON-SCHEDULE RATE', ar: 'نسبة الالتزام بالموعد' }, format: 'pct', range: [94, 99], highlight: true },
          { label: { en: 'FAILURES RETRIED', ar: 'إخفاقات أُعيد إرسالها' }, format: 'int', range: [0, 8] },
          { label: { en: 'CHANNELS LIVE', ar: 'منصات نشطة' }, format: 'int', range: [4, 7] }
        ],
        chartTitle: { en: 'PUBLISHED vs ENGAGEMENT · 14D', ar: 'المنشور مقابل التفاعل · 14 يومًا' },
        chartA: { en: 'Published', ar: 'منشور' },
        chartB: { en: 'Engagement', ar: 'تفاعل' },
        workflow: baseWorkflow('Content calendar', 'تقويم المحتوى', 'Approved assets', 'أصول معتمدة', 'Publishing agent', 'وكيل النشر', 'Platform APIs', 'واجهات المنصات', 'Live posts', 'منشورات منشورة'),
        decisionTemplates: [
          { en: 'Published POST-{n} to {q} channels on schedule', ar: 'نشر POST-{n} على {q} منصة في موعده' },
          { en: 'Re-formatted POST-{n} for vertical · TikTok + Snap', ar: 'إعادة تنسيق POST-{n} للوضع العمودي · تيك توك + سناب' }
        ],
        interventionTemplates: [
          { en: 'POST-{n} failed on X · approve retry or reschedule', ar: 'فشل POST-{n} على إكس · اعتماد إعادة الإرسال أو الجدولة' }
        ],
        activityTemplates: [
          { en: 'Published {n} posts across {q} channels', ar: 'نشر {n} منشورًا عبر {q} منصة' },
          { en: 'Queued {n} posts for the week', ar: 'جدولة {n} منشورًا للأسبوع' }
        ]
      },
      {
        slug: 'inbox-triage',
        name: { en: 'Engagement & Inbox Triage', ar: 'فرز التفاعل والرسائل' },
        context: {
          en: 'Routes comments and DMs, drafts on-brand replies, and escalates what a human must answer.',
          ar: 'يوجّه التعليقات والرسائل، ويصيغ ردودًا متوافقة مع العلامة، ويصعّد ما يحتاج ردًّا بشريًا.'
        },
        scope: 'delivery',
        systems: ['Sprout Social', 'Meta', 'WhatsApp'],
        kpiSeeds: [
          { label: { en: 'ITEMS TRIAGED · 24H', ar: 'عناصر فُرزت · 24س' }, format: 'int', range: [200, 600] },
          { label: { en: 'AUTO-HANDLED', ar: 'عولج تلقائيًا' }, format: 'pct', range: [58, 82], highlight: true },
          { label: { en: 'ESCALATIONS · 7D', ar: 'تصعيدات · 7 أيام' }, format: 'int', range: [8, 30] },
          { label: { en: 'AVG FIRST-RESPONSE', ar: 'متوسط أول رد' }, format: 'ms', range: [400, 1200] }
        ],
        chartTitle: { en: 'TRIAGED vs ESCALATED · 14D', ar: 'مفروز مقابل مُصعَّد · 14 يومًا' },
        chartA: { en: 'Triaged', ar: 'مفروز' },
        chartB: { en: 'Escalated', ar: 'مُصعَّد' },
        workflow: baseWorkflow('Comments + DMs', 'تعليقات ورسائل', 'Brand voice rules', 'قواعد صوت العلامة', 'Triage agent', 'وكيل الفرز', 'Reply drafts', 'مسودات الرد', 'Community queue', 'طابور المجتمع'),
        decisionTemplates: [
          { en: 'Auto-replied to MSG-{n} with approved snippet', ar: 'رد تلقائي على MSG-{n} بقالب معتمد' },
          { en: 'Routed MSG-{n} to community lead · {q} priority', ar: 'توجيه MSG-{n} لقائد المجتمع · أولوية {q}' }
        ],
        interventionTemplates: [
          { en: 'MSG-{n} flagged sensitive · needs human reply', ar: 'MSG-{n} حُدّد كحساس · يحتاج ردًّا بشريًا' }
        ],
        activityTemplates: [
          { en: 'Triaged {n} interactions across {q} accounts', ar: 'فرز {n} تفاعلًا عبر {q} حساب' }
        ]
      },
      {
        slug: 'sentiment-crisis',
        name: { en: 'Sentiment & Crisis Watch', ar: 'رصد المشاعر والأزمات' },
        context: {
          en: 'Detects sentiment shifts and emerging crises before they spread — so the brand responds first.',
          ar: 'يكشف تحوّلات المشاعر والأزمات الناشئة قبل انتشارها — لتستبق العلامة بالرد.'
        },
        scope: 'delivery',
        systems: ['Brandwatch', 'Meltwater', 'Slack'],
        kpiSeeds: [
          { label: { en: 'MENTIONS ANALYSED · 24H', ar: 'إشارات حُلّلت · 24س' }, format: 'int', range: [4000, 12000] },
          { label: { en: 'POSITIVE SENTIMENT', ar: 'مشاعر إيجابية' }, format: 'pct', range: [62, 86], highlight: true },
          { label: { en: 'CRISIS ALERTS · 7D', ar: 'تنبيهات أزمات · 7 أيام' }, format: 'int', range: [0, 4] },
          { label: { en: 'AVG DETECT TIME', ar: 'متوسط زمن الكشف' }, format: 'ms', range: [600, 1600] }
        ],
        chartTitle: { en: 'POSITIVE vs NEGATIVE MENTIONS · 14D', ar: 'إشارات إيجابية مقابل سلبية · 14 يومًا' },
        chartA: { en: 'Positive', ar: 'إيجابي' },
        chartB: { en: 'Negative', ar: 'سلبي' },
        workflow: baseWorkflow('Social listening', 'الإنصات الاجتماعي', 'News + forums', 'أخبار ومنتديات', 'Sentiment model', 'نموذج المشاعر', 'Alert router', 'موجّه التنبيهات', 'Crisis desk', 'مكتب الأزمات'),
        decisionTemplates: [
          { en: 'Flagged rising negative cluster on topic T-{m}', ar: 'رصد تجمّع سلبي متصاعد حول الموضوع T-{m}' }
        ],
        interventionTemplates: [
          { en: 'Sentiment dropped {q}% in 2h · approve response plan', ar: 'هبوط المشاعر {q}% خلال ساعتين · اعتماد خطة الرد' }
        ],
        activityTemplates: [
          { en: 'Scanned {n} mentions across {q} sources', ar: 'فحص {n} إشارة عبر {q} مصدر' }
        ]
      },
      {
        slug: 'content-calendar',
        name: { en: 'Content Calendar Sync', ar: 'مزامنة تقويم المحتوى' },
        context: {
          en: 'Keeps the editorial calendar aligned with every campaign and national moment across all client accounts.',
          ar: 'يبقي التقويم التحريري متوائمًا مع كل حملة ومناسبة وطنية عبر جميع حسابات العملاء.'
        },
        scope: 'delivery',
        systems: ['Notion', 'Asana', 'Sprout Social'],
        kpiSeeds: [
          { label: { en: 'ITEMS SCHEDULED · 7D', ar: 'عناصر مجدولة · 7 أيام' }, format: 'int', range: [120, 280] },
          { label: { en: 'CALENDAR COVERAGE', ar: 'تغطية التقويم' }, format: 'pct', range: [82, 97], highlight: true },
          { label: { en: 'GAPS DETECTED', ar: 'فجوات مكتشفة' }, format: 'int', range: [1, 9] },
          { label: { en: 'RESCHEDULES · 7D', ar: 'إعادة جدولة · 7 أيام' }, format: 'int', range: [4, 20] }
        ],
        chartTitle: { en: 'PLANNED vs PUBLISHED · 14D', ar: 'مخطط مقابل منشور · 14 يومًا' },
        chartA: { en: 'Planned', ar: 'مخطط' },
        chartB: { en: 'Published', ar: 'منشور' },
        workflow: baseWorkflow('Campaign briefs', 'موجزات الحملات', 'National calendar', 'التقويم الوطني', 'Planning agent', 'وكيل التخطيط', 'Editorial board', 'لوحة التحرير', 'Synced calendar', 'تقويم مُزامن'),
        decisionTemplates: [
          { en: 'Filled content gap on day D-{q} with reel concept', ar: 'سدّ فجوة محتوى في اليوم D-{q} بفكرة ريل' }
        ],
        interventionTemplates: [
          { en: 'No post planned for national moment in {q}d · approve fill', ar: 'لا منشور مخطط لمناسبة وطنية خلال {q} يوم · اعتماد التعبئة' }
        ],
        activityTemplates: [
          { en: 'Scheduled {n} items across {q} accounts', ar: 'جدولة {n} عنصرًا عبر {q} حساب' }
        ]
      },
      {
        slug: 'reporting-rollup',
        name: { en: 'Social Reporting Roll-up', ar: 'تجميع تقارير التواصل' },
        context: {
          en: 'Internal: compiles every account\'s weekly social report automatically so the team stops building decks by hand.',
          ar: 'داخلي: يجمّع تقرير التواصل الأسبوعي لكل حساب تلقائيًا، فيتوقف الفريق عن بناء العروض يدويًا.'
        },
        scope: 'internal',
        systems: ['Sprout Social', 'Looker Studio', 'Slides'],
        kpiSeeds: [
          { label: { en: 'REPORTS BUILT · 7D', ar: 'تقارير بُنيت · 7 أيام' }, format: 'int', range: [20, 60] },
          { label: { en: 'DATA FRESHNESS', ar: 'حداثة البيانات' }, format: 'pct', range: [92, 99], highlight: true },
          { label: { en: 'MANUAL EDITS NEEDED', ar: 'تعديلات يدوية لازمة' }, format: 'int', range: [2, 14] },
          { label: { en: 'AVG BUILD TIME', ar: 'متوسط زمن البناء' }, format: 'ms', range: [800, 2400] }
        ],
        chartTitle: { en: 'REPORTS BUILT · 14D', ar: 'التقارير المبنية · 14 يومًا' },
        chartA: { en: 'Auto', ar: 'تلقائي' },
        chartB: { en: 'Manual', ar: 'يدوي' },
        workflow: baseWorkflow('Platform analytics', 'تحليلات المنصات', 'Brand templates', 'قوالب العلامة', 'Reporting agent', 'وكيل التقارير', 'Slides export', 'تصدير العروض', 'Client report', 'تقرير العميل'),
        decisionTemplates: [
          { en: 'Compiled weekly report for account A-{m}', ar: 'بناء تقرير أسبوعي للحساب A-{m}' }
        ],
        interventionTemplates: [
          { en: 'Report A-{m} missing paid data · confirm source', ar: 'تقرير A-{m} ينقصه بيانات مدفوعة · تأكيد المصدر' }
        ],
        activityTemplates: [
          { en: 'Built {n} account reports this cycle', ar: 'بناء {n} تقرير حساب هذه الدورة' }
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2 · Influencer & Talent Management
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'influencers',
    name: { en: 'Influencer & Talent', ar: 'المؤثرون والمواهب' },
    contextLine: {
      en: 'Five workflows live · matching, vetting and tracking creators across 3,000+ relationships.',
      ar: 'خمسة تدفقات نشطة · مطابقة وفحص وتتبع المؤثرين عبر أكثر من 3,000 علاقة.'
    },
    kpiSeeds: [
      { label: { en: 'Creators in pipeline', ar: 'مؤثرون في المسار' }, format: 'int', range: [80, 260] },
      { label: { en: 'On-time deliverables', ar: 'مخرجات في موعدها' }, format: 'pct', range: [82, 96], highlight: true },
      { label: { en: 'Vetting flags open', ar: 'تنبيهات فحص مفتوحة' }, format: 'int', range: [2, 12] },
      { label: { en: 'Avg cost-per-post', ar: 'متوسط كلفة المنشور' }, format: 'sar', range: [1, 6] }
    ],
    solutions: [
      {
        slug: 'influencer-match',
        name: { en: 'Influencer Match & Fit', ar: 'مطابقة المؤثرين والملاءمة' },
        context: {
          en: 'Scores creators against the brief — audience overlap, authenticity and brand-fit — instead of relying on gut feel.',
          ar: 'يقيّم المؤثرين مقابل الموجز — تطابق الجمهور والمصداقية وملاءمة العلامة — بدل الاعتماد على الحدس.'
        },
        scope: 'delivery',
        systems: ['CreatorIQ', 'Meta', 'TikTok'],
        kpiSeeds: [
          { label: { en: 'CREATORS SCORED · 7D', ar: 'مؤثرون قُيّموا · 7 أيام' }, format: 'int', range: [200, 600] },
          { label: { en: 'SHORTLIST FIT', ar: 'ملاءمة القائمة المختصرة' }, format: 'pct', range: [78, 94], highlight: true },
          { label: { en: 'AUDIENCE OVERLAP', ar: 'تداخل الجمهور' }, format: 'pct', range: [40, 72] },
          { label: { en: 'FAKE-FOLLOWER FLAGS', ar: 'تنبيهات متابعين وهميين' }, format: 'int', range: [3, 18] }
        ],
        chartTitle: { en: 'SCORED vs SHORTLISTED · 14D', ar: 'مُقيَّم مقابل مختصر · 14 يومًا' },
        chartA: { en: 'Scored', ar: 'مُقيَّم' },
        chartB: { en: 'Shortlisted', ar: 'مختصر' },
        workflow: baseWorkflow('Creator database', 'قاعدة المؤثرين', 'Campaign brief', 'موجز الحملة', 'Match agent', 'وكيل المطابقة', 'Vetting checks', 'فحوصات التدقيق', 'Shortlist', 'قائمة مختصرة'),
        decisionTemplates: [
          { en: 'Shortlisted INF-{n} · fit score {q}/9 for brief B-{m}', ar: 'ترشيح INF-{n} · درجة ملاءمة {q}/9 للموجز B-{m}' },
          { en: 'Dropped INF-{n} · audience overlap below floor', ar: 'استبعاد INF-{n} · تداخل الجمهور دون الحد' }
        ],
        interventionTemplates: [
          { en: 'INF-{n} shows fake-follower signal · approve manual review', ar: 'INF-{n} يظهر إشارة متابعين وهميين · اعتماد مراجعة يدوية' }
        ],
        activityTemplates: [
          { en: 'Scored {n} creators for {q} briefs', ar: 'تقييم {n} مؤثرًا لـ {q} موجز' }
        ]
      },
      {
        slug: 'campaign-tracking',
        name: { en: 'Campaign Deliverable Tracking', ar: 'تتبع مخرجات الحملة' },
        context: {
          en: 'Tracks every contracted post, story and reel to delivery — and flags slippage before the client notices.',
          ar: 'يتتبع كل منشور وستوري وريل متعاقَد عليه حتى التسليم — وينبّه على أي تأخّر قبل أن يلاحظه العميل.'
        },
        scope: 'delivery',
        systems: ['CreatorIQ', 'Sheets', 'WhatsApp'],
        kpiSeeds: [
          { label: { en: 'DELIVERABLES TRACKED', ar: 'مخرجات متتبعة' }, format: 'int', range: [120, 420] },
          { label: { en: 'ON-TIME RATE', ar: 'نسبة الالتزام بالموعد' }, format: 'pct', range: [80, 96], highlight: true },
          { label: { en: 'AT-RISK · OPEN', ar: 'معرّضة للخطر · مفتوحة' }, format: 'int', range: [2, 14] },
          { label: { en: 'REACH DELIVERED · 7D', ar: 'وصول مُحقَّق · 7 أيام' }, format: 'int', range: [8000, 60000] }
        ],
        chartTitle: { en: 'PLANNED vs DELIVERED · 14D', ar: 'مخطط مقابل مُسلَّم · 14 يومًا' },
        chartA: { en: 'Planned', ar: 'مخطط' },
        chartB: { en: 'Delivered', ar: 'مُسلَّم' },
        workflow: baseWorkflow('Signed contracts', 'عقود موقّعة', 'Live posts feed', 'تغذية المنشورات', 'Tracking agent', 'وكيل التتبع', 'Status board', 'لوحة الحالة', 'Client tracker', 'متتبع العميل'),
        decisionTemplates: [
          { en: 'Marked deliverable D-{n} live · reach {q}0k', ar: 'تأكيد المخرج D-{n} منشور · وصول {q}0 ألف' }
        ],
        interventionTemplates: [
          { en: 'INF-{n} deliverable {q}d late · approve reminder or swap', ar: 'مخرج INF-{n} متأخر {q} يوم · اعتماد تذكير أو استبدال' }
        ],
        activityTemplates: [
          { en: 'Verified {n} deliverables across {q} creators', ar: 'التحقق من {n} مخرجًا عبر {q} مؤثر' }
        ]
      },
      {
        slug: 'roi-per-client',
        name: { en: 'Influencer ROI per Client', ar: 'عائد المؤثرين لكل عميل' },
        context: {
          en: 'Connects creator spend to reach, engagement and conversions so every riyal is defensible to the client.',
          ar: 'يربط إنفاق المؤثرين بالوصول والتفاعل والتحويلات، فيصبح كل ريال قابلًا للتبرير أمام العميل.'
        },
        scope: 'delivery',
        systems: ['CreatorIQ', 'GA4', 'Looker Studio'],
        kpiSeeds: [
          { label: { en: 'TRACKED SPEND · 30D', ar: 'إنفاق متتبع · 30 يوم' }, format: 'sar', range: [2, 9], highlight: true },
          { label: { en: 'COST PER ENGAGEMENT', ar: 'كلفة التفاعل' }, format: 'int', range: [40, 180] },
          { label: { en: 'EARNED MEDIA VALUE', ar: 'القيمة الإعلامية المكتسبة' }, format: 'sar', range: [4, 18] },
          { label: { en: 'CONVERSION SIGNALS', ar: 'إشارات التحويل' }, format: 'int', range: [200, 1400] }
        ],
        chartTitle: { en: 'SPEND vs EARNED VALUE · 14D', ar: 'إنفاق مقابل قيمة مكتسبة · 14 يومًا' },
        chartA: { en: 'Spend', ar: 'إنفاق' },
        chartB: { en: 'Earned value', ar: 'قيمة مكتسبة' },
        workflow: baseWorkflow('Spend records', 'سجلات الإنفاق', 'Performance data', 'بيانات الأداء', 'ROI model', 'نموذج العائد', 'Attribution layer', 'طبقة الإسناد', 'Client ROI view', 'عرض عائد العميل'),
        decisionTemplates: [
          { en: 'Attributed {q}0k engagements to INF-{n} spend', ar: 'إسناد {q}0 ألف تفاعل لإنفاق INF-{n}' }
        ],
        interventionTemplates: [
          { en: 'INF-{n} cost-per-engagement above target · review renewal', ar: 'كلفة تفاعل INF-{n} فوق المستهدف · مراجعة التجديد' }
        ],
        activityTemplates: [
          { en: 'Reconciled ROI for {n} creators', ar: 'تسوية العائد لـ {n} مؤثر' }
        ]
      },
      {
        slug: 'talent-roster',
        name: { en: 'Talent Roster & Contracts', ar: 'سجل المواهب والعقود' },
        context: {
          en: 'Internal: manages exclusively-managed talent — rates, availability, contract terms and renewals in one ledger.',
          ar: 'داخلي: يدير المواهب المُدارة حصريًا — الأسعار والإتاحة وبنود العقود والتجديدات في سجل واحد.'
        },
        scope: 'internal',
        systems: ['Notion', 'DocuSign', 'Sheets'],
        kpiSeeds: [
          { label: { en: 'TALENT MANAGED', ar: 'مواهب مُدارة' }, format: 'int', range: [30, 90] },
          { label: { en: 'UTILISATION', ar: 'نسبة الإشغال' }, format: 'pct', range: [62, 88], highlight: true },
          { label: { en: 'CONTRACTS EXPIRING · 30D', ar: 'عقود تنتهي · 30 يوم' }, format: 'int', range: [1, 8] },
          { label: { en: 'BOOKINGS · 7D', ar: 'حجوزات · 7 أيام' }, format: 'int', range: [10, 40] }
        ],
        chartTitle: { en: 'BOOKINGS vs CAPACITY · 14D', ar: 'الحجوزات مقابل الطاقة · 14 يومًا' },
        chartA: { en: 'Bookings', ar: 'حجوزات' },
        chartB: { en: 'Capacity', ar: 'طاقة' },
        workflow: baseWorkflow('Talent profiles', 'ملفات المواهب', 'Booking requests', 'طلبات الحجز', 'Roster agent', 'وكيل السجل', 'Contract store', 'مخزن العقود', 'Availability board', 'لوحة الإتاحة'),
        decisionTemplates: [
          { en: 'Booked talent T-{m} for project P-{n}', ar: 'حجز الموهبة T-{m} للمشروع P-{n}' }
        ],
        interventionTemplates: [
          { en: 'Talent T-{m} contract expires in {q}d · approve renewal', ar: 'عقد الموهبة T-{m} ينتهي خلال {q} يوم · اعتماد التجديد' }
        ],
        activityTemplates: [
          { en: 'Updated {n} talent profiles · {q} renewals due', ar: 'تحديث {n} ملف موهبة · {q} تجديدات مستحقة' }
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3 · Creative & Production
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'creative-production',
    name: { en: 'Creative & Production', ar: 'الإبداع والإنتاج' },
    contextLine: {
      en: 'Five workflows live · linked to the project tool, design files, video and podcast pipelines.',
      ar: 'خمسة تدفقات نشطة · مرتبطة بأداة المشاريع وملفات التصميم وخطوط الفيديو والبودكاست.'
    },
    kpiSeeds: [
      { label: { en: 'Assets in production', ar: 'أصول قيد الإنتاج' }, format: 'int', range: [80, 180] },
      { label: { en: 'On-time delivery', ar: 'التسليم في الوقت' }, format: 'pct', range: [84, 97], highlight: true },
      { label: { en: 'Brand-check flags', ar: 'تنبيهات فحص العلامة' }, format: 'int', range: [4, 16] },
      { label: { en: 'Avg cycle time', ar: 'متوسط زمن الدورة' }, format: 'hrs', range: [6, 30] }
    ],
    solutions: [
      {
        slug: 'production-pipeline',
        name: { en: 'Production Pipeline Orchestration', ar: 'تنسيق خط الإنتاج' },
        context: {
          en: 'Sequences every asset from brief to delivery across design, video and podcast — and clears bottlenecks early.',
          ar: 'يرتّب كل أصل من الموجز إلى التسليم عبر التصميم والفيديو والبودكاست — ويزيل الاختناقات مبكرًا.'
        },
        scope: 'delivery',
        systems: ['Asana', 'Figma', 'Frame.io'],
        kpiSeeds: [
          { label: { en: 'ASSETS IN FLIGHT', ar: 'أصول قيد التنفيذ' }, format: 'int', range: [60, 160] },
          { label: { en: 'ON-TIME RATE', ar: 'نسبة الالتزام بالموعد' }, format: 'pct', range: [84, 97], highlight: true },
          { label: { en: 'STUCK > 48H', ar: 'متوقفة > 48س' }, format: 'int', range: [2, 12] },
          { label: { en: 'AVG CYCLE', ar: 'متوسط الدورة' }, format: 'hrs', range: [6, 28] }
        ],
        chartTitle: { en: 'IN-FLIGHT vs DELIVERED · 14D', ar: 'قيد التنفيذ مقابل مُسلَّم · 14 يومًا' },
        chartA: { en: 'In flight', ar: 'قيد التنفيذ' },
        chartB: { en: 'Delivered', ar: 'مُسلَّم' },
        workflow: baseWorkflow('Creative briefs', 'الموجزات الإبداعية', 'Project board', 'لوحة المشاريع', 'Pipeline agent', 'وكيل الإنتاج', 'Review + approval', 'مراجعة واعتماد', 'Delivered assets', 'أصول مُسلَّمة'),
        decisionTemplates: [
          { en: 'Advanced asset AS-{n} to review · {q} of 5 stages', ar: 'تقديم الأصل AS-{n} إلى المراجعة · المرحلة {q} من 5' }
        ],
        interventionTemplates: [
          { en: 'Asset AS-{n} stuck {q}d in edit · approve reassignment', ar: 'الأصل AS-{n} متوقف {q} يوم في المونتاج · اعتماد إعادة الإسناد' }
        ],
        activityTemplates: [
          { en: 'Moved {n} assets across {q} stages', ar: 'تحريك {n} أصلًا عبر {q} مرحلة' }
        ]
      },
      {
        slug: 'brand-compliance',
        name: { en: 'Brand-Compliance Check', ar: 'فحص الالتزام بالعلامة' },
        context: {
          en: 'Checks every asset against the brand book — logo, colour, type and claims — before it ships to the client.',
          ar: 'يفحص كل أصل مقابل دليل العلامة — الشعار واللون والخط والادعاءات — قبل تسليمه للعميل.'
        },
        scope: 'delivery',
        systems: ['DAM', 'Figma', 'Brand rules'],
        kpiSeeds: [
          { label: { en: 'ASSETS CHECKED · 24H', ar: 'أصول فُحصت · 24س' }, format: 'int', range: [80, 220] },
          { label: { en: 'PASS RATE', ar: 'نسبة النجاح' }, format: 'pct', range: [82, 96], highlight: true },
          { label: { en: 'FLAGS · 7D', ar: 'تنبيهات · 7 أيام' }, format: 'int', range: [8, 30] },
          { label: { en: 'AVG CHECK TIME', ar: 'متوسط زمن الفحص' }, format: 'ms', range: [300, 900] }
        ],
        chartTitle: { en: 'CHECKED vs FLAGGED · 14D', ar: 'مفحوص مقابل مُنبَّه · 14 يومًا' },
        chartA: { en: 'Checked', ar: 'مفحوص' },
        chartB: { en: 'Flagged', ar: 'مُنبَّه' },
        workflow: baseWorkflow('Submitted assets', 'أصول مُقدَّمة', 'Brand book', 'دليل العلامة', 'Compliance agent', 'وكيل الالتزام', 'Designer feedback', 'ملاحظات المصمم', 'Cleared assets', 'أصول مُعتمدة'),
        decisionTemplates: [
          { en: 'Passed AS-{n} on all brand checks', ar: 'اجتياز AS-{n} كل فحوصات العلامة' },
          { en: 'Flagged AS-{n} · logo clear-space violation', ar: 'تنبيه AS-{n} · مخالفة مساحة أمان الشعار' }
        ],
        interventionTemplates: [
          { en: 'AS-{n} uses off-palette colour · approve exception or fix', ar: 'AS-{n} يستخدم لونًا خارج اللوحة · اعتماد استثناء أو تصحيح' }
        ],
        activityTemplates: [
          { en: 'Checked {n} assets · {q} flagged', ar: 'فحص {n} أصلًا · {q} مُنبَّه' }
        ]
      },
      {
        slug: 'video-podcast-pipeline',
        name: { en: 'Video & Podcast Pipeline', ar: 'خط الفيديو والبودكاست' },
        context: {
          en: 'Runs shoots, edits and audio from concept to multi-platform cut-downs — studio prep through post.',
          ar: 'يدير التصوير والمونتاج والصوت من الفكرة إلى نسخ متعددة المنصات — من تجهيز الاستوديو إلى ما بعد الإنتاج.'
        },
        scope: 'delivery',
        systems: ['Frame.io', 'Premiere', 'Studio booking'],
        kpiSeeds: [
          { label: { en: 'PRODUCTIONS ACTIVE', ar: 'إنتاجات نشطة' }, format: 'int', range: [8, 28] },
          { label: { en: 'ON-TIME CUTS', ar: 'نسخ في موعدها' }, format: 'pct', range: [80, 95], highlight: true },
          { label: { en: 'CUT-DOWNS · 7D', ar: 'نسخ مختصرة · 7 أيام' }, format: 'int', range: [30, 140] },
          { label: { en: 'AVG TURNAROUND', ar: 'متوسط زمن التنفيذ' }, format: 'hrs', range: [12, 48] }
        ],
        chartTitle: { en: 'SHOOTS vs PUBLISHED CUTS · 14D', ar: 'تصوير مقابل نسخ منشورة · 14 يومًا' },
        chartA: { en: 'Shoots', ar: 'تصوير' },
        chartB: { en: 'Cuts', ar: 'نسخ' },
        workflow: baseWorkflow('Shoot schedule', 'جدول التصوير', 'Raw footage', 'لقطات خام', 'Production agent', 'وكيل الإنتاج', 'Edit + review', 'مونتاج ومراجعة', 'Platform cuts', 'نسخ المنصات'),
        decisionTemplates: [
          { en: 'Generated {q} platform cut-downs from shoot SH-{n}', ar: 'توليد {q} نسخة منصة من التصوير SH-{n}' }
        ],
        interventionTemplates: [
          { en: 'Shoot SH-{n} edit at risk for air date · approve overtime', ar: 'مونتاج التصوير SH-{n} مهدد لموعد البث · اعتماد عمل إضافي' }
        ],
        activityTemplates: [
          { en: 'Delivered {n} cut-downs across {q} productions', ar: 'تسليم {n} نسخة عبر {q} إنتاج' }
        ]
      },
      {
        slug: 'asset-versioning',
        name: { en: 'Asset Versioning & Approval', ar: 'إصدارات الأصول والاعتماد' },
        context: {
          en: 'Keeps one source of truth across rounds and channels so the latest approved version is never lost.',
          ar: 'يحافظ على مصدر واحد للحقيقة عبر الجولات والقنوات، فلا تضيع آخر نسخة معتمدة أبدًا.'
        },
        scope: 'delivery',
        systems: ['Figma', 'DAM', 'Drive'],
        kpiSeeds: [
          { label: { en: 'VERSIONS TRACKED · 24H', ar: 'إصدارات متتبعة · 24س' }, format: 'int', range: [120, 360] },
          { label: { en: 'LATEST-VERSION ACCURACY', ar: 'دقة آخر إصدار' }, format: 'pct', range: [90, 99], highlight: true },
          { label: { en: 'CONFLICTS RESOLVED', ar: 'تعارضات حُلّت' }, format: 'int', range: [2, 16] },
          { label: { en: 'ROUNDS PER ASSET', ar: 'جولات لكل أصل' }, format: 'int', range: [2, 5] }
        ],
        chartTitle: { en: 'VERSIONS vs APPROVED · 14D', ar: 'إصدارات مقابل معتمدة · 14 يومًا' },
        chartA: { en: 'Versions', ar: 'إصدارات' },
        chartB: { en: 'Approved', ar: 'معتمدة' },
        workflow: baseWorkflow('Design files', 'ملفات التصميم', 'Feedback rounds', 'جولات الملاحظات', 'Versioning agent', 'وكيل الإصدارات', 'DAM library', 'مكتبة الأصول', 'Approved master', 'النسخة المعتمدة'),
        decisionTemplates: [
          { en: 'Locked v{q} of AS-{n} as approved master', ar: 'تثبيت النسخة v{q} من AS-{n} كنسخة معتمدة' }
        ],
        interventionTemplates: [
          { en: 'Two live versions of AS-{n} · confirm source of truth', ar: 'نسختان حيّتان من AS-{n} · تأكيد المصدر المعتمد' }
        ],
        activityTemplates: [
          { en: 'Reconciled {n} versions across {q} assets', ar: 'تسوية {n} إصدارًا عبر {q} أصل' }
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4 · Strategy & Client Accounts
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'strategy-accounts',
    name: { en: 'Strategy & Accounts', ar: 'الاستراتيجية والحسابات' },
    contextLine: {
      en: 'Five workflows live · strategy, PR and account health connected across every client.',
      ar: 'خمسة تدفقات نشطة · الاستراتيجية والعلاقات العامة وصحة الحسابات مترابطة عبر كل عميل.'
    },
    kpiSeeds: [
      { label: { en: 'Active accounts', ar: 'حسابات نشطة' }, format: 'int', range: [12, 30] },
      { label: { en: 'Account health index', ar: 'مؤشر صحة الحساب' }, format: 'pct', range: [74, 94], highlight: true },
      { label: { en: 'At-risk accounts', ar: 'حسابات معرّضة' }, format: 'int', range: [1, 5] },
      { label: { en: 'Approvals pending', ar: 'موافقات معلّقة' }, format: 'int', range: [6, 20] }
    ],
    solutions: [
      {
        slug: 'account-health',
        name: { en: 'Account Health Monitor', ar: 'مراقب صحة الحساب' },
        context: {
          en: 'Scores each account from delivery, engagement and sentiment signals — surfacing churn risk before renewal.',
          ar: 'يقيّم كل حساب من إشارات التسليم والتفاعل والمشاعر — ويُبرز خطر الفقد قبل موعد التجديد.'
        },
        scope: 'delivery',
        systems: ['HubSpot', 'Slack', 'Harvest'],
        kpiSeeds: [
          { label: { en: 'ACCOUNTS SCORED · 24H', ar: 'حسابات قُيّمت · 24س' }, format: 'int', range: [12, 30] },
          { label: { en: 'HEALTH INDEX', ar: 'مؤشر الصحة' }, format: 'pct', range: [74, 94], highlight: true },
          { label: { en: 'AT-RISK · OPEN', ar: 'معرّضة · مفتوحة' }, format: 'int', range: [1, 5] },
          { label: { en: 'AVG RESPONSE SLA', ar: 'متوسط زمن الاستجابة' }, format: 'hrs', range: [1, 6] }
        ],
        chartTitle: { en: 'HEALTH vs AT-RISK · 14D', ar: 'الصحة مقابل المعرّضة · 14 يومًا' },
        chartA: { en: 'Healthy', ar: 'سليمة' },
        chartB: { en: 'At-risk', ar: 'معرّضة' },
        workflow: baseWorkflow('Delivery data', 'بيانات التسليم', 'Sentiment + engagement', 'المشاعر والتفاعل', 'Health agent', 'وكيل الصحة', 'Account scoring', 'تقييم الحساب', 'Risk dashboard', 'لوحة المخاطر'),
        decisionTemplates: [
          { en: 'Lowered health of account A-{m} to {q}0% · delivery slip', ar: 'خفض صحة الحساب A-{m} إلى {q}0% · تأخر التسليم' }
        ],
        interventionTemplates: [
          { en: 'Account A-{m} at-risk · approve retention outreach', ar: 'الحساب A-{m} معرّض · اعتماد تواصل الاحتفاظ' }
        ],
        activityTemplates: [
          { en: 'Re-scored {n} accounts on latest signals', ar: 'إعادة تقييم {n} حساب على آخر الإشارات' }
        ]
      },
      {
        slug: 'pr-media-monitoring',
        name: { en: 'PR & Media Monitoring', ar: 'رصد العلاقات العامة والإعلام' },
        context: {
          en: 'Tracks coverage, share of voice and journalist relationships so PR results are measured, not guessed.',
          ar: 'يتتبع التغطية وحصة الصوت وعلاقات الصحفيين، فتُقاس نتائج العلاقات العامة لا تُخمَّن.'
        },
        scope: 'delivery',
        systems: ['Meltwater', 'Google News', 'CRM'],
        kpiSeeds: [
          { label: { en: 'COVERAGE TRACKED · 7D', ar: 'تغطية متتبعة · 7 أيام' }, format: 'int', range: [40, 180] },
          { label: { en: 'SHARE OF VOICE', ar: 'حصة الصوت' }, format: 'pct', range: [22, 52], highlight: true },
          { label: { en: 'POSITIVE COVERAGE', ar: 'تغطية إيجابية' }, format: 'pct', range: [60, 88] },
          { label: { en: 'PITCHES SENT · 7D', ar: 'عروض صحفية أُرسلت · 7 أيام' }, format: 'int', range: [10, 40] }
        ],
        chartTitle: { en: 'COVERAGE vs SHARE OF VOICE · 14D', ar: 'التغطية مقابل حصة الصوت · 14 يومًا' },
        chartA: { en: 'Coverage', ar: 'تغطية' },
        chartB: { en: 'Share of voice', ar: 'حصة الصوت' },
        workflow: baseWorkflow('Media monitoring', 'الرصد الإعلامي', 'Press contacts', 'جهات صحفية', 'PR agent', 'وكيل العلاقات', 'Coverage tagging', 'وسم التغطية', 'PR scorecard', 'بطاقة أداء PR'),
        decisionTemplates: [
          { en: 'Logged {q} new coverage items for account A-{m}', ar: 'تسجيل {q} تغطية جديدة للحساب A-{m}' }
        ],
        interventionTemplates: [
          { en: 'Negative article on A-{m} gaining traction · approve response', ar: 'مقال سلبي عن A-{m} يكتسب انتشارًا · اعتماد الرد' }
        ],
        activityTemplates: [
          { en: 'Tagged {n} coverage items across {q} accounts', ar: 'وسم {n} تغطية عبر {q} حساب' }
        ]
      },
      {
        slug: 'brand-launch',
        name: { en: 'Brand-Launch Orchestration', ar: 'تنسيق تدشين العلامات' },
        context: {
          en: 'Coordinates a full launch — strategy, creative, influencers and media — into one synchronized timeline.',
          ar: 'ينسّق تدشينًا كاملًا — استراتيجية وإبداع ومؤثرين وإعلام — في خط زمني واحد متزامن.'
        },
        scope: 'delivery',
        systems: ['Asana', 'CreatorIQ', 'Media plan'],
        kpiSeeds: [
          { label: { en: 'LAUNCH MILESTONES', ar: 'مراحل التدشين' }, format: 'int', range: [12, 40] },
          { label: { en: 'ON-TRACK', ar: 'على المسار' }, format: 'pct', range: [78, 96], highlight: true },
          { label: { en: 'CROSS-TEAM BLOCKERS', ar: 'معوقات بين الفرق' }, format: 'int', range: [0, 6] },
          { label: { en: 'DAYS TO LAUNCH', ar: 'أيام حتى التدشين' }, format: 'int', range: [5, 40] }
        ],
        chartTitle: { en: 'MILESTONES PLANNED vs DONE · 14D', ar: 'مراحل مخططة مقابل منجزة · 14 يومًا' },
        chartA: { en: 'Planned', ar: 'مخطط' },
        chartB: { en: 'Done', ar: 'منجز' },
        workflow: baseWorkflow('Launch brief', 'موجز التدشين', 'Dept timelines', 'خطط الأقسام', 'Launch agent', 'وكيل التدشين', 'Cross-team sync', 'مزامنة الفرق', 'Launch board', 'لوحة التدشين'),
        decisionTemplates: [
          { en: 'Cleared milestone M-{q} for launch L-{m}', ar: 'إنجاز المرحلة M-{q} للتدشين L-{m}' }
        ],
        interventionTemplates: [
          { en: 'Creative not ready for launch L-{m} in {q}d · approve plan B', ar: 'الإبداع غير جاهز للتدشين L-{m} خلال {q} يوم · اعتماد الخطة البديلة' }
        ],
        activityTemplates: [
          { en: 'Synced {n} milestones across {q} teams', ar: 'مزامنة {n} مرحلة عبر {q} فريق' }
        ]
      },
      {
        slug: 'qbr-autobuild',
        name: { en: 'QBR Auto-Assembly', ar: 'بناء مراجعة الأعمال آليًا' },
        context: {
          en: 'Internal: compiles quarterly business reviews from live performance data, ready for the account lead to present.',
          ar: 'داخلي: يبني مراجعات الأعمال الفصلية من بيانات الأداء الحية، جاهزة ليقدّمها مدير الحساب.'
        },
        scope: 'internal',
        systems: ['Looker Studio', 'GA4', 'Slides'],
        kpiSeeds: [
          { label: { en: 'QBRs ASSEMBLED · 30D', ar: 'مراجعات بُنيت · 30 يوم' }, format: 'int', range: [6, 24] },
          { label: { en: 'DATA FRESHNESS', ar: 'حداثة البيانات' }, format: 'pct', range: [90, 99], highlight: true },
          { label: { en: 'MANUAL EDITS NEEDED', ar: 'تعديلات يدوية لازمة' }, format: 'int', range: [3, 16] },
          { label: { en: 'AVG BUILD TIME', ar: 'متوسط زمن البناء' }, format: 'ms', range: [1200, 3200] }
        ],
        chartTitle: { en: 'QBRs ASSEMBLED · 14D', ar: 'المراجعات المبنية · 14 يومًا' },
        chartA: { en: 'Auto', ar: 'تلقائي' },
        chartB: { en: 'Manual', ar: 'يدوي' },
        workflow: baseWorkflow('Account data', 'بيانات الحساب', 'QBR template', 'قالب المراجعة', 'QBR agent', 'وكيل المراجعة', 'Slides export', 'تصدير العروض', 'QBR deck', 'عرض المراجعة'),
        decisionTemplates: [
          { en: 'Assembled QBR for account A-{m} · {q} sections', ar: 'بناء مراجعة الحساب A-{m} · {q} أقسام' }
        ],
        interventionTemplates: [
          { en: 'QBR A-{m} missing media-buying numbers · confirm', ar: 'مراجعة A-{m} تنقصها أرقام الشراء الإعلاني · تأكيد' }
        ],
        activityTemplates: [
          { en: 'Built {n} QBR decks this cycle', ar: 'بناء {n} عرض مراجعة هذه الدورة' }
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5 · Media Planning & Buying
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'media-buying',
    name: { en: 'Media Planning & Buying', ar: 'التخطيط والشراء الإعلاني' },
    contextLine: {
      en: 'Five workflows live · pacing spend across Google, Meta, TikTok, Snap and X.',
      ar: 'خمسة تدفقات نشطة · ضبط الإنفاق عبر جوجل وميتا وتيك توك وسناب وإكس.'
    },
    kpiSeeds: [
      { label: { en: 'Active campaigns', ar: 'حملات نشطة' }, format: 'int', range: [40, 110] },
      { label: { en: 'Managed spend · 30d', ar: 'إنفاق مُدار · 30 يوم' }, format: 'sar', range: [3, 12], highlight: true },
      { label: { en: 'Pacing exceptions', ar: 'استثناءات الإيقاع' }, format: 'int', range: [3, 11] },
      { label: { en: 'Avg ROAS', ar: 'متوسط العائد على الإنفاق' }, format: 'pct', range: [180, 340] }
    ],
    solutions: [
      {
        slug: 'spend-pacing',
        name: { en: 'Cross-Channel Spend Pacing', ar: 'ضبط الإنفاق عبر القنوات' },
        context: {
          en: 'Keeps every campaign on budget across channels in real time — no overspend, no underspend at month-end.',
          ar: 'يبقي كل حملة ضمن الميزانية عبر القنوات لحظيًا — لا تجاوز ولا قصور في نهاية الشهر.'
        },
        scope: 'delivery',
        systems: ['Google Ads', 'Meta Ads', 'TikTok Ads'],
        kpiSeeds: [
          { label: { en: 'CAMPAIGNS PACED · 24H', ar: 'حملات مضبوطة · 24س' }, format: 'int', range: [40, 110] },
          { label: { en: 'ON-PACE RATE', ar: 'نسبة ضبط الإيقاع' }, format: 'pct', range: [88, 98], highlight: true },
          { label: { en: 'OVER-PACE ALERTS', ar: 'تنبيهات تجاوز الإيقاع' }, format: 'int', range: [2, 12] },
          { label: { en: 'BUDGET REALLOCATED · 7D', ar: 'ميزانية أُعيد توزيعها · 7 أيام' }, format: 'sar', range: [1, 5] }
        ],
        chartTitle: { en: 'PLANNED vs ACTUAL SPEND · 14D', ar: 'إنفاق مخطط مقابل فعلي · 14 يومًا' },
        chartA: { en: 'Planned', ar: 'مخطط' },
        chartB: { en: 'Actual', ar: 'فعلي' },
        workflow: baseWorkflow('Ad platforms', 'منصات الإعلان', 'Budget plan', 'خطة الميزانية', 'Pacing agent', 'وكيل الإيقاع', 'Bid adjustments', 'تعديلات المزايدة', 'On-pace campaigns', 'حملات مضبوطة'),
        decisionTemplates: [
          { en: 'Reallocated SAR {q}0k from CMP-{n} to CMP-{m} on ROAS', ar: 'إعادة توزيع {q}0 ألف ريال من CMP-{n} إلى CMP-{m} حسب العائد' }
        ],
        interventionTemplates: [
          { en: 'CMP-{n} pacing {q}0% of budget · approve cap', ar: 'CMP-{n} يستهلك {q}0% من الميزانية · اعتماد سقف' }
        ],
        activityTemplates: [
          { en: 'Paced {n} campaigns across {q} channels', ar: 'ضبط {n} حملة عبر {q} قناة' }
        ]
      },
      {
        slug: 'waste-anomaly',
        name: { en: 'Spend Anomaly & Waste Detection', ar: 'كشف الشذوذ وهدر الإنفاق' },
        context: {
          en: 'Catches broken tracking, runaway spend and zombie ad sets before the budget drains.',
          ar: 'يلتقط التتبع المعطوب والإنفاق الجامح والمجموعات الإعلانية الميتة قبل أن تستنزف الميزانية.'
        },
        scope: 'delivery',
        systems: ['Google Ads', 'Meta Ads', 'GA4'],
        kpiSeeds: [
          { label: { en: 'ANOMALIES CAUGHT · 7D', ar: 'حالات شاذة مرصودة · 7 أيام' }, format: 'int', range: [4, 18], highlight: true },
          { label: { en: 'SPEND PROTECTED · 30D', ar: 'إنفاق محمي · 30 يوم' }, format: 'sar', range: [1, 4] },
          { label: { en: 'FALSE-POSITIVE RATE', ar: 'نسبة الإنذار الكاذب' }, format: 'pct', range: [4, 14] },
          { label: { en: 'AVG DETECT TIME', ar: 'متوسط زمن الكشف' }, format: 'ms', range: [300, 1100] }
        ],
        chartTitle: { en: 'ANOMALIES vs SPEND PROTECTED · 14D', ar: 'حالات شاذة مقابل إنفاق محمي · 14 يومًا' },
        chartA: { en: 'Anomalies', ar: 'شذوذ' },
        chartB: { en: 'Protected', ar: 'محمي' },
        workflow: baseWorkflow('Spend stream', 'تدفق الإنفاق', 'Conversion data', 'بيانات التحويل', 'Anomaly agent', 'وكيل الشذوذ', 'Auto-pause rules', 'قواعد الإيقاف', 'Protected budget', 'ميزانية محمية'),
        decisionTemplates: [
          { en: 'Paused ad set AD-{n} · CPA spiked {q}0%', ar: 'إيقاف المجموعة AD-{n} · ارتفاع الكلفة {q}0%' }
        ],
        interventionTemplates: [
          { en: 'Tracking broke on CMP-{n} · approve pause', ar: 'تعطل التتبع في CMP-{n} · اعتماد الإيقاف' }
        ],
        activityTemplates: [
          { en: 'Scanned {n} ad sets · {q} anomalies caught', ar: 'فحص {n} مجموعة إعلانية · {q} حالة شاذة' }
        ]
      },
      {
        slug: 'media-plan-builder',
        name: { en: 'Media Plan Builder', ar: 'باني الخطة الإعلامية' },
        context: {
          en: 'Turns a budget and objective into a channel-split media plan with reach and frequency forecasts.',
          ar: 'يحوّل الميزانية والهدف إلى خطة إعلامية موزّعة على القنوات مع توقعات الوصول والتكرار.'
        },
        scope: 'delivery',
        systems: ['Planning sheet', 'GA4', 'Platform forecasts'],
        kpiSeeds: [
          { label: { en: 'PLANS BUILT · 30D', ar: 'خطط بُنيت · 30 يوم' }, format: 'int', range: [8, 30] },
          { label: { en: 'FORECAST ACCURACY', ar: 'دقة التوقع' }, format: 'pct', range: [78, 93], highlight: true },
          { label: { en: 'AVG CHANNELS / PLAN', ar: 'متوسط القنوات / خطة' }, format: 'int', range: [3, 6] },
          { label: { en: 'PLANNED REACH', ar: 'الوصول المخطط' }, format: 'int', range: [20000, 90000] }
        ],
        chartTitle: { en: 'PLANNED vs DELIVERED REACH · 14D', ar: 'وصول مخطط مقابل مُحقَّق · 14 يومًا' },
        chartA: { en: 'Planned', ar: 'مخطط' },
        chartB: { en: 'Delivered', ar: 'مُحقَّق' },
        workflow: baseWorkflow('Brief + budget', 'الموجز والميزانية', 'Audience data', 'بيانات الجمهور', 'Planning agent', 'وكيل التخطيط', 'Channel split', 'توزيع القنوات', 'Media plan', 'خطة إعلامية'),
        decisionTemplates: [
          { en: 'Built media plan MP-{n} · {q} channels for A-{m}', ar: 'بناء خطة MP-{n} · {q} قناة للحساب A-{m}' }
        ],
        interventionTemplates: [
          { en: 'Budget for A-{m} below reach goal · approve scope change', ar: 'ميزانية A-{m} دون هدف الوصول · اعتماد تعديل النطاق' }
        ],
        activityTemplates: [
          { en: 'Drafted {n} media plans across {q} accounts', ar: 'إعداد {n} خطة إعلامية عبر {q} حساب' }
        ]
      },
      {
        slug: 'performance-pacing',
        name: { en: 'Performance & Goal Pacing', ar: 'ضبط الأداء والأهداف' },
        context: {
          en: 'Internal: projects whether each client hits monthly KPI and spend goals, and flags drift to the buying team.',
          ar: 'داخلي: يتوقع بلوغ كل عميل لأهداف المؤشرات والإنفاق الشهرية، وينبّه فريق الشراء على أي انحراف.'
        },
        scope: 'internal',
        systems: ['BigQuery', 'GA4', 'Sheets'],
        kpiSeeds: [
          { label: { en: 'GOALS TRACKED', ar: 'أهداف متتبعة' }, format: 'int', range: [20, 60] },
          { label: { en: 'ON-PACE RATE', ar: 'نسبة الالتزام' }, format: 'pct', range: [70, 92], highlight: true },
          { label: { en: 'DRIFT ALERTS · 7D', ar: 'تنبيهات انحراف · 7 أيام' }, format: 'int', range: [2, 12] },
          { label: { en: 'FORECAST ACCURACY', ar: 'دقة التوقع' }, format: 'pct', range: [80, 95] }
        ],
        chartTitle: { en: 'GOAL vs PROJECTED · 14D', ar: 'الهدف مقابل المتوقع · 14 يومًا' },
        chartA: { en: 'Goal', ar: 'الهدف' },
        chartB: { en: 'Projected', ar: 'المتوقع' },
        workflow: baseWorkflow('Live KPIs', 'مؤشرات حية', 'Monthly goals', 'أهداف شهرية', 'Pacing agent', 'وكيل الضبط', 'Drift alerts', 'تنبيهات الانحراف', 'Buying team view', 'عرض فريق الشراء'),
        decisionTemplates: [
          { en: 'Projected A-{m} to miss goal by {q}% · alerted team', ar: 'توقّع عدم بلوغ A-{m} الهدف بـ {q}% · تنبيه الفريق' }
        ],
        interventionTemplates: [
          { en: 'A-{m} pacing {q}0% behind goal · approve budget shift', ar: 'A-{m} متأخر {q}0% عن الهدف · اعتماد تحويل الميزانية' }
        ],
        activityTemplates: [
          { en: 'Re-forecast {n} client goals', ar: 'إعادة توقّع {n} هدف عميل' }
        ]
      }
    ]
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6 · Operations, Admin & Finance
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'operations-finance',
    name: { en: 'Operations & Finance', ar: 'العمليات والمالية' },
    contextLine: {
      en: 'Five workflows live · the agency\'s own engine — resourcing, retainers, approvals and billing.',
      ar: 'خمسة تدفقات نشطة · محرّك الوكالة نفسه — الموارد والاستبقاء والاعتمادات والفوترة.'
    },
    kpiSeeds: [
      { label: { en: 'Retainer utilisation', ar: 'استغلال الاستبقاء' }, format: 'pct', range: [78, 96], highlight: true },
      { label: { en: 'Over-serviced accounts', ar: 'حسابات تجاوزت النطاق' }, format: 'int', range: [1, 6] },
      { label: { en: 'Invoices pending', ar: 'فواتير معلّقة' }, format: 'int', range: [6, 24] },
      { label: { en: 'Approvals pending', ar: 'موافقات معلّقة' }, format: 'int', range: [4, 18] }
    ],
    solutions: [
      {
        slug: 'retainer-burn',
        name: { en: 'Retainer Burn Tracker', ar: 'متتبع استهلاك الاستبقاء' },
        context: {
          en: 'Internal: watches hours logged against each retainer and flags over- or under-servicing before it hurts margin.',
          ar: 'داخلي: يراقب الساعات المسجّلة مقابل كل عقد استبقاء، وينبّه على تجاوز النطاق أو قصوره قبل أن يضرّ الهامش.'
        },
        scope: 'internal',
        systems: ['Harvest', 'HubSpot', 'Sheets'],
        kpiSeeds: [
          { label: { en: 'RETAINER UTILISATION', ar: 'استغلال الاستبقاء' }, format: 'pct', range: [78, 96], highlight: true },
          { label: { en: 'OVER-SERVICED ACCOUNTS', ar: 'حسابات تجاوزت النطاق' }, format: 'int', range: [1, 6] },
          { label: { en: 'HOURS LOGGED · 7D', ar: 'ساعات مسجّلة · 7 أيام' }, format: 'int', range: [400, 1200] },
          { label: { en: 'SCOPE-CREEP FLAGS', ar: 'تنبيهات تمدد النطاق' }, format: 'int', range: [2, 12] }
        ],
        chartTitle: { en: 'HOURS vs RETAINER CAP · 14D', ar: 'الساعات مقابل سقف الاستبقاء · 14 يومًا' },
        chartA: { en: 'Logged', ar: 'مسجّل' },
        chartB: { en: 'Cap', ar: 'السقف' },
        workflow: baseWorkflow('Time tracking', 'تتبع الوقت', 'Retainer terms', 'بنود الاستبقاء', 'Burn agent', 'وكيل الاستهلاك', 'Margin model', 'نموذج الهامش', 'Account ledger', 'سجل الحساب'),
        decisionTemplates: [
          { en: 'Flagged A-{m} at {q}0% retainer burn mid-month', ar: 'تنبيه A-{m} عند {q}0% من الاستبقاء منتصف الشهر' }
        ],
        interventionTemplates: [
          { en: 'A-{m} over retainer by {q}0% · approve scope talk', ar: 'A-{m} تجاوز الاستبقاء بـ {q}0% · اعتماد نقاش النطاق' }
        ],
        activityTemplates: [
          { en: 'Reconciled {n} timesheets across {q} accounts', ar: 'تسوية {n} سجل وقت عبر {q} حساب' }
        ]
      },
      {
        slug: 'resourcing',
        name: { en: 'Resource Allocation', ar: 'توزيع الموارد' },
        context: {
          en: 'Internal: matches designers, editors and strategists to live projects by skill and capacity — no double-booking.',
          ar: 'داخلي: يطابق المصممين والمونتيرين والاستراتيجيين بالمشاريع الحية حسب المهارة والطاقة — دون ازدواج الحجز.'
        },
        scope: 'internal',
        systems: ['Asana', 'Harvest', 'Slack'],
        kpiSeeds: [
          { label: { en: 'PEOPLE SCHEDULED', ar: 'أفراد مجدولون' }, format: 'int', range: [20, 60] },
          { label: { en: 'CAPACITY UTILISATION', ar: 'استغلال الطاقة' }, format: 'pct', range: [68, 90], highlight: true },
          { label: { en: 'OVER-BOOKINGS', ar: 'حجوزات مزدوجة' }, format: 'int', range: [0, 6] },
          { label: { en: 'UNASSIGNED TASKS', ar: 'مهام دون إسناد' }, format: 'int', range: [4, 24] }
        ],
        chartTitle: { en: 'DEMAND vs CAPACITY · 14D', ar: 'الطلب مقابل الطاقة · 14 يومًا' },
        chartA: { en: 'Demand', ar: 'الطلب' },
        chartB: { en: 'Capacity', ar: 'الطاقة' },
        workflow: baseWorkflow('Project demand', 'طلب المشاريع', 'Team skills', 'مهارات الفريق', 'Resourcing agent', 'وكيل الموارد', 'Capacity board', 'لوحة الطاقة', 'Assignments', 'إسنادات'),
        decisionTemplates: [
          { en: 'Assigned {q} specialists to project P-{n}', ar: 'إسناد {q} مختص للمشروع P-{n}' }
        ],
        interventionTemplates: [
          { en: 'Designer over-booked across {q} projects · approve rebalance', ar: 'مصمم محجوز مزدوجًا عبر {q} مشاريع · اعتماد إعادة التوزيع' }
        ],
        activityTemplates: [
          { en: 'Balanced {n} assignments across {q} projects', ar: 'موازنة {n} إسناد عبر {q} مشروع' }
        ]
      },
      {
        slug: 'approvals-orchestration',
        name: { en: 'Approvals Orchestration', ar: 'تنسيق الاعتمادات' },
        context: {
          en: 'Routes creative and budget approvals to the right signer and consolidates feedback so nothing stalls.',
          ar: 'يوجّه اعتمادات الإبداع والميزانية للموقّع المناسب ويجمّع الملاحظات، فلا يتوقف شيء.'
        },
        scope: 'delivery',
        systems: ['Asana', 'Email', 'WhatsApp'],
        kpiSeeds: [
          { label: { en: 'ITEMS IN REVIEW', ar: 'عناصر قيد المراجعة' }, format: 'int', range: [20, 70] },
          { label: { en: 'AVG APPROVAL CYCLE', ar: 'متوسط دورة الاعتماد' }, format: 'hrs', range: [2, 12], highlight: true },
          { label: { en: 'OVERDUE APPROVALS', ar: 'اعتمادات متأخرة' }, format: 'int', range: [2, 14] },
          { label: { en: 'ROUNDS PER ITEM', ar: 'جولات لكل عنصر' }, format: 'int', range: [1, 4] }
        ],
        chartTitle: { en: 'SUBMITTED vs APPROVED · 14D', ar: 'مُقدَّم مقابل معتمد · 14 يومًا' },
        chartA: { en: 'Submitted', ar: 'مُقدَّم' },
        chartB: { en: 'Approved', ar: 'معتمد' },
        workflow: baseWorkflow('Review requests', 'طلبات المراجعة', 'Approver matrix', 'مصفوفة المعتمدين', 'Approval agent', 'وكيل الاعتماد', 'Feedback merge', 'دمج الملاحظات', 'Sign-off log', 'سجل الاعتماد'),
        decisionTemplates: [
          { en: 'Routed item IT-{n} to approver for sign-off', ar: 'توجيه العنصر IT-{n} للمعتمد للتوقيع' }
        ],
        interventionTemplates: [
          { en: 'Item IT-{n} overdue {q}d · approve escalation', ar: 'العنصر IT-{n} متأخر {q} يوم · اعتماد التصعيد' }
        ],
        activityTemplates: [
          { en: 'Routed {n} items through {q} approval steps', ar: 'توجيه {n} عنصرًا عبر {q} خطوة اعتماد' }
        ]
      },
      {
        slug: 'billing-ops',
        name: { en: 'Billing & Finance Ops', ar: 'الفوترة والعمليات المالية' },
        context: {
          en: 'Internal: turns delivered work into accurate invoices, tracks receivables and keeps ZATCA e-invoicing clean.',
          ar: 'داخلي: يحوّل العمل المُسلَّم إلى فواتير دقيقة، ويتتبع المستحقات، ويبقي الفوترة الإلكترونية (هيئة الزكاة) سليمة.'
        },
        scope: 'internal',
        systems: ['ERP', 'ZATCA', 'Bank APIs'],
        kpiSeeds: [
          { label: { en: 'INVOICES ISSUED · 30D', ar: 'فواتير صادرة · 30 يوم' }, format: 'int', range: [30, 90] },
          { label: { en: 'ON-TIME COLLECTION', ar: 'تحصيل في الوقت' }, format: 'pct', range: [70, 92], highlight: true },
          { label: { en: 'RECEIVABLES OVER 60D', ar: 'مستحقات > 60 يوم' }, format: 'sar', range: [1, 5] },
          { label: { en: 'E-INVOICE ACCURACY', ar: 'دقة الفاتورة الإلكترونية' }, format: 'pct', range: [96, 100] }
        ],
        chartTitle: { en: 'INVOICED vs COLLECTED · 14D', ar: 'مُفوتر مقابل مُحصَّل · 14 يومًا' },
        chartA: { en: 'Invoiced', ar: 'مُفوتر' },
        chartB: { en: 'Collected', ar: 'مُحصَّل' },
        workflow: baseWorkflow('Delivered work', 'عمل مُسلَّم', 'Retainer terms', 'بنود الاستبقاء', 'Billing agent', 'وكيل الفوترة', 'ZATCA e-invoice', 'فاتورة هيئة الزكاة', 'AR ledger', 'سجل المستحقات'),
        decisionTemplates: [
          { en: 'Issued invoice INV-{n} for account A-{m}', ar: 'إصدار الفاتورة INV-{n} للحساب A-{m}' }
        ],
        interventionTemplates: [
          { en: 'A-{m} receivable {q}0d overdue · approve dunning step', ar: 'مستحق A-{m} متأخر {q}0 يوم · اعتماد خطوة المطالبة' }
        ],
        activityTemplates: [
          { en: 'Issued {n} invoices · {q} cleared e-invoicing', ar: 'إصدار {n} فاتورة · {q} اجتازت الفوترة الإلكترونية' }
        ]
      }
    ]
  }
]
