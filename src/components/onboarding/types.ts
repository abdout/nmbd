export interface FormErrors {
  [key: string]: string | undefined;
}

export enum onboardingRoutes {
  TERMS = '/onboarding/terms',
  ATTACHMENT = '/onboarding/attachment',
  CONTACT = '/onboarding/contact',
  BASIC_INFO = '/onboarding/basic-info',
  ADDRESS = '/onboarding/address',
  EDUCATION = '/onboarding/education',
}

export enum editRoutes {
  TERMS = '/x/profile/edit/terms',
  ATTACHMENT = '/x/profile/edit/attachment',
  CONTACT = '/x/profile/edit/contact',
  BASIC_INFO = '/x/profile/edit/basic-info',
  ADDRESS = '/x/profile/edit/address',
  EDUCATION = '/x/profile/edit/education',
}
