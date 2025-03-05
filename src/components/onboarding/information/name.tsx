import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { InformationSchema } from "./validation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface NameProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
}

const Name = ({ register, errors }: NameProps) => {
  // Add ref for scrolling to the name section
  const nameRef = useRef<HTMLDivElement>(null);

  // Watch for validation errors
  useEffect(() => {
    if (errors.fullname) {
      // Show error in toast
      toast.error(errors.fullname.message?.toString() || "يرجى إدخال الاسم الكامل", {
        style: {
          background: 'rgb(239 68 68)',
          color: 'white',
          border: 'none',
          textAlign: 'right',
          direction: 'rtl'
        }
      });
      
      // Scroll to name section
      if (nameRef.current) {
        nameRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [errors.fullname]);

  return (
    // <div className="grid grid-cols-2 gap-6">
    //   <div>
    //     <label htmlFor="name" className="block mb-2 text-sm font-medium">
    //       اسم المستخدم
    //     </label>
    //     <Input
    //       id="name"
    //       placeholder="اسم المستخدم"
    //       dir="rtl"
    //       className="text-right"
    //       {...register('name')}
    //     />
    //     {errors.name && (
    //       <span className="text-red-500 text-sm">{errors.name.message}</span>
    //     )}
    //   </div>

      <div className="flex flex-col w-full" ref={nameRef}>
        <label htmlFor="fullname" className="block mb-2 text-sm font-medium">
          الاسم الكامل
        </label>
        <Input
          id="fullname"
          placeholder="الاسم الكامل"
          dir="rtl"
          className="text-right"
          {...register('fullname')}
        />
        {/* Removed inline error display */}
      </div>
    // </div>
  );
};

export default Name; 