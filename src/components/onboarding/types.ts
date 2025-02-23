export interface FormErrors {
  [key: string]: string | undefined;
}

export const onboardingRoutes = {
  TERMS: "/lab/terms",
  ATTACHMENT: "/lab/attachment",
  CONTACT: "/lab/contact",
  INFORMATION: "/lab/information",
  ACTIVITY: "/lab/activity",
  NEXT_STEP: "/lab/next-step"
} as const;

export enum editRoutes {
  TERMS = '/x/profile/edit/terms',
  ATTACHMENT = '/x/profile/edit/attachment',
  CONTACT = '/x/profile/edit/contact',
  BASIC_INFO = '/x/profile/edit/basic-info',
  ADDRESS = '/x/profile/edit/address',
  EDUCATION = '/x/profile/edit/education',
}
