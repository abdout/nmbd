export interface FormErrors {
  [key: string]: string | undefined;
}

export const onboardingRoutes = {
  TERMS: "/onboarding/terms",
  ATTACHMENT: "/onboarding/attachment",
  CONTACT: "/onboarding/contact",
  INFORMATION: "/onboarding/information",
  EDUCATION: "/onboarding/education",
  ACTIVITY: "/onboarding/activity",
  REVIEW: "/onboarding/review"
} as const;

export enum editRoutes {
  TERMS = '/x/profile/edit/terms',
  ATTACHMENT = '/x/profile/edit/attachment',
  CONTACT = '/x/profile/edit/contact',
  BASIC_INFO = '/x/profile/edit/basic-info',
  ADDRESS = '/x/profile/edit/address',
  EDUCATION = '/x/profile/edit/education',
}
