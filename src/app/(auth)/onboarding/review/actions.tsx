// 'use server';
// import {
//   NewDealType,
//   stepTwoSchema,
//   stepOneSchema,
//   stepThreeSchema,
// } from '@/components/add/schemas';
// import { AddDealRoutes } from '@/components/add/types';

// interface SubmitDealActionReturnType {
//   redirect?: AddDealRoutes;
//   errorMsg?: string;
//   success?: boolean;
// }

// export const submitDealAction = async (
//   deal: NewDealType
// ): Promise<SubmitDealActionReturnType> => {
//   const stepOneValidated = stepOneSchema.safeParse(deal);
//   if (!stepOneValidated.success) {
//     return {
//       redirect: AddDealRoutes.PRODUCT_INFO,
//       errorMsg: 'Please validate product info.',
//     };
//   }

//   const stepTwoValidated = stepTwoSchema.safeParse(deal);
//   if (!stepTwoValidated.success) {
//     return {
//       redirect: AddDealRoutes.COUPON_DETAILS,
//       errorMsg: 'Please validate coupon details.',
//     };
//   }

//   const stepThreeValidated = stepThreeSchema.safeParse(deal);
//   if (!stepThreeValidated.success) {
//     return {
//       redirect: AddDealRoutes.PRODUCT_INFO,
//       errorMsg: 'Please validate contact info.',
//     };
//   }
//   const retVal = { success: true, redirect: AddDealRoutes.PRODUCT_INFO };
//   console.log(retVal);
//   return retVal;
// };

import React from 'react'

const actions = () => {
  return (
    <div>actions</div>
  )
}

export default actions