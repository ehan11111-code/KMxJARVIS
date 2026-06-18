import type { Bi } from './mock/types'

/**
 * Kattan Media operates many brands at once. The portal is one unified workspace
 * where each client can be selected and every dashboard, decision and report is
 * scoped to that client. `all` is the agency-wide rollup across every account.
 *
 * Clients below are drawn from Kattan Media's own published case studies
 * (company profile 2026) — used here as demo workspaces.
 */
export type ClientSeed = {
  id: string
  name: Bi
  sector: Bi
  /** short tag shown in the switcher */
  tag: Bi
  /** extra match terms for the assistant */
  aliases?: string[]
  /** numeric weight — larger clients carry larger volumes */
  weight: number
}

export const ALL_CLIENTS_ID = 'all'

export const CLIENTS: ClientSeed[] = [
  {
    id: ALL_CLIENTS_ID,
    name: { en: 'All Clients', ar: 'كل العملاء' },
    sector: { en: 'Agency-wide rollup', ar: 'إجمالي الوكالة' },
    tag: { en: 'Portfolio', ar: 'المحفظة' },
    weight: 8
  },
  {
    id: 'stc',
    name: { en: 'stc', ar: 'إس تي سي' },
    sector: { en: 'Telecom & technology', ar: 'الاتصالات والتقنية' },
    tag: { en: 'Telecom', ar: 'اتصالات' },
    aliases: ['stc', 'اس تي سي', 'الاتصالات السعوديه'],
    weight: 1.35
  },
  {
    id: 'mercedes',
    name: { en: 'Mercedes-Benz', ar: 'مرسيدس-بنز' },
    sector: { en: 'Automotive · luxury', ar: 'سيارات · فاخرة' },
    tag: { en: 'Automotive', ar: 'سيارات' },
    aliases: ['mercedes', 'benz', 'مرسيدس'],
    weight: 1.1
  },
  {
    id: 'saudia',
    name: { en: 'Saudia', ar: 'الخطوط السعودية' },
    sector: { en: 'Aviation', ar: 'الطيران' },
    tag: { en: 'Aviation', ar: 'طيران' },
    aliases: ['saudia', 'saudi airlines', 'الخطوط', 'السعوديه'],
    weight: 1.2
  },
  {
    id: 'tourism',
    name: { en: 'Ministry of Tourism', ar: 'وزارة السياحة' },
    sector: { en: 'Government · tourism', ar: 'حكومي · سياحة' },
    tag: { en: 'Government', ar: 'حكومي' },
    aliases: ['tourism', 'ministry of tourism', 'السياحه'],
    weight: 1.15
  },
  {
    id: 'culture',
    name: { en: 'Ministry of Culture', ar: 'وزارة الثقافة' },
    sector: { en: 'Government · culture · Biennale', ar: 'حكومي · ثقافة · بينالي' },
    tag: { en: 'Culture', ar: 'ثقافة' },
    aliases: ['culture', 'biennale', 'الثقافه', 'بينالي'],
    weight: 1.0
  },
  {
    id: 'mcdonalds',
    name: { en: "McDonald's", ar: 'ماكدونالدز' },
    sector: { en: 'QSR · food & beverage', ar: 'مطاعم · أغذية ومشروبات' },
    tag: { en: 'F&B', ar: 'أغذية' },
    aliases: ['mcdonald', 'ماكدونالدز'],
    weight: 1.05
  },
  {
    id: 'lipton',
    name: { en: 'Lipton', ar: 'ليبتون' },
    sector: { en: 'FMCG · Unilever', ar: 'سلع استهلاكية · يونيليفر' },
    tag: { en: 'FMCG', ar: 'استهلاكي' },
    aliases: ['lipton', 'unilever', 'ليبتون', 'يونيليفر'],
    weight: 0.9
  },
  {
    id: 'masar',
    name: { en: 'Masar', ar: 'مسار' },
    sector: { en: 'Real estate · destination', ar: 'عقاري · وجهة' },
    tag: { en: 'Real estate', ar: 'عقاري' },
    aliases: ['masar', 'مسار', 'قلب مكه'],
    weight: 1.0
  }
]

export function getClient(id: string): ClientSeed {
  return CLIENTS.find((c) => c.id === id) ?? CLIENTS[0]
}

export const DEFAULT_CLIENT = ALL_CLIENTS_ID
