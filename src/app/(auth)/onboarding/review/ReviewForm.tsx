// 'use client';
// import { submitDealAction } from './actions';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import { useAddDealContext } from '@/components/add/contexts/addDealContext';
// import { NewDealType } from '@/components/add/schemas';
// import SubmitButton from '@/components/add/components/SubmitButton';

// export default function ReviewForm() {
//   const router = useRouter();
//   const { newDealData, resetLocalStorage } = useAddDealContext();

//   const { name, link, coupon, discount, contactName, contactEmail } =
//     newDealData;

//   const handleFormSubmit = async (formData: FormData) => {
//     const res = await submitDealAction(newDealData as NewDealType);
//     const { redirect, errorMsg, success } = res;

//     if (success) {
//       toast.success('Deal submitted successfully');
//       resetLocalStorage();
//     } else if (errorMsg) {
//       toast.error(errorMsg);
//     }
//     if (redirect) {
//       return router.push(redirect);
//     }
//   };

//   return (
//     <form
//       action={handleFormSubmit}
//       className="flex flex-1 flex-col gap-2 items-stretch lg:max-w-[700px]"
//     >
//       <p className="text-xl md:text-3xl">Name: {name}</p>
//       <p className="font-light text-white/90">
//         Link:{' '}
//         <a
//           href={link}
//           target="_blank"
//           rel="noreferrer"
//           className="font-normal underline hover:text-teal-500"
//         >
//           {link}
//         </a>
//       </p>
//       <p className="">Coupon: {coupon}</p>
//       <p className="">Discount: {discount}%</p>
//       <p className="">Contact Name: {contactName}</p>
//       <p className="">Contact Email: {contactEmail}</p>
//       <SubmitButton text="Submit" />
//     </form>
//   );
// }