"use client";

import { useFormStatus } from "react-dom";
import {Button} from '@/components/ui/button';

const AddPostButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      className="relative top-[4rem] left-[0rem] w-[70px] h-[39px] rounded-full text-[#fcfcfc] text-sm font-bold bg-[#0077B5]"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="inline-block h-[10px] w-[10px] animate-spin rounded-full border-2 border-white-300 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          Sending
        </div>
      ) : (
        "نشر"
      )}
    </Button>
  );
};

export default AddPostButton;
