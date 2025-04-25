"use client";

import { useFormStatus } from "react-dom";
import {Button} from '@/components/ui/button';
import { useEffect } from "react";

interface AddPostButtonProps {
  isSubmitting?: boolean;
}

const AddPostButton = ({ isSubmitting = false }: AddPostButtonProps) => {
  console.log("debug posting: AddPostButton rendered, isSubmitting:", isSubmitting);
  const { pending } = useFormStatus();
  
  const isDisabled = pending || isSubmitting;
  
  useEffect(() => {
    console.log("debug posting: Post button state changed - pending:", pending, "isSubmitting:", isSubmitting);
  }, [pending, isSubmitting]);
  
  return (
    <Button
      className="relative top-[4.2rem] right-[10rem] w-[70px] h-[39px] rounded-full text-[#fcfcfc] text-sm font-bold bg-[#0077B5]"
      disabled={isDisabled}
      onClick={() => {
        console.log("debug posting: Post button clicked");
      }}
    >
      {isDisabled ? (
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
