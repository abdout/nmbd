'use server';
import {
  NewDealType,
  stepTwoSchema,
  stepOneSchema,
  stepThreeSchema,
} from '@/components/onboarding/schemas';
import { onboardingRoutes } from '@/components/onboarding/types';

interface SubmitDealActionReturnType {
  redirect?: onboardingRoutes;
  errorMsg?: string;
  success?: boolean;
}

export const submitDealAction = async (
  deal: NewDealType
): Promise<SubmitDealActionReturnType> => {
  const stepOneValidated = stepOneSchema.safeParse(deal);
  if (!stepOneValidated.success) {
    return {
      redirect: onboardingRoutes.TERMS,
      errorMsg: 'Please validate product info.',
    };
  }

  const stepTwoValidated = stepTwoSchema.safeParse(deal);
  if (!stepTwoValidated.success) {
    return {
      redirect: onboardingRoutes.ATTACHMENT,
      errorMsg: 'Please validate coupon details.',
    };
  }

  const stepThreeValidated = stepThreeSchema.safeParse(deal);
  if (!stepThreeValidated.success) {
    return {
      redirect: onboardingRoutes.CONTACT,
      errorMsg: 'Please validate contact info.',
    };
  }
  const retVal = { success: true, redirect: onboardingRoutes.CONTACT };
  console.log(retVal);
  return retVal;
};
