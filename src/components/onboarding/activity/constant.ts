export const CLUB_TYPES = [
  'رياضي',
  'ثقافي',
  'اجتماعي',
  'فني',
  'علمي',
  'أخرى'
] as const;

export const SKILLS = [
  'برمجة',
  'تصميم جرافيك',
  'تصوير',
  'كتابة محتوى',
  'ترجمة',
  'تحرير فيديو',
  'إدارة مشاريع',
  'تسويق رقمي',
  'تحليل بيانات',
  'تصميم مواقع',
  'إدارة وسائل التواصل',
  'تنظيم فعاليات',
  'خدمة عملاء',
  'تدريب وتعليم',
  'تصميم UX/UI',
  'تطوير تطبيقات',
  'إدارة قواعد بيانات',
  'تحليل نظم',
  'أمن سيبراني',
  'ذكاء اصطناعي'
] as const;

export const INTERESTS = [
  'تكنولوجيا',
  'فنون',
  'رياضة',
  'موسيقى',
  'قراءة',
  'كتابة',
  'سفر',
  'تصوير',
  'طبخ',
  'تعلم لغات',
  'عمل تطوعي',
  'حماية البيئة',
  'تنمية بشرية',
  'ريادة أعمال',
  'علوم',
  'سياسة',
  'تاريخ',
  'ثقافة',
  'تعليم',
  'صحة ولياقة'
] as const;

export type ActivityFieldName = 
  | 'partyMember' | 'partyName' | 'partyStartDate' | 'partyEndDate'
  | 'unionMember' | 'unionName' | 'unionStartDate' | 'unionEndDate'
  | 'ngoMember' | 'ngoName' | 'ngoActivity'
  | 'clubMember' | 'clubName' | 'clubType'
  | 'voluntaryMember' | 'voluntaryName' | 'voluntaryRole' | 'voluntaryStartDate' | 'voluntaryEndDate'
  | 'skills' | 'interests';

type ActivityField = {
  name: ActivityFieldName;
  label: string;
  type: 'toggle' | 'text' | 'date' | 'textarea' | 'select';
  conditional?: ActivityFieldName;
  options?: readonly string[];
};

export const ACTIVITY_FIELDS: {
  political: ActivityField[];
  union: ActivityField[];
  social: ActivityField[];
  club: ActivityField[];
} = {
  political: [
    { name: 'partyMember' as const, label: 'عضو في حزب/حركة سياسية', type: 'toggle' },
    { name: 'partyName' as const, label: 'اسم الحزب/الحركة', type: 'text', conditional: 'partyMember' },
    { name: 'partyStartDate' as const, label: 'تاريخ البداية', type: 'date', conditional: 'partyMember' },
    { name: 'partyEndDate' as const, label: 'تاريخ النهاية', type: 'date', conditional: 'partyMember' },
  ],
  union: [
    { name: 'unionMember' as const, label: 'عضو في نقابة/اتحاد طلابي', type: 'toggle' },
    { name: 'unionName' as const, label: 'اسم النقابة/الاتحاد', type: 'text', conditional: 'unionMember' },
    { name: 'unionStartDate' as const, label: 'تاريخ البداية', type: 'date', conditional: 'unionMember' },
    { name: 'unionEndDate' as const, label: 'تاريخ النهاية', type: 'date', conditional: 'unionMember' },
  ],
  social: [
    { name: 'ngoMember' as const, label: 'عضو في منظمة/مجموعة ثقافية', type: 'toggle' },
    { name: 'ngoName' as const, label: 'اسم المنظمة/المجموعة', type: 'text', conditional: 'ngoMember' },
    { name: 'ngoActivity' as const, label: 'وصف النشاط', type: 'textarea', conditional: 'ngoMember' },
  ],
  club: [
    { name: 'clubMember' as const, label: 'عضو في نادي شبابي', type: 'toggle' },
    { name: 'clubName' as const, label: 'اسم النادي', type: 'text', conditional: 'clubMember' },
    { name: 'clubType' as const, label: 'نوع النادي', type: 'select', options: CLUB_TYPES, conditional: 'clubMember' },
  ],
} as const; 